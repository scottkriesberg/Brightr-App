import React, { Component } from 'react';
import { Button, Icon, Slider } from 'react-native-elements';
import {
	Alert,
	StyleSheet,
	Text,
	View,
	ImageBackground,
	TouchableWithoutFeedback,
	TouchableOpacity
} from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
const map = require('../../images/USC_Map.png');

function Location({ name, addLoc, style, locationColor }) {
	return (
		<View style={style}>
			<Text style={{ fontSize: 10 }} allowFontScaling={true}>
				{name}
			</Text>
			<Icon name="location-on" type="MaterialIcons" onPress={() => addLoc(name)} color={locationColor[name]} />
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
			value: 25,
			locationColor: {
				'Cafe 84': 'black',
				'Leavy Library': 'black',
				'Village Tables': 'black'
			}
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

	toggleLoc = (name) => {
		if (this.state.locations.includes(name)) {
			this.state.locations = this.state.locations.filter((x) => x != name);
			this.state.locationColor[name] = 'black';
			this.setState({ updateColor: true });
		} else {
			this.state.locations.push(name);
			this.state.locationColor[name] = '#6A7BD6';
			this.setState({ updateColor: true });
		}
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.mapContainer}>
					<TouchableWithoutFeedback onPress={this.clearLocations}>
						<ImageBackground source={map} style={styles.map}>
							<View style={styles.profileIcon}>
								<Icon name="person" onPress={this.cancel} />
							</View>
							<Location
								name="Leavey Library"
								addLoc={this.toggleLoc}
								style={styles.leavy}
								locationColor={this.state.locationColor}
							/>
							<Location
								name="Cafe 84"
								addLoc={this.toggleLoc}
								style={styles.cafe84}
								locationColor={this.state.locationColor}
							/>
							<Location
								name="USC Village Tables"
								addLoc={this.toggleLoc}
								style={styles.village}
								locationColor={this.state.locationColor}
							/>
						</ImageBackground>
					</TouchableWithoutFeedback>
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
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flexGrow: 1
	},
	village: {
		width: 40,
		left: 209,
		top: -136
	},
	cafe84: {
		width: 40,
		left: 20,
		top: 70
	},
	leavy: {
		width: 40,
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
