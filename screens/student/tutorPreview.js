import React, { Component } from 'react';
import { Button, Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Text, View, Image } from 'react-native';
import firebase from '../../firebase';
import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';
import { Rating, ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils.js';
import ButtonStyles from '../../styles/button.js';

export default class TutorPreview extends Component {
	classSelected = (selectedItem) => {
		this.state.classRequest = selectedItem[0];
	};
	locationSelected = (selectedItem) => {
		this.state.locationRequest = selectedItem[0];
	};
	codeGenerator = () => {
		const num1 = Math.floor(Math.random() * 10);
		const num2 = Math.floor(Math.random() * 10);
		const num3 = Math.floor(Math.random() * 10);
		const num4 = Math.floor(Math.random() * 10);
		return num1.toString() + num2.toString() + num3.toString() + num4.toString();
	};

	rowItem = (item) => (
		<View
			style={{
				flex: 1,
				borderBottomWidth: 0.5,
				alignItems: 'flex-start',
				justifyContent: 'center',
				paddingVertical: 20,
				borderBottomColor: '##dfdfdf'
			}}
		>
			<Text>{item}</Text>
		</View>
	);

	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.requestRef = firebase.firestore().collection('requests');
		this.state = {
			id: '',
			tutorId: '',
			tutor: {},
			isLoading: true,
			uid: '',
			classRequest: '',
			locationRequest: '',
			value: 15,
			description: ''
		};
	}

	componentDidMount() {
		this.state.tutorId = this.props.navigation.getParam('tutorId', '');
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.tutorRef = this.tutorRef.doc(this.state.tutorId);
		this.tutorRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					tutor: doc.data(),
					id: doc.id,
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
	}

	toStudentMap = () => {
		this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
	};
	requestTutor = () => {
		const time = Date.now();
		this.requestRef
			.add({
				studentUid: this.state.uid,
				tutorUid: this.state.tutorId,
				timestamp: time,
				location: this.state.locationRequest,
				estTime: this.state.value,
				className: this.state.classRequest,
				startCode: this.codeGenerator(),
				status: 'pending',
				messages: [],
				description: this.state.description
			})
			.then((docRef) => {
				this.props.navigation.navigate('RequestWaiting', {
					tutorId: this.state.id,
					uid: this.state.uid,
					requestUid: docRef.id
				});
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
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
					<View style={styles.header}>
						<Button
							style={styles.backButton}
							icon={<Icon name="arrow-left" size={20} color="white" />}
							iconLeft
							title="Back"
							onPress={this.toStudentMap}
						/>
					</View>
					<ProfileHeadingInfo
						rating={this.state.tutor.rating}
						year={this.state.tutor.year}
						major={this.state.tutor.major}
						containerStyle={styles.tutorInfo}
						name={this.state.tutor.name}
						bio={this.state.tutor.bio}
						image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					/>
					<View>
						<TextInput
							style={styles.description}
							style={{ height: 40 }}
							multiline={true}
							placeholder="Description"
							onChangeText={(description) => this.setState({ description })}
							value={this.state.description}
						/>
					</View>
					<View style={styles.slider}>
						<Slider
							value={this.state.value}
							maximumValue={90}
							minimumValue={15}
							step={15}
							onValueChange={(value) => this.setState({ value })}
						/>
						<Text>Estimated Session Time: {this.state.value} minutes</Text>
					</View>

					<View style={styles.locationList}>
						<SelectableFlatlist
							data={this.state.tutor.locations}
							state={STATE.EDIT}
							multiSelect={false}
							itemsSelected={(selectedItem) => {
								this.locationSelected(selectedItem);
							}}
							initialSelectedIndex={[ 0 ]}
							cellItemComponent={(item, otherProps) => this.rowItem(item)}
						/>
					</View>

					<View style={styles.classList}>
						<SelectableFlatlist
							data={this.state.tutor.classes}
							state={STATE.EDIT}
							multiSelect={false}
							itemsSelected={(selectedItem) => {
								this.classSelected(selectedItem);
							}}
							initialSelectedIndex={[ 0 ]}
							cellItemComponent={(item, otherProps) => this.rowItem(item.department + ': ' + item.code)}
						/>
					</View>

					<Button type="solid" title="Request Tutor" onPress={this.requestTutor} />
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		paddingBottom: 10
	},
	classList: {
		flex: 4
	},
	locationList: {
		flex: 4
	},
	slider: {
		flex: 2
	},
	rating: {
		paddingTop: 10
	},
	header: {
		backgroundColor: '#6A7BD6',
		height: 200,
		flex: 2
	},
	avatar: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: 'white',
		alignSelf: 'center',
		position: 'absolute',
		marginTop: -70
	},
	tutorInfo: {
		alignItems: 'center',
		flex: 8
	},
	name: {
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},
	info: {
		fontSize: 16,
		color: '#00BFFF',
		marginTop: 10
	},
	description: {
		fontSize: 16,
		color: '#696969',
		marginTop: 10,
		textAlign: 'center',
		width: '90%'
	},
	backButton: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		marginBottom: 20,
		width: 250,
		borderRadius: 30
	}
});
