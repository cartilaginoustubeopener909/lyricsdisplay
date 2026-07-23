package tech.zmario.lyricsdisplay;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Base64;
import java.io.ByteArrayOutputStream;

public class MediaReceiver extends BroadcastReceiver {
  public static String currentTitle = "";
  public static String currentArtist = "";
  public static String currentAlbum = "";
  public static double currentDurationMs = 0;
  public static double currentPositionMs = 0;
  public static boolean isPlaying = false;
  public static long lastPositionUpdateTime = 0;
  public static String cachedCoverBase64 = null;

  private static String lastTitle = "";
  private static String lastArtist = "";

  @Override
  public void onReceive(Context context, Intent intent) {
    if (intent == null) return;
    Bundle extras = intent.getExtras();
    if (extras == null) return;

    String action = intent.getAction();

    String title = getExtraString(extras, "track", "title", "trackName");
    String artist = getExtraString(extras, "artist", "artistName");
    String album = getExtraString(extras, "album");

    long duration = getExtraLong(extras, -1, "duration", "durationMs", "length");
    long position =
        getExtraLong(extras, 0, "position", "positionMs", "progress", "playbackPosition");

    boolean playing = isPlaying;
    if (extras.containsKey("playing")) {
      playing = extras.getBoolean("playing");
    } else if (extras.containsKey("playstate")) {
      Object val = extras.get("playstate");
      if (val instanceof Boolean) {
        playing = (Boolean) val;
      } else if (val instanceof Number) {
        int state = ((Number) val).intValue();
        playing = (state == 3);
      }
    } else if (extras.containsKey("isPlaying")) {
      playing = extras.getBoolean("isPlaying");
    } else if (action != null
        && (action.contains("playstatechanged")
            || action.contains("playbackstatechanged")
            || action.contains("playstate"))) {
      playing =
          action.contains("playstatechanged")
              || action.contains("playbackstatechanged")
              || action.contains("playstate"); // fallback
    }

    if (!title.isEmpty()) currentTitle = title;
    if (!artist.isEmpty()) currentArtist = artist;
    if (!album.isEmpty()) currentAlbum = album;
    if (duration > 0) currentDurationMs = duration;

    currentPositionMs = position;
    isPlaying = playing;
    lastPositionUpdateTime = android.os.SystemClock.elapsedRealtime();

    if (!currentTitle.equals(lastTitle) || !currentArtist.equals(lastArtist)) {
      lastTitle = currentTitle;
      lastArtist = currentArtist;

      Bitmap bitmap = null;
      if (extras.containsKey("albumart")) {
        Object art = extras.get("albumart");
        if (art instanceof Bitmap) bitmap = (Bitmap) art;
      } else if (extras.containsKey("cover")) {
        Object cover = extras.get("cover");
        if (cover instanceof Bitmap) bitmap = (Bitmap) cover;
      }

      if (bitmap != null) {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
          bitmap.compress(Bitmap.CompressFormat.JPEG, 60, byteArrayOutputStream);
          byte[] byteArray = byteArrayOutputStream.toByteArray();
          String encoded = Base64.encodeToString(byteArray, Base64.NO_WRAP);
          cachedCoverBase64 = "data:image/jpeg;base64," + encoded;
        } catch (Exception e) {
          cachedCoverBase64 = null;
        }
      } else {
        cachedCoverBase64 = null;
      }
    }
  }

  private String getExtraString(Bundle extras, String... keys) {
    for (String key : keys) {
      if (extras.containsKey(key)) {
        Object val = extras.get(key);
        if (val != null) {
          String str = val.toString().trim();
          if (!str.isEmpty()) return str;
        }
      }
    }
    return "";
  }

  private long getExtraLong(Bundle extras, long fallback, String... keys) {
    for (String key : keys) {
      if (extras.containsKey(key)) {
        Object val = extras.get(key);
        if (val instanceof Number) {
          return ((Number) val).longValue();
        }
      }
    }
    return fallback;
  }
}
