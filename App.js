import React from 'react';
import SwitchNavigator from './navigation/SwitchNavigator';
import { decode, encode } from 'base-64';
import './screens/components/global';
global.crypto = require('@firebase/firestore');
global.crypto.getRandomValues = (byteArray) => {
	for (let i = 0; i < byteArray.length; i++) {
		byteArray[i] = Math.floor(256 * Math.random());
	}
};

if (!global.btoa) {
	global.btoa = encode;
}

if (!global.atob) {
	global.atob = decode;
}

export default class App extends React.Component {
	render() {
		return <SwitchNavigator screenProps={{ test: 'test' }} />;
	}
}
