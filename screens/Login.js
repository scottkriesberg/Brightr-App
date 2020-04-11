import React from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, Image } from 'react-native';
import firebase from '../firebase';
import { Button } from './components/buttons';
const logo = require('../assets/logo-09.png');

class Login extends React.Component {
	handleSignIn = () => {
		if (!this.validate()) {
			return;
		}
		const { email, password } = this.state;
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((user) => {
				const uid = user.user.uid;
				firebase.firestore().collection('students').doc(uid).get().then((doc) => {
					if (doc.exists) {
						this.props.navigation.navigate('StudentNavigator', { uid: uid });
					} else {
						firebase.firestore().collection('tutors').doc(uid).get().then((doc) => {
							if (doc.exists) {
								this.props.navigation.navigate('TutorNavigator', { uid: uid });
							} else {
								console.log('Error');
							}
						});
					}
				});
			})
			.catch((error) => {
				console.log(error.code);
				if (error.code == 'auth/invalid-email') {
					this.setState({ loginError: 'Please check your email format' });
				} else if (error.code == 'auth/user-not-found') {
					this.setState({ loginError: 'No account found with that email' });
				} else if (error.code == 'auth/wrong-password') {
					this.setState({ loginError: 'Wrong Password' });
				}
			});
	};

	state = {
		email: '',
		password: '',
		loginError: ''
	};

	componentDidMount() {}

	static navigationOptions = {
		headerShown: false
	};

	validate() {
		var valid = true;
		this.setState({
			loginError: ''
		});
		if (this.state.email == '') {
			this.setState({ loginError: 'Please enter an email' });
			valid = false;
		}
		if (this.state.password == '') {
			this.setState({ classesError: 'Please enter an email' });
			valid = false;
		}
		return valid;
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<View style={styles.screenContainer}>
					<View style={styles.titleContainer}>
						<Image style={styles.logoImage} source={logo} />
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
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.loginError}
						</Text>
					</View>
					<View style={styles.loginButtonContainer}>
						<Button
							type="secondary"
							buttonStyle={styles.loginButton}
							textStyle={styles.loginButtonText}
							text="Login"
							onPress={() => this.handleSignIn()}
						/>
					</View>
					<View style={styles.signUpButtonContainer}>
						<Button
							type="primary"
							text="Don't have an account yet? Sign up"
							buttonStyle={styles.signUpButton}
							onPress={() => this.props.navigation.navigate('SignUpBasicInfo')}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export default Login;

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: primaryColor,
		alignItems: 'stretch'
	},
	titleContainer: {
		flex: 2,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	logoImage: {
		height: '35%',
		width: '35%',
		resizeMode: 'contain'
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
		justifyContent: 'space-around',
		width: '100%',
		alignItems: 'center',
		alignContent: 'center'
	},
	loginInput: {
		width: '90%%',
		padding: '3%',
		fontSize: 16,
		borderColor: secondaryColor,
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left',
		color: secondaryColor
	},
	loginButtonContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		width: '100%',
		alignItems: 'center',
		alignContent: 'center'
	},
	loginButton: {
		height: '30%',
		justifyContent: 'center',
		padding: 1
	},
	signUpButtonContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	signUpButton: {
		padding: '2%'
	},
	errorText: {
		color: 'red',
		fontSize: 25,
		fontWeight: 'bold',
		marginTop: '5%'
	}
});
