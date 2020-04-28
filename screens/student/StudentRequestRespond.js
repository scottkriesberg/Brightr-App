import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Slider } from 'react-native-elements';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils';
import { Button } from '../components/buttons';
import { Dropdown } from '../components/dropdown';

export default class StudentRequestRespond extends Component {
	constructor() {
		super();
		this.unsubscribe = null;
		this.requestRef = firebase.firestore().collection('requests');
		this.state = {
			studentUid: '',
			tutorUid: '',
			requestUid: '',
			tutor: {},
			request: {},
			isLoading: true,
			rate: 0,
			estTime: 0,
			location: '',
			changed: false,
			locations: [
				'Cafe 84',
				'VKC Library',
				'SAL',
				'Leavey  Library',
				'USC Village Tables',
				'RTH Campus Center Tables',
				'Fertitta Hall'
			]
		};
	}

	static navigationOptions = {
		title: 'Request Preview',
		gestureEnabled: false,
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
		this.state.studentUid = this.props.navigation.getParam('uid', '');
		this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);

		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	cancelRequest = () => {
		this.requestRef
			.update({ status: 'cancelled' })
			.then((docRef) => {
				this.props.navigation.navigate('StudentActiveRequests', { uid: this.state.uid });
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
	};

	accept = () => {
		this.requestRef
			.update({
				status: 'accepted'
			})
			.then(() => {
				this.props.navigation.navigate('StudentChat', {
					uid: this.state.uid,
					requestUid: this.state.requestUid
				});
			});
	};

	update = () => {
		this.requestRef
			.update({
				status: 'waitingTutor',
				hourlyRate: this.state.rate,
				location: this.state.location,
				estTime: this.state.estTime
			})
			.then(() => {});
	};

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			this.state.request = doc.data();
			this.setState({
				estTime: doc.data().estTime,
				rate: doc.data().hourlyRate,
				location: doc.data().location
			});
			if (doc.data().status == 'declined') {
				Alert.alert(
					'Request Declined',
					'This tutor has declined this request',
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.navigation.navigate('StudentActiveRequests', { uid: this.state.studentUid });
							}
						}
					],
					{
						cancelable: false
					}
				);
			} else if (doc.data().status == 'cancelled' || doc.data().status == 'waitingTutor') {
				this.props.navigation.navigate('StudentActiveRequests', { uid: this.state.studentUid });
				return;
			}
			const ref = firebase.firestore().collection('tutors').doc(this.state.tutorUid);
			ref.get().then((doc) => {
				if (doc.exists) {
					this.setState({
						tutor: doc.data(),
						key: doc.id,
						isLoading: false
					});
				} else {
					console.log('No such document!');
				}
			});
		} else {
			this.props.navigation.navigate('StudentActiveRequests', { uid: this.state.studentUid });
		}
	};

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<ProfileHeadingInfo
					rating={this.state.tutor.rating}
					year={this.state.tutor.year}
					major={this.state.tutor.major.code}
					name={this.state.tutor.name}
					containerStyle={styles.basicInfoContainer}
					avatarStyle={styles.avatar}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.tutor.bio}
				/>
				<View style={styles.requestInfoContainer}>
					<Text style={styles.requestInfoHeader}>Request Information</Text>
					<View style={styles.individualSliderContainer}>
						<Text style={styles.sliderHeaderText}>Estimated Time: {this.state.estTime} minutes</Text>
						<Slider
							style={{ width: '90%' }}
							value={this.state.estTime}
							maximumValue={90}
							minimumValue={15}
							step={15}
							thumbTintColor="#6A7BD6"
							thumbTouchSize={{ width: 30, height: 30 }}
							trackStyle={{ height: 15, borderRadius: 10 }}
							thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
							onValueChange={(estTime) => this.setState({ estTime, changed: true })}
						/>
					</View>
					<View style={styles.individualSliderContainer}>
						<Text style={styles.sliderHeaderText}>Rate: ${this.state.rate}/hr</Text>
						<Slider
							style={{ width: '90%' }}
							value={this.state.rate}
							maximumValue={100}
							minimumValue={10}
							step={5}
							thumbTintColor="#6A7BD6"
							thumbTouchSize={{ width: 30, height: 30 }}
							trackStyle={{ height: 15, borderRadius: 10, width: '100%' }}
							thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
							onValueChange={(rate) => this.setState({ rate, changed: true })}
						/>
					</View>
					<Text style={styles.requestInfoText} adjustsFontSizeToFit={true} numberOfLines={1}>
						Estimated Session Cost: ${(this.state.estTime * this.state.rate / 60).toFixed(2)}
					</Text>
					<Text style={styles.requestInfoText}>
						Class: {this.state.request.classObj.department} {this.state.request.classObj.code}
					</Text>
				</View>

				<View style={styles.pickerContainer}>
					<Dropdown
						containerStyle={{ width: '100%', alignItems: 'center', marginVertical: '2%' }}
						titleStyle={{ color: 'black', fontSize: 20 }}
						items={this.state.locations}
						getSelectedItem={(i) => {
							this.setState({ locationRequest: i, changed: true });
						}}
						modalHeaderText={'Select a location'}
						intitalValue={this.state.location}
						dropdownTitle={'Location'}
					/>
				</View>

				<View style={styles.live}>
					<Button
						type="secondary"
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text="Decline"
						onPress={() => this.cancelRequest()}
					/>

					{this.state.changed ? (
						<Button
							type="primary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Update"
							onPress={() => this.update()}
						/>
					) : (
						<Button
							type="primary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Accept"
							onPress={() => this.accept()}
						/>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		backgroundColor: primaryColor,
		flex: 0.75,
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
		color: secondaryColor
	},
	basicInfoContainer: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	avatar: {
		flex: 3,
		borderRadius: 75,
		borderWidth: 4,
		borderColor: primaryColor,
		alignSelf: 'center',
		aspectRatio: 1
	},
	requestInfoContainer: {
		flex: 3,
		backgroundColor: secondaryColor,
		justifyContent: 'space-around'
	},
	requestInfoHeader: {
		fontSize: 25,
		alignSelf: 'center'
	},
	requestInfoText: {
		fontSize: 20,
		textAlign: 'center',
		marginLeft: '3%'
	},
	live: {
		marginTop: 5,
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	button: {
		alignSelf: 'center',
		width: '30%',
		padding: 15
	},
	buttonText: {
		alignSelf: 'center'
	},
	pickerContainer: {
		flex: 1
	},
	sliderHeaderText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'left'
	},
	individualSliderContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		width: '90%',
		borderColor: 'black',
		borderRadius: 5,
		padding: 5
	}
});
