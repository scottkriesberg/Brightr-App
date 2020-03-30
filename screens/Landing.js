import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../firebase';
import ButtonStyles from '../styles/button.js';
import ContainerStyles from '../styles/container.js';
import ImageStyles from '../styles/image.js';
import TextStyles from '../styles/text.js';

const logo = require('../assets/logo-09.png');

class Landing extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<View style={ContainerStyles.landingContainer}>
				<View style={ContainerStyles.landingLogoContainer}>
					<Image style={ImageStyles.logoImage} source={logo} />
					<Text h1 style={TextStyles.title}>
						Brightr
					</Text>
				</View>
				{/* Button container */}
				<View style={ContainerStyles.inputContainer}>
					<Button
						type="clear"
						style={ButtonStyles.landingButton}
						onPress={() => this.props.navigation.navigate('Login')}
						title="Login"
					/>
					<Button
						style={ButtonStyles.landingButton}
						type="clear"
						onPress={() => this.props.navigation.navigate('Login')}
						title="Sign Up"
					/>
				</View>
			</View>
		);
	}
}

export default Landing;
