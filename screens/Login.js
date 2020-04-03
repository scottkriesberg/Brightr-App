import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import firebase from '../firebase';
import { Button } from 'react-native-elements';
import ButtonStyles from '../styles/button.js';
import ContainerStyles from '../styles/container.js';

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
		// Create a root reference
		var storageRef = firebase.storage().ref();

		// Create a reference to 'mountains.jpg'
		var mountainsRef = storageRef.child('map.jpg');

		// Create a reference to 'images/mountains.jpg'
		var mountainImagesRef = storageRef.child('images/map.jpg');

		//update demo users
		// firebase.firestore().collection('tutors').doc('usdXvClRwPGhdPgjJomX').update({
		// 	classes: {
		// 		'CSCI 103': {
		// 			name: 'Intro to programming',
		// 			code: '103',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: false
		// 		},
		// 		'CSCI 104': {
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		},
		// 		'CSCI 105': {
		// 			name: 'Intro to programming',
		// 			code: '103',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: false
		// 		},
		// 		'CSCI 106': {
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		},
		// 		'CSCI 103': {
		// 			name: 'Intro to programming',
		// 			code: '103',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: false
		// 		},
		// 		'CSCI 110': {
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		},
		// 		'CSCI 125': {
		// 			name: 'Intro to programming',
		// 			code: '103',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: false
		// 		},
		// 		'CSCI 136': {
		// 			name: 'Data Structures and Algorithms',
		// 			code: '104',
		// 			department: 'CSCI',
		// 			rating: 0,
		// 			grade: 'A',
		// 			verified: true
		// 		}
		// 	}
		// });
		// firebase.firestore().collection('tutors').doc('usdXvClRwPGhdPgjJomX').update({
		// 	classes: {
		// 		'CSCI 103.verified': true
		// 	}
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
		// var ref = firebase.firestore().collection('tutors').doc('zM9iERetSQBrLlbdxHeR');
		// this.addRating(ref, 4);
	}

	render() {
		return (
			<View style={styles.screenContainer}>
				<View style={styles.titleContainer}>
					<Text h1 style={styles.title}>
						Brightr
					</Text>
				</View>
				<View style={styles.loginInputContainer}>
					<TextInput
						style={styles.loginInput}
						label="Email"
						value={this.state.email}
						onChangeText={(email) => this.setState({ email })}
						placeholder="Email"
						placeholderTextColor="white"
						autoCapitalize="none"
					/>
					<TextInput
						style={styles.loginInput}
						value={this.state.password}
						onChangeText={(password) => this.setState({ password })}
						placeholder="Password"
						placeholderTextColor="white"
						secureTextEntry={true}
					/>
					<Button type="clear" title="Login" style={styles.loginButton} onPress={this.handleSignIn} />
				</View>
				<View style={styles.signUpButtonContainer}>
					<Button
						type="clear"
						style={styles.signUpButton}
						titleStyle={styles.signUpButtonTitle}
						title="Don't have an account yet? Sign up (to student)"
						onPress={() =>
							this.props.navigation.navigate('StudentMap', {
								uid: 'KE61CyI6GmbCh2SPOtEi'
							})}
					/>
					<Button
						type="clear"
						style={styles.signUpButton}
						titleStyle={styles.signUpButtonTitle}
						title="Don't have an account yet? Sign up (to tutor)"
						onPress={() =>
							this.props.navigation.navigate('TutorWorkSetUp', {
								uid: 'usdXvClRwPGhdPgjJomX'
							})}
					/>
				</View>
			</View>
		);
	}
}

export default Login;

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: '#6A7BD6',
		alignItems: 'stretch'
	},
	titleContainer: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	title: {
		color: '#FFFFFF',
		fontStyle: 'italic',
		fontWeight: '900',
		fontSize: 60,
		alignSelf: 'center',
		margin: '10%'
	},
	loginInputContainer: {
		flex: 1,
		justifyContent: 'center',
		width: '100%',
		alignItems: 'center',
		alignContent: 'center'
	},
	loginInput: {
		width: '90%%',
		margin: '2%',
		padding: '3%',
		fontSize: 16,
		borderColor: 'white',
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left'
	},
	loginButton: {
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 15,
		width: 100,
		margin: '5%',
		alignSelf: 'center'
	},
	signUpButtonContainer: {
		flex: 1,
		alignItems: 'center'
	},
	signUpButton: {
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 15,
		width: '75%',
		margin: '5%',
		alignSelf: 'center'
	},
	signUpButtonTitle: {
		color: 'white'
	}
});
