import './global.css';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { AppRegistry } from 'react-native';
import App from './src/App';
import { OverlayScreen } from './src/screens/OverlayScreen';
import { name as appName } from './app.json';
import { registerTimerController } from '@lyricsdisplay/shared';
import BackgroundTimer from 'react-native-background-timer';

registerTimerController({
  setInterval: (callback, ms) => BackgroundTimer.setInterval(callback, ms),
  clearInterval: id => BackgroundTimer.clearInterval(id),
});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('Overlay', () => OverlayScreen);

AppRegistry.registerHeadlessTask('OverlayBackgroundTask', () => async () => {
    return new Promise((resolve) => {
        // never resolves, but keeps the js thread alive
    });
});
