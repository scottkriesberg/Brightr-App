import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Dropdown, SearchableDropdown } from './components/dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SafeAreaView } from 'react-native-safe-area-context';

class SignUpBasicInfo extends React.Component {
	static navigationOptions = {
		title: 'Basic Information',
		headerStyle: {
			backgroundColor: secondaryColor
		},
		headerTintColor: primaryColor,
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 20
		}
	};

	constructor(props) {
		super(props);
		this.majors = [
			{
				name: 'Computer Science',
				code: 'CSCI'
			},
			{
				name: 'Computer Science Business Administration',
				code: 'CSBA'
			},
			{
				name: 'Business Administration',
				code: 'BUAD'
			},
			{
				name: 'Economics',
				code: 'ECON'
			}
		];
		this.years = [
			{
				name: 'Freshman',
				value: 'Freshman'
			},
			{
				name: 'Sophmore',
				value: 'Sophmore'
			},
			{
				name: 'Junior',
				value: 'Junior'
			},
			{
				name: 'Senior',
				value: 'Senior'
			},
			{
				name: 'Graduate',
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
		if ((this.state.gpa < 0 || this.state.gpa > 4 || !gpaReg.test(this.state.gpa)) && this.state.tutor) {
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
		if (valid) {
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
				<KeyboardAwareScrollView
					style={{ backgroundColor: '#4c69a5' }}
					resetScrollToCoords={{ x: 0, y: 0 }}
					contentContainerStyle={styles.container}
					scrollEnabled={true}
				>
					<View style={styles.textInputContainer}>
						<Text style={styles.textInputHeadingText}>Full Name</Text>
						<TextInput
							style={styles.inputBox}
							value={this.state.name}
							placeholderTextColor={primaryColor}
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
							placeholderTextColor={primaryColor}
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
							placeholderTextColor={primaryColor}
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
								this.setState({ year: i.value });
							}}
							modalHeaderText={'Please select your year'}
							intitalValue={'Super Senior'}
							dropdownTitle={'Year'}
							renderItemTextFunc={(item) => item.name}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.yearError}
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

						{this.state.tutor ? <Text style={styles.textInputGPAHeadingText}>GPA</Text> : null}

						{this.state.tutor ? (
							<TextInput
								style={styles.gpaInput}
								value={this.state.gpa}
								placeholderTextColor={primaryColor}
								onChangeText={(gpa) => {
									this.setState({ gpa });
								}}
								placeholder="3.5"
								keyboardType={'decimal-pad'}
								enablesReturnKeyAutomatically={true}
							/>
						) : null}

						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.gpaError}
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
							rightTextStyle={{ color: secondaryColor }}
							checkBoxColor="white"
						/>
						<CheckBox
							style={{
								flex: 1
							}}
							onClick={() => {
								this.setState({
									tutor: !this.state.tutor,
									gpaError: ''
								});
							}}
							isChecked={this.state.tutor}
							rightText="Tutor"
							rightTextStyle={{ color: secondaryColor }}
							checkBoxColor="white"
						/>
					</View>
					<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
						{this.state.typeError}
					</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={() => this.informationValidation()}>
							<Text style={styles.buttonText} adjustsFontSizeToFit={true} numberOfLines={1}>
								Continue
							</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
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
	checkboxContainer: {
		flex: 0.25,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	textInputContainer: {
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
		width: '90%',
		height: '15%',
		paddingLeft: '3%',
		fontSize: 15,
		backgroundColor: secondaryColor,
		borderColor: secondaryColor,
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left'
	},
	textInputHeadingText: {
		fontSize: 20,
		color: secondaryColor,
		fontWeight: 'bold',
		alignSelf: 'flex-start',
		marginLeft: '6%'
	},
	dropdownContainer: {
		flex: 3,
		justifyContent: 'space-around',
		width: '100%',
		alignItems: 'center'
	},
	textInputGPAHeadingText: {
		color: secondaryColor,
		fontSize: 20,
		fontWeight: 'bold'
	},
	gpaInput: {
		backgroundColor: secondaryColor,
		borderColor: secondaryColor,
		borderRadius: 15,
		borderWidth: 2,
		textAlign: 'left',
		alignItems: 'center',
		justifyContent: 'center',
		height: '15%',
		width: '30%',
		paddingLeft: '3%'
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
		backgroundColor: secondaryColor,
		borderColor: secondaryColor,
		borderWidth: 1,
		borderRadius: 15,
		width: '50%',
		height: '50%',
		justifyContent: 'center'
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

export default SignUpBasicInfo;
