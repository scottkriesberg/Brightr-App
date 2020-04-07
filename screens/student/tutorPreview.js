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
							onPress: () => this.props.navigation.navigate('StudentMap', { uid: this.state.uid })
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
				className: this.state.classRequest,
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
					<View style={styles.header}>
						<TouchableOpacity style={styles.backButton} onPress={this.toStudentMap}>
							<Icon name="arrow-left" size={30} color={'white'} />
							<Text style={styles.backButtonText}>Back</Text>
						</TouchableOpacity>
					</View>
					<ProfileHeadingInfo
						rating={this.state.tutor.rating}
						year={this.state.tutor.year}
						major={this.state.tutor.major}
						containerStyle={styles.tutorInfo}
						name={this.state.tutor.name}
						bio={this.state.tutor.bio}
						image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
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
							style={styles.slider}
							value={this.state.value}
							maximumValue={90}
							minimumValue={15}
							step={15}
							thumbTintColor="#6A7BD6"
							trackStyle={styles.trackSlider}
							onValueChange={(value) => this.setState({ value })}
						/>

						<Text>Estimated Session Time: {this.state.value} minutes</Text>
					</View>

					<View style={styles.locationPickerContainer}>
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
					</View>

					<View style={styles.classPickerContainer}>
						<ModalSelector
							data={this.state.tutor.classesArray}
							accessible={true}
							initValue="Select a class"
							keyExtractor={(item) => item}
							labelExtractor={(item) => item}
							optionStyle={{ marginTop: 10, backgroundColor: 'white' }}
							cancelStyle={{ width: '90%', alignSelf: 'center' }}
							style={{ width: '90%' }}
							initValueTextStyle={{ color: 'black' }}
							onChange={(option) => {
								this.setState({ classRequest: this.state.tutor.classes[option] });
							}}
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
		flexDirection: 'column',
		marginTop: '8%'
	},
	trackSlider: {
		height: 10
	},
	slider: {
		width: '90%'
	},
	locationPickerContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	classPickerContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	sliderContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		backgroundColor: '#6A7BD6',
		flex: 1,
		justifyContent: 'flex-start'
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
	descriptionContainer: {
		flex: 1,
		alignItems: 'center'
	},
	description: {
		fontSize: 16,
		color: '#696969',
		marginTop: 10,
		width: '90%',
		borderColor: 'grey',
		borderWidth: 1,
		borderRadius: 15,
		textAlign: 'left',
		height: '100%',
		padding: 10
	},
	backButtonContainter: {
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	backButton: {
		height: '100%',
		width: '25%',
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	backButtonText: {
		fontSize: 30,
		color: 'white'
	},
	live: {
		marginTop: 5,
		flex: 1,
		alignItems: 'center'
	},
	liveButton: {
		backgroundColor: '#6A7BD6',
		height: '100%',
		width: '75%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: 'white'
	}
});
