// Web-specific entry point for better performance
import './global.css';
import 'react-native-get-random-values';

// Web-specific polyfills
import 'react-native-url-polyfill/auto';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "Expo AV has been deprecated", 
  "Disconnected from Metro",
  "Warning: ReactDOM.render is no longer supported"
]);

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
