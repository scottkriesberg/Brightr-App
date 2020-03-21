import React, { Component } from 'react';
import { Button, Icon, Slider } from 'react-native-elements';
import firebase from '../../firebase';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
const map = require('../../images/USC_Map.png');

function Location({ name, style }) {
	return (
		<View style={style}>
			<Icon name="location-on" type="MaterialIcons" onPress={() => console.log(name)} />
		</View>
	);
}

class TutorWorkSetUp extends Component {
	constructor() {
		super();
		this.state = {
			uid: '',
			user: {},
			isLoading: true
		};
	}

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		const ref = firebase.firestore().collection('tutors').doc(this.state.uid);
		ref.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id,
					isLoading: false,
					value: 10
				});
			} else {
				console.log('No such document!');
			}
		});
	}

	renderItem = ({ item }) => {
		return (
			<View style={styles.classRow}>
				<Text style={styles.classText}>{item}</Text>
			</View>
		);
	};

	cancel = () => {
		this.props.navigation.navigate('TutorHome', { uid: this.state.uid });
	};

	goLive = () => {
		this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
	};

	render() {
		if (this.state.isLoading) {
			return (
				<View style={styles.activity}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Button style={styles.button} title="Cancel" onPress={this.cancel} />
				</View>

				<View style={styles.mapContainer}>
					<TouchableWithoutFeedback onPress={this.clearLocations}>
						<ImageBackground source={map} style={styles.map}>
							<Location name={'Leavey Library'} style={styles.leavy} />
							<Location name={'Cafe 84'} style={styles.cafe84} />
							<Location name={'USC Village Tables'} style={styles.village} />
						</ImageBackground>
					</TouchableWithoutFeedback>
				</View>

				<View style={styles.slider}>
					<Slider
						value={this.state.value}
						maximumValue={100}
						minimumValue={10}
						step={5}
						onValueChange={(value) => this.setState({ value })}
					/>
					<Text>Hourly Price: ${this.state.value}</Text>
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
		flex: 2
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
	slider: {
		flex: 1
	},
	live: {
		flex: 1,
		backgroundColor: 'purple'
	}
});

export default TutorWorkSetUp;
