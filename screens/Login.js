import React from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, Image } from 'react-native';
import firebase from '../firebase';
import { Button } from 'react-native-elements';
const logo = require('../assets/logo-09.png');

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

	componentDidMount() {}

	static navigationOptions = {
		headerShown: false
	};

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
						<Button type="clear" title="Login" style={styles.loginButton} onPress={this.handleSignIn} />
					</View>
					<View style={styles.signUpButtonContainer}>
						<Button
							type="clear"
							style={styles.signUpButton}
							titleStyle={styles.signUpButtonTitle}
							titleProps={{
								adjustsFontSizeToFit: true,
								numberOfLines: 1
							}}
							title="Don't have an account yet? Sign up"
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
		backgroundColor: '#6A7BD6',
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
		marginVertical: '10%',
		padding: '3%',
		fontSize: 16,
		borderColor: 'white',
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left',
		color: 'white'
	},
	loginButton: {
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 15,
		width: 100,
		marginTop: '15%'
	},
	signUpButtonContainer: {
		flex: 1.5,
		alignItems: 'center',
		justifyContent: 'center'
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
		color: 'white',
		fontSize: 20
	}
});
