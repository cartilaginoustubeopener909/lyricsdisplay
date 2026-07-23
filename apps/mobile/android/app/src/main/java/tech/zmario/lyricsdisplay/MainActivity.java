package tech.zmario.lyricsdisplay;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import tech.zmario.androidoverlay.service.OverlayService;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "mobile";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. We use {@link
   * DefaultReactActivityDelegate} which allows you to enable New Architecture with a single boolean
   * flags {@link DefaultNewArchitectureEntryPoint#getFabricEnabled()}
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this, getMainComponentName(), DefaultNewArchitectureEntryPoint.getFabricEnabled()) {
      @Override
      public void onPause() {
        if (OverlayService.getInstance() == null) {
          super.onPause();
        }
      }
    };
  }
}
