import React from 'react'
import Login from './screens/Login.js'
import SwitchNavigator from './navigation/SwitchNavigator'
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default class App extends React.Component {
    render() {
        return  (<SwitchNavigator />);
    }
}