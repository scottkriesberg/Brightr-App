import React, { Component } from 'react';
import firebase from '../../firebase';
import {
	StyleSheet,
	Text,
	View,
	Alert,
	TouchableOpacity,
	TextInput,
	Image,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import { ProfileTopBar, ProfileHeadingInfo, ProfileClasses } from '../components/profile';
import Loading from '../components/utils.js';
import { Button } from '../components/buttons';
import { Dropdown, SearchableDropdown, MultiSelectSearchableDropdown } from '../components/dropdown';

class TutorEditProfile extends Component {
	constructor() {
		super();
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
		this.classes = [
			{
				title: 'Computer Science (CSCI)',
				data: [
					{
						name: 'Data Structures and Algorithms',
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
			uid: '',
			user: {},
			isLoading: true,
			name: '',
			nameError: ''
		};
	}

	static navigationOptions = {
		title: 'Edit Profile',
		headerStyle: {
			backgroundColor: secondaryColor
		},
		headerTintColor: primaryColor,
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 20
		}
	};

	componentDidMount() {
		this.state.uid = userUid;
		const ref = firebase.firestore().collection('tutors').doc(this.state.uid);
		ref.get().then((doc) => {
			if (doc.exists) {
				const { name, major, year, bio, classes } = doc.data();
				this.setState({
					user: doc.data(),
					name: name,
					major: major,
					year: year,
					bio: bio,
					classes: classes,
					key: doc.id,
					isLoading: false
				});
				this.setState({
					user: doc.data(),
					key: doc.id,
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
	}

	renderItem = ({ item }) => {
		return (
			<View style={styles.classRow}>
				<Text style={styles.classText}>
					{this.state.user.classes[item].department}: {this.state.user.classes[item].code}
				</Text>
				<Text style={styles.classNameText}>{this.state.user.classes[item].name}</Text>
			</View>
		);
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<View style={styles.container}>
					<View style={styles.nameAvatarContianer}>
						<Image
							resizeMode="stretch"
							style={styles.avatarStyle}
							source={{
								uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
							}}
						/>
						<TextInput
							style={styles.inputBox}
							value={this.state.name}
							placeholderTextColor={primaryColor}
							onChangeText={(name) => this.setState({ name })}
						/>
						<Text style={styles.errorText} adjustsFontSizeToFit={true} numberOfLines={1}>
							{this.state.nameError}
						</Text>
					</View>
					<View style={styles.yearMajorContainer}>
						<Dropdown
							items={this.years}
							getSelectedItem={(i) => {
								this.setState({ year: i.value });
							}}
							modalHeaderText={'Update your year'}
							intitalValue={this.state.year}
							renderItemTextFunc={(item) => item.name}
							touchableStyle={styles.yearDropdown}
							containerStyle={styles.dropdownContainer}
						/>
						<Text style={{ fontSize: 30, marginTop: '2%' }}> / </Text>
						<SearchableDropdown
							items={this.majors}
							getSelectedItem={(item) => {
								this.setState({ major: { name: item.name, code: item.code } });
							}}
							modalHeaderText={'Update your major'}
							intitalValue={this.state.major.code}
							touchableStyle={styles.majorDropdown}
							containerStyle={styles.dropdownContainer}
						/>
					</View>
					<View style={styles.bioContianer}>
						<Text style={styles.textInputHeadingText}>Bio</Text>
						<TextInput
							style={styles.bioInputBox}
							value={this.state.bio}
							placeholderTextColor={primaryColor}
							onChangeText={(bio) => this.setState({ bio })}
							placeholder="Fight on!"
							multiline={true}
							maxLength={500}
						/>
					</View>
					<View style={styles.classesContainer}>
						<MultiSelectSearchableDropdown
							items={this.classes}
							selected={this.state.classes}
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
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: primaryColor,
		alignItems: 'stretch'
	},
	nameAvatarContianer: {
		flex: 1.75,
		justifyContent: 'space-around'
	},
	yearMajorContainer: {
		flex: 0.75,
		flexDirection: 'row',
		alignItems: 'center'
	},
	bioContianer: {
		flex: 1,
		alignItems: 'center'
	},
	classesContainer: {
		flex: 3
	},
	dropdownContainer: {
		width: '10%'
	},
	majorDropdown: {
		width: '40%',
		alignSelf: 'flex-start'
	},
	yearDropdown: {
		width: '40%',
		alignSelf: 'flex-end'
	},
	avatarStyle: {
		height: '85%',
		borderRadius: 75,
		borderWidth: 4,
		borderColor: secondaryColor,
		alignSelf: 'center',
		aspectRatio: 1
	},
	inputBox: {
		width: '70%',
		height: '25%',
		fontSize: 35,
		marginTop: 25,
		backgroundColor: secondaryColor,
		borderColor: secondaryColor,
		borderRadius: 5,
		borderWidth: 2,
		textAlign: 'center',
		alignSelf: 'center'
	},
	textInputHeadingText: {
		fontSize: 20,
		color: secondaryColor,
		fontWeight: 'bold',
		alignSelf: 'flex-start',
		marginLeft: '6%'
	},
	bioInputBox: {
		width: '90%%',
		padding: '3%',
		height: '60%',
		fontSize: 16,
		backgroundColor: secondaryColor,
		borderColor: secondaryColor,
		borderRadius: 5,
		borderWidth: 2,
		textAlign: 'left'
	}
});

export default TutorEditProfile;
