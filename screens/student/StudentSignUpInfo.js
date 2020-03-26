import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Select from 'react-select';

export default class StudentSignUpInfo extends React.Component {
	constructor() {
		super();
		this.years = [
			{
				label: 'Freshman',
				value: 'Freshman'
			},
			{
				label: 'Sophmore',
				value: 'Sophmore'
			},
			{
				label: 'Junior',
				value: 'Junior'
			},
			{
				label: 'Senior',
				value: 'Senior'
			},
			{
				label: 'Graduate',
				value: 'Graduate'
			}
		];
		this.majors = [
			{ id: 1, name: 'CSCI' },
			{ id: 2, name: 'BME' },
			{ id: 3, name: 'CSBA' },
			{ id: 4, name: 'BA' }
		];
		this.classes = [ { id: 1, name: 'CSCI 104' }, { id: 2, name: 'CSCI 201' }, { id: 3, name: 'CSCI 356' } ];
		this.state = {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			year: '',
			major: '',
			bio: '',
			classes: ''
		};
	}

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
		// selectedOption can be null when the `x` (close) button is clicked
		if (selectedOption) {
			console.log(`Selected: ${selectedOption.label}`);
		}
	};

	toPickClasses = () => {
		console.log(this.state);
	};

	// handleSignUp = () => {
	// 	firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
	// 		firebase.database().ref('students/' + res.user.uid).set({
	// 			firstName: firstName,
	// 			lastName: lastName,
	// 			email: email,
	// 			code: code
	// 		});
	// 	});
	// };
	render() {
		const options = [
			{ value: 'chocolate', label: 'Chocolate' },
			{ value: 'strawberry', label: 'Strawberry' },
			{ value: 'vanilla', label: 'Vanilla' }
		];
		return (
			<View style={styles.container}>
				<Text>Sign Up</Text>
				<TextInput
					placeholder="Email"
					autoCapitalize="none"
					style={styles.textInput}
					onChangeText={(email) => this.setState({ email })}
					value={this.state.email}
				/>
				<TextInput
					secureTextEntry
					placeholder="Password"
					autoCapitalize="none"
					style={styles.textInput}
					onChangeText={(password) => this.setState({ password })}
					value={this.state.password}
				/>

				<TextInput
					placeholder="First Name"
					style={styles.textInput}
					onChangeText={(firstName) => this.setState({ firstName })}
					value={this.state.firstName}
				/>

				<TextInput
					placeholder="Last Name"
					style={styles.textInput}
					onChangeText={(lastName) => this.setState({ lastName })}
					value={this.state.lastName}
				/>

				<RNPickerSelect onValueChange={(value) => (this.state.year = value)} items={this.years} />

				<SearchableDropdown
					onTextChange={(text) => console.log(text)}
					//On text change listner on the searchable input
					onItemSelect={(item) => (this.state.major = item.name)}
					//onItemSelect called after the selection from the dropdown
					containerStyle={{ padding: 5 }}
					//suggestion container style
					textInputStyle={{
						//inserted text style
						padding: 12,
						borderWidth: 1,
						borderColor: '#ccc',
						backgroundColor: '#FAF7F6'
					}}
					itemStyle={{
						//single dropdown item style
						padding: 10,
						marginTop: 2,
						backgroundColor: '#FAF9F8',
						borderColor: '#bbb',
						borderWidth: 1
					}}
					itemTextStyle={{
						//single dropdown item's text style
						color: '#222'
					}}
					itemsContainerStyle={{
						//items container style you can pass maxHeight
						//to restrict the items dropdown hieght
						maxHeight: '50%'
					}}
					items={this.majors}
					//mapping of item array
					defaultIndex={0}
					//default selected item index
					placeholder="Select your major"
					//place holder for the search input
					resetValue={false}
					//reset textInput Value with true and false state
					underlineColorAndroid="transparent"
					//To remove the underline from the android input
				/>

				<TextInput
					placeholder="Bio"
					multiline={true}
					autoCapitalize="none"
					style={styles.textInput}
					onChangeText={(bio) => this.setState({ bio })}
					value={this.state.bio}
				/>

				<Button title="Pick Classes" onPress={this.toPickClasses} />
				<Button
					title="Already have an account? Login"
					onPress={() => this.props.navigation.navigate('Login')}
				/>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textInput: {
		height: 40,
		width: '90%',
		borderColor: 'gray',
		borderWidth: 1,
		marginTop: 8
	}
});
