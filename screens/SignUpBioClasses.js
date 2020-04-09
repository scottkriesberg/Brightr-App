import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MultiSelectSearchableDropdown } from './components/dropdown';

import firebase from '../firebase';

class SignUpBasicInfo extends React.Component {
	handleSignUp = () => {
		const { classes, bio, basicInfo } = this.state;
		// console.log(basicInfo);
		// return;
		const classesArray = classes.map((classObj) => {
			const classDeptName = classObj.department + classObj.code;
			return classDeptName;
		});
		firebase
			.auth()
			.createUserWithEmailAndPassword(basicInfo.email, basicInfo.password)
			.then((result) => {
				if (basicInfo.student) {
					var db = firebase.firestore();
					db
						.collection('students')
						.doc(result.user.uid)
						.set({
							name: basicInfo.name,
							bio: bio,
							classes: classes,
							major: basicInfo.major,
							year: basicInfo.year,
							classesArray: classesArray,
							rating: 4.5,
							numRatings: 0
						})
						.then(() => {
							this.props.navigation.navigate('StudentNavigator', { uid: result.user.uid });
						})
						.catch(function(error) {
							console.error('Error writing document: ', error);
						});
				}
				if (basicInfo.tutor) {
					var db = firebase.firestore();
					db
						.collection('tutors')
						.doc(result.user.uid)
						.set({
							name: basicInfo.name,
							bio: bio,
							classes: classes,
							major: basicInfo.major,
							year: basicInfo.year,
							rating: 4.5,
							numRatings: 0,
							gpa: basicInfo.gpa,
							hourlyRate: 0,
							moneyMade: 0,
							topHourlyRate: 0,
							timeWorked: 0,
							locations: [],
							isLive: false,
							classesArray: classesArray
						})
						.then(() => {
							if (!basicInfo.student) {
								this.props.navigation.navigate('TutorNavigator', { uid: result.user.uid });
							}
						})
						.catch(function(error) {
							console.error('Error writing document: ', error);
						});
				}
			})
			.catch((error) => console.log(error));
	};

	static navigationOptions = {
		title: 'Additional Information',
		headerStyle: {
			backgroundColor: 'white'
		},
		headerTintColor: '#6A7BD6',
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 20
		}
	};

	constructor(props) {
		super(props);
		this.classes = [
			{
				title: 'Computer Science (CSCI)',
				data: [
					{
						name: 'Data Structures and Algortims',
						department: 'CSCI',
						code: '104'
					},
					{
						name: 'Introduction to Programming',
						department: 'CSCI',
						code: '103'
					}
				]
			},
			{
				title: 'Mathamatics MATH',
				data: [
					{
						name: 'Calculus III',
						department: 'MATH',
						code: '229'
					}
				]
			},
			{
				title: 'ITP',
				data: [
					{
						name: 'Introduction to  C++ Programming',
						department: 'ITP',
						code: '165'
					},
					{
						name: 'Introduction to  MATLAB',
						department: 'ITP',
						code: '168'
					},
					{
						name: 'Programming in Python',
						department: 'ITP',
						code: '115'
					}
				]
			}
		];

		this.state = {
			basicInfo: {},
			bio: '',
			classes: [],
			classesError: '',
			bioError: ''
		};
	}

	componentDidMount() {
		this.setState({ basicInfo: this.props.navigation.getParam('basicInfo', {}) });
	}

	validate() {
		var valid = true;
		this.setState({
			classesError: '',
			bioError: ''
		});
		if (this.state.bio == '') {
			this.setState({ bioError: 'Please enter at least a small bio' });
			valid = false;
		}
		if (this.state.classes.length == 0) {
			this.setState({ classesError: 'Please select at least one' });
			valid = false;
		}
		if (valid) {
			this.handleSignUp();
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
					<Text style={styles.welcomeText}>
						Welcome {'\n'} {this.state.basicInfo.name}
					</Text>
					<View style={styles.textInputContainer}>
						<Text style={styles.textInputHeadingText}>Bio</Text>
						<TextInput
							style={styles.inputBox}
							value={this.state.bio}
							placeholderTextColor={'#6A7BD6'}
							onChangeText={(bio) => this.setState({ bio })}
							placeholder="Fight on!"
							multiline={true}
							maxLength={500}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.bioError}
						</Text>
					</View>
					<View style={styles.dropdownContainer}>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.classesError}
						</Text>
						<MultiSelectSearchableDropdown
							items={this.classes}
							getSelectedItem={(item) => {
								this.setState({ major: { name: item.name, code: item.code } });
							}}
							modalHeaderText={'Please select all the classes you would like to tutor for'}
							intitalValue={'Computer Science'}
							dropdownTitle={'Classes'}
							doneFunc={(selected) => {
								this.setState({ classes: selected });
							}}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={() => this.validate()}>
							<Text style={styles.buttonText} adjustsFontSizeToFit={true} numberOfLines={1}>
								Sign Up
							</Text>
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
	welcomeText: {
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'white',
		margin: 15
	},
	textInputContainer: {
		marginTop: 6,
		flex: 3,
		alignItems: 'center',
		width: '100%'
	},
	inputBox: {
		width: '90%%',
		margin: '2%',
		padding: '3%',
		height: '60%',
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
		alignItems: 'center'
	},
	buttonContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
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
		color: '#6A7BD6',
		textAlign: 'center'
	},
	buttonSignup: {
		fontSize: 12
	},
	errorText: {
		color: 'red',
		fontSize: 25,
		fontWeight: 'bold'
	}
});

export default SignUpBasicInfo;
