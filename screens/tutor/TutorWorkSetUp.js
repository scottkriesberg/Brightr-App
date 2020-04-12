import React, { Component } from 'react';
import { Icon, Slider } from 'react-native-elements';
import { Alert, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { Map } from '../components/map';
import { Button } from '../components/buttons';

class TutorWorkSetUp extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.state = {
			uid: '',
			user: {},
			isLoading: true,
			locations: [],
			value: 25,
			status: 'Offline'
		};
	}

	componentDidMount() {
		// this.state.uid = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid');
		this.state.uid = userUid;
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.tutorRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id,
					isLoading: false,
					value: 25,
					status: doc.data().isLive ? 'Live' : 'Offline'
				});
			} else {
				console.log('No such document!');
			}
		});
	}

	toProfile = () => {
		this.props.navigation.navigate('TutorProfile', { uid: this.state.uid });
	};

	goLive = () => {
		if (this.state.locations.length == 0) {
			Alert.alert('No Locations', 'Please select at least one location', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		this.tutorRef
			.update({ isLive: true, hourlyRate: this.state.value, locations: this.state.locations })
			.then(() => {
				// this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
				this.setState({ status: 'Live' });
			});
	};

	toggleLoc = (pin) => {
		if (this.state.locations.includes(pin.title)) {
			this.state.locations = this.state.locations.filter((x) => x != pin.title);
		} else {
			this.state.locations.push(pin.title);
		}
	};

	clearLocations = () => {
		this.state.locations = [];
	};

	stopLive = () => {
		this.tutorRef.update({ isLive: false, hourlyRate: 0, locations: [] }).then(() => {
			firebase
				.firestore()
				.collection('requests')
				.where('tutorUid', '==', this.state.uid)
				.where('status', '==', 'pending')
				.get()
				.then(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						firebase
							.firestore()
							.collection('requests')
							.doc(doc.id)
							.update({ status: 'declined' })
							.then((docRef) => {})
							.catch((error) => {
								console.error('Error adding document: ', error);
							});
					});
				})
				.catch(function(error) {
					console.log('Error getting documents: ', error);
				});

			this.setState({ status: 'Offline' });
			// this.props.navigation.navigate('TutorWorkSetUp', { uid: this.state.uid });
		});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.mapContainer}>
					<Map locationPressFunc={this.toggleLoc} mapPressFunc={this.clearLocations} isStudent={false} />
					<Text style={styles.statusText}>Status: {this.state.status}</Text>
				</View>
				<View style={styles.sliderContainer}>
					<Slider
						value={this.state.value}
						maximumValue={100}
						minimumValue={10}
						step={5}
						thumbTintColor={primaryColor}
						trackStyle={styles.trackSlider}
						thumbStyle={styles.thumbStyle}
						onValueChange={(value) => this.setState({ value })}
					/>
					<View style={styles.sliderText}>
						<Text>$10/hr</Text>
						<Text style={styles.currentRateText}>
							Hourly Rate: $
							{this.state.value}
						</Text>
						<Text>$100/hr</Text>
					</View>
				</View>
				{this.state.status == 'Live' ? (
					<View style={styles.live}>
						<Button
							type={'secondary'}
							buttonStyle={styles.liveButtons}
							textStyle={styles.liveButtonsText}
							text={'End Live'}
							onPress={this.stopLive}
						/>
						<Button
							buttonStyle={styles.liveButtons}
							textStyle={styles.liveButtonsText}
							text={'Update Live'}
							onPress={this.goLive}
						/>
					</View>
				) : (
					<View style={styles.live}>
						<Button
							buttonStyle={styles.liveButtons}
							textStyle={styles.liveButtonsText}
							text={'Go Live'}
							onPress={this.goLive}
						/>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'green',
		justifyContent: 'space-between'
	},
	cancelButton: {
		alignSelf: 'flex-start'
	},
	mapContainer: {
		flex: 5
	},
	map: {
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flexGrow: 1
	},
	sliderContainer: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center'
	},
	slider: {
		flex: 1
	},
	sliderText: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	currentRateText: {
		fontSize: 30
	},
	live: {
		flex: 0.5,
		alignItems: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	liveButtons: {
		width: '40%'
	},
	liveButtonsText: {
		fontSize: 30
	},
	trackSlider: {
		height: 15,
		borderRadius: 7.5
	},
	thumbStyle: {
		height: 25,
		width: 25
	},
	statusText: {
		position: 'absolute',
		textAlign: 'center',
		fontSize: 30,
		alignSelf: 'center',
		paddingTop: 35
	}
});

export default TutorWorkSetUp;
