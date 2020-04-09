import React, { Component } from 'react';
import { Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	StyleSheet,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	Text,
	View,
	TouchableOpacity
} from 'react-native';
import firebase from '../../firebase';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils.js';
import ModalSelector from 'react-native-modal-selector';
import { Dropdown } from '../components/dropdown';

export default class TutorPreview extends Component {
	classSelected = (selectedItem) => {
		this.state.classRequest = selectedItem[0];
	};
	locationSelected = (selectedItem) => {
		this.state.locationRequest = selectedItem[0];
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
		this.unsubscribe = null;
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
		this.unsubscribe = this.tutorRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			if (doc.data().isLive == false) {
				Alert.alert(
					'Tutor Unavailable',
					'Please request a different tutor',
					[
						{
							text: 'OK',
							onPress: () =>
								this.props.navigation.navigate('StudentMap', {
									uid: this.state.uid
								})
						}
					],
					{
						cancelable: false
					}
				);
			}
		} else {
			this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
		}
	};

	componentWillUnmount() {
		this.unsubscribe();
	}

	toStudentMap = () => {
		this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
	};
	requestTutor = () => {
		if (this.state.classRequest == '') {
			Alert.alert('No Class', 'Please select a class', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		if (this.state.locationRequest == '') {
			Alert.alert('No Location', 'Please select a location', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		const time = Date.now();
		this.requestRef
			.add({
				studentUid: this.state.uid,
				tutorUid: this.state.tutorId,
				timestamp: time,
				location: this.state.locationRequest,
				estTime: this.state.value,
				classObj: this.state.classRequest,
				status: 'pending',
				studentReady: false,
				tutorReady: false,
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
					<View style={styles.backButtonContainer}>
						<TouchableOpacity style={styles.backButton} onPress={this.toStudentMap}>
							<Icon name="arrow-left" size={30} color={'#6A7BD6'} />
						</TouchableOpacity>
					</View>

					<ProfileHeadingInfo
						rating={this.state.tutor.rating}
						year={this.state.tutor.year}
						major={this.state.tutor.major.code}
						containerStyle={styles.tutorInfo}
						avatarStyle={styles.avatar}
						name={this.state.tutor.name}
						bio={this.state.tutor.bio}
						image={{
							uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
						}}
						gpa={this.state.tutor.gpa}
					/>
					<View style={styles.descriptionContainer}>
						<TextInput
							style={styles.description}
							multiline={true}
							placeholder="Description"
							onChangeText={(description) => this.setState({ description })}
							value={this.state.description}
						/>
					</View>

					<View style={styles.sliderContainer}>
						<Slider
							style={{ width: '90%' }}
							value={this.state.value}
							maximumValue={90}
							minimumValue={15}
							step={15}
							thumbTintColor="#6A7BD6"
							trackStyle={{ height: 10 }}
							onValueChange={(value) => this.setState({ value })}
						/>

						<Text>Estimated Session Time: {this.state.value} minutes</Text>
					</View>

					<View style={styles.pickerContainer}>
						<ModalSelector
							data={this.state.tutor.locations}
							accessible={true}
							initValue="Select a location"
							keyExtractor={(item) => item}
							labelExtractor={(item) => item}
							optionStyle={{ marginTop: 10, backgroundColor: 'white' }}
							cancelStyle={{ width: '90%', alignSelf: 'center' }}
							style={{ width: '90%' }}
							initValueTextStyle={{ color: 'black' }}
							onChange={(option) => {
								this.setState({ locationRequest: option });
							}}
						/>

						<Dropdown
							containerStyle={{ width: '100%', alignItems: 'center', marginVertical: '2%' }}
							titleStyle={{ color: 'black' }}
							items={this.state.tutor.classes}
							getSelectedItem={(i) => {
								this.setState({ classRequest: i });
							}}
							modalHeaderText={'Select A Class'}
							intitalValue={'Select A Class'}
							dropdownTitle={'Class'}
						/>
					</View>
					<View style={styles.live}>
						<TouchableOpacity style={styles.liveButton} onPress={this.requestTutor}>
							<Text style={styles.liveButtonText}>Request Tutor</Text>
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
		backgroundColor: '#F8F8FF',
		flexDirection: 'column'
	},
	backButtonContainer: {
		flex: 1,
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#F8F8FF'
	},
	avatar: {
		height: 150,
		width: 150,
		borderRadius: 75,
		borderWidth: 4,
		borderColor: '#6A7BD6',
		alignSelf: 'center',
		aspectRatio: 1
	},
	tutorInfo: {
		flex: 8,
		alignItems: 'center',
		backgroundColor: '#F8F8FF'
	},
	descriptionContainer: {
		flex: 1,
		height: '30%',
		alignItems: 'center'
	},
	sliderContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	pickerContainer: {
		flex: 2,
		justifyContent: 'space-around',
		alignItems: 'center'
	},

	name: {
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},

	description: {
		fontSize: 16,
		marginTop: 10,
		width: '90%',
		borderColor: 'grey',
		borderWidth: 1,
		borderRadius: 15,
		textAlign: 'left',
		height: '100%',
		padding: 10
	},
	backButton: {
		marginTop: 25,
		marginLeft: 10,
		height: 50,
		width: 50,
		borderRadius: 25,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	live: {
		flex: 3,
		marginTop: 10,
		alignItems: 'center'
	},
	liveButton: {
		backgroundColor: '#6A7BD6',
		height: 45,
		width: '75%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: 'white'
	}
});
