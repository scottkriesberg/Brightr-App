import React from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Text,
	TouchableWithoutFeedback,
	Keyboard,
	Alert
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Dropdown, SearchableDropdown } from './components/dropdown';

import firebase from '../firebase';

class SignUpBasicInfo extends React.Component {
	// handleSignUp = () => {
	// 	const { name, email, password } = this.state;
	// 	firebase
	// 		.auth()
	// 		.createUserWithEmailAndPassword(email, password)
	// 		.then((result) => {
	// 			// var db = firebase.firestore();
	// 			// db.collection("students").doc(result.user.uid).updateData({
	// 			//     name: name,
	// 			// }).then(function() {
	// 			//     console.log("Document successfully written!");
	// 			// }).catch(function(error) {
	// 			//     console.error("Error writing document: ", error);
	// 			// });
	// 			this.props.navigation.navigate('Profile');
	// 		})
	// 		.catch((error) => console.log(error));
	// };

	static navigationOptions = {
		title: 'Basic Information',
		headerStyle: {
			backgroundColor: 'white'
		},
		headerTintColor: '#6A7BD6',
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 30
		}
	};

	constructor(props) {
		super(props);
		this.majors = [
			{
				title: 'Computer Science',
				code: 'CSCI'
			},
			{
				title: 'Computer Science Business Administration',
				code: 'CSBA'
			},
			{
				title: 'Business Administration',
				code: 'BUAD'
			},
			{
				title: 'Economics',
				code: 'ECON'
			}
		];
		this.years = [
			{
				title: 'Freshman',
				value: 'Freshman'
			},
			{
				title: 'Sophmore',
				value: 'Sophmore'
			},
			{
				title: 'Junior',
				value: 'Junior'
			},
			{
				title: 'Senior',
				value: 'Senior'
			},
			{
				title: 'Graduate',
				value: 'Graduate'
			}
		];
		this.state = {
			name: '',
			email: '',
			password: '',
			year: '',
			gpa: '',
			major: null,
			nameError: '',
			emailError: '',
			passwordError: '',
			gpaError: '',
			majorError: '',
			yearError: '',
			typeError: '',
			tutor: false,
			student: false
		};
	}

	informationValidation() {
		var valid = true;
		var gpaReg = /^[+-]?\d+(\.\d+)?$/;
		this.setState({
			nameError: '',
			passwordError: '',
			emailError: '',
			yearError: '',
			majorError: '',
			gpaError: '',
			typeError: ''
		});
		if (this.state.gpa < 0 || this.state.gpa > 4 || !gpaReg.test(this.state.gpa)) {
			this.setState({ gpaError: 'Please input a GPA between 0 and 4' });
			valid = false;
		}
		if (this.state.name == '') {
			this.setState({ nameError: 'Please enter a name' });
			valid = false;
		}
		if (this.state.password.length < 6) {
			this.setState({ passwordError: 'Please enter a password with at least 6 characters' });
			valid = false;
		}
		if (this.state.email == '') {
			this.setState({ emailError: 'Please enter a email' });
			valid = false;
		}
		if (this.state.major == null) {
			this.setState({ majorError: 'Please select a major' });
			valid = false;
		}
		if (this.state.year == '') {
			this.setState({ yearError: 'Please select a year' });
			valid = false;
		}
		if (!this.state.tutor && !this.state.student) {
			this.setState({ typeError: 'Please select at least one' });
			valid = false;
		}
		if (!valid) {
			this.props.navigation.navigate('SignUpBioClasses', { basicInfo: this.state });
		}
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<View style={styles.container}>
					<View style={styles.textInputContainer}>
						<Text style={styles.textInputHeadingText}>Full Name</Text>
						<TextInput
							style={styles.inputBox}
							value={this.state.name}
							placeholderTextColor={'#6A7BD6'}
							onChangeText={(name) => this.setState({ name })}
							placeholder="Tommy Trojan"
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.nameError}
						</Text>
						<Text style={styles.textInputHeadingText}>Email Address</Text>
						<TextInput
							style={styles.inputBox}
							value={this.state.email}
							placeholderTextColor={'#6A7BD6'}
							onChangeText={(email) => this.setState({ email })}
							autoCompleteType={'email'}
							placeholder="tommyt@usc.edu"
							autoCapitalize="none"
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.emailError}
						</Text>
						<Text style={styles.textInputHeadingText}>Password</Text>
						<TextInput
							style={styles.inputBox}
							value={this.state.password}
							placeholderTextColor={'#6A7BD6'}
							onChangeText={(password) => this.setState({ password })}
							placeholder="************"
							secureTextEntry={true}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.passwordError}
						</Text>
					</View>
					<View style={styles.dropdownContainer}>
						<Dropdown
							items={this.years}
							getSelectedItem={(i) => {
								this.setState({ year: i });
							}}
							modalHeaderText={'Please select your year'}
							intitalValue={'Super Senior'}
							dropdownTitle={'Year'}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.yearError}
						</Text>

						<Text style={styles.textInputGPAHeadingText}>GPA</Text>
						<TextInput
							style={styles.gpaInput}
							value={this.state.gpa}
							placeholderTextColor={'#6A7BD6'}
							onChangeText={(gpa) => {
								this.setState({ gpa });
							}}
							placeholder="3.5"
							keyboardType={'decimal-pad'}
							enablesReturnKeyAutomatically={true}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.gpaError}
						</Text>
						<SearchableDropdown
							items={this.majors}
							getSelectedItem={(item) => {
								this.setState({ major: { name: item.name, code: item.code } });
							}}
							modalHeaderText={'Please select your major'}
							intitalValue={'Basket Weaving'}
							dropdownTitle={'Major'}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.majorError}
						</Text>
					</View>
					<View style={styles.checkboxContainer}>
						<CheckBox
							style={{
								flex: 1,
								marginLeft: '20%'
							}}
							onClick={() => {
								this.setState({
									student: !this.state.student
								});
							}}
							isChecked={this.state.student}
							rightText="Student"
							rightTextStyle={{ color: 'white' }}
							checkBoxColor="white"
						/>
						<CheckBox
							style={{
								flex: 1
							}}
							onClick={() => {
								this.setState({
									tutor: !this.state.tutor
								});
							}}
							isChecked={this.state.tutor}
							rightText="Tutor"
							rightTextStyle={{ color: 'white' }}
							checkBoxColor="white"
						/>
					</View>
					<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
						{this.state.typeError}
					</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={() => this.informationValidation()}>
							<Text style={styles.buttonText}>Continue</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#6A7BD6',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	checkboxContainer: {
		flex: 0.25,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	textInputContainer: {
		marginTop: 6,
		flex: 3,
		alignItems: 'center',
		width: '100%'
	},
	errorText: {
		color: '#f54242',
		fontSize: 15,
		fontWeight: 'bold'
	},
	inputBox: {
		width: '90%%',
		margin: '2%',
		padding: '3%',
		fontSize: 16,
		backgroundColor: 'white',
		borderColor: 'white',
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left'
	},
	textInputHeadingText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		alignSelf: 'flex-start',
		marginLeft: '6%'
	},
	dropdownContainer: {
		flex: 4,
		justifyContent: 'space-around',
		width: '100%',
		alignItems: 'center',
		marginTop: '5%'
	},
	textInputGPAHeadingText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	},
	gpaInput: {
		backgroundColor: 'white',
		borderColor: 'white',
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left',
		alignItems: 'center',
		justifyContent: 'center',
		height: '10%',
		width: '30%',
		paddingLeft: '3%',
		margin: '2%',
		padding: '3%'
	},
	buttonContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		marginTop: 30,
		marginBottom: 20,
		paddingVertical: 5,
		alignItems: 'center',
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 15,
		width: '50%',
		height: '50%',
		justifyContent: 'center'
	},
	buttonText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#6A7BD6'
	},
	buttonSignup: {
		fontSize: 12
	}
});

export default SignUpBasicInfo;
