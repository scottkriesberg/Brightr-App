import React, { Component } from 'react';
import { Icon, Slider } from 'react-native-elements';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { Map } from '../components/map';

class TutorWorkSetUp extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.state = {
			uid: '',
			user: {},
			isLoading: true,
			locations: [],
			value: 25
		};
	}

	componentDidMount() {
		this.state.uid = this.props.navigation.dangerouslyGetParent().getParam('uid');
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.tutorRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id,
					isLoading: false,
					value: 25
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
				this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
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

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.mapContainer}>
					<Map locationPressFunc={this.toggleLoc} mapPressFunc={this.clearLocations} isStudent={false} />
					<View style={{ position: 'absolute', marginTop: '6%', marginLeft: '1%' }}>
						<Icon size={35} name="person" onPress={this.toProfile} />
					</View>
				</View>
				<View style={styles.sliderContainer}>
					<Slider
						value={this.state.value}
						maximumValue={100}
						minimumValue={10}
						step={5}
						thumbTintColor="#6A7BD6"
						trackStyle={styles.trackSlider}
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

				<View style={styles.live}>
					<TouchableOpacity style={styles.liveButton} onPress={this.goLive}>
						<Text style={styles.liveButtonText}>Go Live</Text>
					</TouchableOpacity>
				</View>
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
		paddingRight: 10
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
		flex: 0.75,
		alignItems: 'center'
	},
	liveButton: {
		backgroundColor: '#6A7BD6',
		height: '75%',
		width: '75%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 40,
		color: 'white'
	},
	trackSlider: {
		height: 10
	}
});

export default TutorWorkSetUp;
