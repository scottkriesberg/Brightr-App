import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import firebase from '../firebase';
import ButtonStyles from '../styles/button.js';
import ContainerStyles from '../styles/container.js';
import InputStyles from '../styles/input.js';
import TextStyles from '../styles/text.js';

class Login extends React.Component {
	handleSignIn = () => {
		const { email, password } = this.state;
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((user) => this.props.navigation.navigate('StudentMap', { uid: user.uid }))
			.catch((error) => console.log(error));
	};

	state = {
		email: '',
		password: ''
	};

	componentDidMount() {
		//update demo users
		// firebase.firestore().collection('tutors').doc('usdXvClRwPGhdPgjJomX').update({
		// 	classes: [
		// 		{
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		}
		// 	]
		// });
		// firebase.firestore().collection('tutors').doc('zM9iERetSQBrLlbdxHeR').update({
		// 	classes: [
		// 		{
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		}
		// 	]
		// });
	}

	render() {
		return (
			<View style={ContainerStyles.container}>
				<Text h1 style={TextStyles.title}>
					Brightr
				</Text>
				<View style={ContainerStyles.inputContainer}>
					<TextInput
						style={InputStyles.loginInput}
						label="Email"
						value={this.state.email}
						onChangeText={(email) => this.setState({ email })}
						placeholder="Email"
						placeholderTextColor="white"
						autoCapitalize="none"
					/>
					<TextInput
						style={InputStyles.loginInput}
						value={this.state.password}
						onChangeText={(password) => this.setState({ password })}
						placeholder="Password"
						placeholderTextColor="white"
						secureTextEntry={true}
					/>
					<TouchableOpacity style={ButtonStyles.normalButton} onPress={this.handleSignIn}>
						<Text style={ButtonStyles.buttonText}>Login</Text>
					</TouchableOpacity>
				</View>

				<Button
					title="Don't have an account yet? Sign up (to student)"
					onPress={() =>
						this.props.navigation.navigate('StudentMap', {
							uid: 'KE61CyI6GmbCh2SPOtEi'
						})}
				/>
				<Button
					title="Don't have an account yet? Sign up (to tutor)"
					onPress={() =>
						this.props.navigation.navigate('TutorWorkSetUp', {
							uid: 'usdXvClRwPGhdPgjJomX'
						})}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonSignup: {
		fontSize: 12
	}
});

export default Login;
