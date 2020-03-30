import React, { Component } from 'react';
import { Button, Icon, Slider } from 'react-native-elements';
import { Alert, StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
const map = require('../../images/USC_Map.png');

function Location({ name, addLoc, style }) {
	return (
		<View style={style}>
			<Icon name="location-on" type="MaterialIcons" onPress={() => addLoc(name)} />
		</View>
	);
}

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
		this.state.uid = this.props.navigation.getParam('uid', '');
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

	renderItem = ({ item }) => (
		<View style={styles.classRow}>
			<Text style={styles.classText}>{item}</Text>
		</View>
	);

	cancel = () => {
		this.props.navigation.navigate('TutorHome', { uid: this.state.uid });
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

	toggleLoc = (name) => {
		console.log(name);
		if (this.state.locations.includes(name)) {
			this.state.locations = this.state.locations.filter((x) => x != name);
		} else {
			this.state.locations.push(name);
		}
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.profileIcon}>
					<Icon name="person" onPress={this.cancel} />
				</View>

				<View style={styles.mapContainer}>
					<TouchableWithoutFeedback onPress={this.clearLocations}>
						<ImageBackground source={map} style={styles.map}>
							<Location name="Leavey Library" addLoc={this.toggleLoc} style={styles.leavy} />
							<Location name="Cafe 84" addLoc={this.toggleLoc} style={styles.cafe84} />
							<Location name="USC Village Tables" addLoc={this.toggleLoc} style={styles.village} />
						</ImageBackground>
					</TouchableWithoutFeedback>
				</View>
				<View style={styles.sliderContainer}>
					<Slider
						value={this.state.value}
						maximumValue={100}
						minimumValue={10}
						step={5}
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
					<Button style={styles.button} title="Go Live" onPress={this.goLive} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	activity: {
		flex: 1,
		alignContent: 'center',
		paddingTop: '100%'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40
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
		alignItems: 'stretch',
		justifyContent: 'center',
		flexGrow: 1
	},
	village: {
		width: 20,
		left: 209,
		top: -136
	},
	cafe84: {
		width: 20,
		left: 20,
		top: 70
	},
	leavy: {
		width: 20,
		left: 290,
		top: 70
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
		flex: 1,
		justifyContent: 'center'
	}
});

export default TutorWorkSetUp;
