import React, { Component } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	ImageBackground,
	Image,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import firebase from '../../firebase';
import ContainerStyles from '../../styles/container.js';
import { Rating } from '../components/profile';
import Loading from '../components/utils.js';

const map = require('../../images/USC_Map.png');

function Location({ name, locationFilter, style }) {
	return (
		<View style={style}>
			<Icon name="location-on" type="MaterialIcons" onPress={() => locationFilter(name)} />
		</View>
	);
}

class StudentMap extends Component {
	constructor() {
		super();
		this.ref = firebase.firestore().collection('tutors').where('isLive', '==', true);
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			data: [],
			query: {},
			location: 'All Locations',
			numActive: 0,
			isFilterVisable: false
		};
	}
	toggleFilterWindow = () => {
		this.setState({ isFilterVisable: !this.state.isFilterVisable });
	};

	applyFilter = () => {
		this.toggleFilterWindow();
	};

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={ContainerStyles.tutorPreviewContainer}
				onPress={() =>
					this.props.navigation.navigate('TutorPreview', {
						tutorId: item.id,
						uid: this.state.uid
					})}
			>
				{/* Different containers needed for image and description for styling */
				/* Tutor image */}
				<View>
					<Image
						style={ContainerStyles.previewImage}
						source={{
							uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
						}}
					/>
				</View>
				{/* Tutor Info */}
				<View>
					<Text>{item.name}</Text>
					<Rating rating={item.rating} />
					<Text>
						{item.major} / {item.year}
					</Text>
					<Text>${item.hourlyRate}/hour</Text>
				</View>
			</TouchableOpacity>
		);
	};

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.ref.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (querySnapshot) => {
		const data = [];
		querySnapshot.forEach((doc) => {
			const { name, major, rating, year, hourlyRate, classes } = doc.data();
			data.push({
				name,
				major,
				rating,
				year,
				hourlyRate,
				classes,
				id: doc.id
			});
		});
		this.setState({
			data,
			isLoading: false,
			numActive: data.length
		});
	};

	toProfile = () => {
		this.props.navigation.navigate('StudentProfile', { uid: this.state.uid });
	};
	clearLocations = () => {
		this.state.query = {};
		this.updateRef();
		this.ref.onSnapshot(this.onCollectionUpdate);
		this.state.location = 'All Locations';
	};

	updateRef() {
		var newRef = firebase.firestore().collection('tutors').where('isLive', '==', true);
		for (var i in this.state.query) {
			newRef = newRef.where(this.state.query[i].field, this.state.query[i].op, this.state.query[i].val);
		}
		this.ref = newRef;
	}

	locationFilter = (name) => {
		if (this.state.query.hasOwnProperty('location')) {
			this.state.query['location'] = {
				field: 'locations',
				op: 'array-contains',
				val: name
			};
		} else {
			this.state.query['location'] = {
				field: 'locations',
				op: 'array-contains',
				val: name
			};
		}
		this.updateRef();
		this.ref.onSnapshot(this.onCollectionUpdate);
		this.state.location = name;
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.filterModal}>
					<Modal isVisible={this.state.isFilterVisable}>
						<View>
							<Text>Filter</Text>
							<Button title="Apply" onPress={this.applyFilter} />
						</View>
					</Modal>
				</View>

				<View style={styles.mapContainer}>
					<TouchableWithoutFeedback onPress={this.clearLocations}>
						<ImageBackground source={map} style={styles.map}>
							<View style={styles.profileIcon}>
								<Icon name="person" onPress={this.toProfile} />
							</View>
							<Location
								name={'Leavey Library'}
								style={styles.leavy}
								locationFilter={this.locationFilter}
							/>
							<Location name={'Cafe 84'} style={styles.cafe84} locationFilter={this.locationFilter} />
							<Location
								name={'USC Village Tables'}
								style={styles.village}
								locationFilter={this.locationFilter}
							/>
						</ImageBackground>
					</TouchableWithoutFeedback>
				</View>
				<View style={ContainerStyles.midbar}>
					<View style={styles.findTutorFilterContainer}>
						<Text style={styles.findTutorText}>Find Tutor</Text>
						<Icon
							style={styles.filterButton}
							name="settings-input-component"
							type="Octicons"
							color="black"
							onPress={this.toggleFilterWindow}
						/>
					</View>
					<Text style={styles.currentLocationText}>
						{this.state.location}: {this.state.numActive} Active
					</Text>
				</View>
				<View style={styles.tutorList}>
					<FlatList
						ListHeaderComponentStyle={ContainerStyles.tutorList}
						data={this.state.data}
						renderItem={this.renderItem}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	currentLocationText: {
		flex: 1,
		paddingLeft: 5
	},
	filterButton: {
		flex: 1
	},
	tutorList: {
		flex: 5,
		backgroundColor: 'white'
	},
	mapContainer: {
		flex: 8
	},
	findTutorFilterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
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
	map: {
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flexGrow: 1
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40
	},
	findTutorText: {
		paddingLeft: 5,
		fontSize: 30
	}
});

export default StudentMap;
