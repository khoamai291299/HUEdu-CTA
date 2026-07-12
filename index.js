/**
 * index.js
 * Mục đích: Điểm khởi động ứng dụng (entry point) được Metro nạp đầu tiên.
 * Dependency: react-native gesture-handler (phải import đầu tiên), App.tsx, app.json.
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
