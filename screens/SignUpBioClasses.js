import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MultiSelectSearchableDropdown } from './components/dropdown';

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
				title: 'Data Structures and Algortims',
				department: 'CSCI',
				code: '104'
			},
			{
				title: 'Introduction to Programming',
				department: 'CSCI',
				code: '103'
			},
			{
				title: 'Calculus III',
				department: 'MATH',
				code: '229'
			},
			{
				title: 'Introduction to Enviormental Science',
				department: 'ENST',
				code: '101'
			},
			{
				title: 'Data Structures and Algortims',
				department: 'CSCI',
				code: '104'
			},
			{
				title: 'Introduction to Programming',
				department: 'CSCI',
				code: '103'
			}
		];

		this.state = {
			basicInfo: {},
			bio: '',
			classes: []
		};
	}

	componentDidMount() {
		this.setState({ basicInfo: this.props.navigation.getParam('basicInfo', {}) });
	}

	render() {
		return (
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
				</View>
				<View style={styles.dropdownContainer}>
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
					<TouchableOpacity style={styles.button} onPress={() => console.log(this.state.classes)}>
						<Text style={styles.buttonText}>Continue</Text>
					</TouchableOpacity>
				</View>
			</View>
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
