import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

class SignUpChoice extends React.Component {
	state = {
		name: '',
		email: '',
		password: ''
	};

	static navigationOptions = {
		title: 'Type',
		headerStyle: {
			backgroundColor: secondaryColor
		},
		headerTintColor: primaryColor,
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 30
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.headingText}>What would you like to sign up to be?</Text>
				<TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
					<Text style={styles.buttonText}>Student</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
					<Text style={styles.buttonText}>Tutor</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => this.props.navigation.navigate('SignUpBasicInfo')}
				>
					<Text style={styles.buttonText}>Both</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: primaryColor,
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	headingText: {
		fontSize: 40,
		color: secondaryColor,
		textAlign: 'center'
	},
	button: {
		alignItems: 'center',
		backgroundColor: secondaryColor,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 15,
		width: '60%',
		height: '10%'
	},
	buttonText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: primaryColor
	},
	buttonSignup: {
		fontSize: 12
	}
});

export default SignUpChoice;
