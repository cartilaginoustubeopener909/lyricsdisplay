package tech.zmario.lyricsdisplay;

import android.content.ComponentName;
import android.content.Context;
import android.graphics.Bitmap;
import android.media.AudioManager;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.media.session.PlaybackState;
import android.os.SystemClock;
import android.provider.Settings;
import android.util.Base64;
import android.view.KeyEvent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class SystemMediaModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private String cachedCoverBase64 = null;
  private String lastCoverTitle = "";

  public SystemMediaModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return "SystemMediaModule";
  }

  private boolean hasNotificationAccess() {
    String flat =
        Settings.Secure.getString(
            reactContext.getContentResolver(), "enabled_notification_listeners");
    return flat != null && flat.contains(reactContext.getPackageName());
  }

  @ReactMethod
  public void hasNotificationListenerAccess(Promise promise) {
    promise.resolve(hasNotificationAccess());
  }

  @ReactMethod
  public void requestNotificationAccess() {
    android.content.Intent intent =
        new android.content.Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    reactContext.startActivity(intent);
  }

  @ReactMethod
  public void getCurrentTrack(Promise promise) {
    if (!hasNotificationAccess()) {
      promise.resolve(null);
      return;
    }
    try {
      MediaSessionManager manager =
          (MediaSessionManager) reactContext.getSystemService(Context.MEDIA_SESSION_SERVICE);
      if (manager == null) {
        promise.resolve(null);
        return;
      }

      ComponentName cn = new ComponentName(reactContext, MediaListenerService.class);
      List<MediaController> controllers = manager.getActiveSessions(cn);
      if (controllers == null || controllers.isEmpty()) {
        promise.resolve(null);
        return;
      }

      MediaController active = null;
      for (MediaController c : controllers) {
        PlaybackState ps = c.getPlaybackState();
        if (ps != null && ps.getState() == PlaybackState.STATE_PLAYING) {
          active = c;
          break;
        }
      }
      if (active == null) active = controllers.get(0);

      MediaMetadata meta = active.getMetadata();
      if (meta == null) {
        promise.resolve(null);
        return;
      }

      PlaybackState ps = active.getPlaybackState();
      String title = meta.getString(MediaMetadata.METADATA_KEY_TITLE);
      String artist = meta.getString(MediaMetadata.METADATA_KEY_ARTIST);
      if (artist == null || artist.isEmpty())
        artist = meta.getString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST);
      String album = meta.getString(MediaMetadata.METADATA_KEY_ALBUM);
      long duration = meta.getLong(MediaMetadata.METADATA_KEY_DURATION);

      boolean isPlaying = ps != null && ps.getState() == PlaybackState.STATE_PLAYING;
      long position = ps != null ? ps.getPosition() : 0;
      if (isPlaying && ps != null && ps.getLastPositionUpdateTime() > 0)
        position += SystemClock.elapsedRealtime() - ps.getLastPositionUpdateTime();

      String key = title != null ? title : "";
      if (!key.equals(lastCoverTitle)) {
        lastCoverTitle = key;
        cachedCoverBase64 = null;
        try {
          Bitmap art = meta.getBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART);
          if (art == null) art = meta.getBitmap(MediaMetadata.METADATA_KEY_ART);
          if (art != null) {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            art.compress(Bitmap.CompressFormat.JPEG, 60, bos);
            cachedCoverBase64 =
                "data:image/jpeg;base64,"
                    + Base64.encodeToString(bos.toByteArray(), Base64.NO_WRAP);
          }
        } catch (Exception ignored) {
        }
      }

      WritableMap result = Arguments.createMap();
      result.putString("title", title != null ? title : "");
      result.putString("artist", artist != null ? artist : "");
      result.putString("album", album != null ? album : "");
      result.putDouble("duration_ms", duration);
      result.putDouble("position_ms", Math.max(0, position));
      result.putBoolean("playing", isPlaying);
      result.putString("cover", cachedCoverBase64);
      promise.resolve(result);

    } catch (Exception e) {
      promise.resolve(null);
    }
  }

  private void sendMediaKey(int keyCode) {
    AudioManager am = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
    if (am == null) return;
    long t = SystemClock.uptimeMillis();
    am.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_DOWN, keyCode, 0));
    am.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_UP, keyCode, 0));
  }

  @ReactMethod
  public void play() {
    sendMediaKey(KeyEvent.KEYCODE_MEDIA_PLAY);
  }

  @ReactMethod
  public void pause() {
    sendMediaKey(KeyEvent.KEYCODE_MEDIA_PAUSE);
  }

  @ReactMethod
  public void skipToNext() {
    sendMediaKey(KeyEvent.KEYCODE_MEDIA_NEXT);
  }

  @ReactMethod
  public void skipToPrevious() {
    sendMediaKey(KeyEvent.KEYCODE_MEDIA_PREVIOUS);
  }
}
