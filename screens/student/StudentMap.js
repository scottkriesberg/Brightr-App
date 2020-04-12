import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Icon, Slider } from 'react-native-elements';
import Modal from 'react-native-modal';
import firebase from '../../firebase';
import ContainerStyles from '../../styles/container.js';
import { Rating } from '../components/profile';
import Loading from '../components/utils.js';
import { Map } from '../components/map';
import { Button } from '../components/buttons';

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
			locationFilter: 'All Locations',
			ratingFilter: 0,
			gpaFilter: 0,
			numActive: 0,
			isFilterVisable: false
		};
		this.filter = this.filter.bind(this);
	}
	toggleFilterWindow = () => {
		this.setState({ isFilterVisable: !this.state.isFilterVisable });
	};
	filter(tutor) {
		if (tutor.rating < this.state.ratingFilter) {
			return false;
		}
		if (!tutor.locations.includes(this.state.locationFilter) && this.state.locationFilter != 'All Locations') {
			return false;
		}
		if (tutor.gpa < this.state.gpaFilter) {
			return false;
		}
		return true;
	}

	static navigationOptions = {
		headerShown: false
	};

	applyFilter = () => {
		this.setState({ update: true });
		this.toggleFilterWindow();
	};

	renderItem = ({ item }) => {
		if (!this.filter(item)) {
			return;
		}
		var classList = '';
		for (var i = 0; i < item.classesArray.length; i++) {
			classList += item.classesArray[i] + ', ';
		}
		classList = classList.substring(0, classList.length - 2);
		return (
			<TouchableOpacity
				style={ContainerStyles.tutorPreviewContainer}
				onPress={() =>
					this.props.navigation.navigate('TutorPreview', {
						tutorUid: item.id,
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
				<View
					style={{
						flex: 1
					}}
				>
					<Text
						style={{
							fontSize: 20
						}}
					>
						{item.name}
					</Text>
					<Rating rating={item.rating} />
					<Text adjustsFontSizeToFit={true} numberOfLines={2}>
						{item.major.code} / {item.year}
					</Text>
					<Text>${item.hourlyRate}/hour</Text>
				</View>
				<View
					style={{
						flex: 1,
						alignSelf: 'flex-start',
						marginTop: '3%',
						margin: '8%'
					}}
				>
					<Text
						style={{
							fontSize: 20
						}}
					>
						Classes
					</Text>
					<Text adjustsFontSizeToFit={true} numberOfLines={3}>
						{classList}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	componentDidMount() {
		// console.log(this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid'));
		// this.state.uid = this.props.navigation.dangerouslyGetParent().getParam('uid', 'ocyNQp4r0vfcC13YE56iAzckTke2');
		// this.state.uid = this.props.navigation
		// 	.dangerouslyGetParent()
		// 	.dangerouslyGetParent()
		// 	.dangerouslyGetParent()
		// 	.getParam('uid');
		this.state.uid = userUid;
		firebase.firestore().collection('students').doc(this.state.uid).get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data()
				});
				this.ref = this.ref.where('classesArray', 'array-contains-any', this.state.user.classesArray);
				this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
			} else {
				console.log('No such document!');
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const data = [];
		querySnapshot.forEach((doc) => {
			const tutor = doc.data();
			tutor.id = doc.id;
			data.push(tutor);
		});
		this.setState({
			data,
			isLoading: false,
			numActive: data.length
		});
	};

	locationFilter = (pin) => {
		this.setState({ locationFilter: pin.title });
	};

	toProfile = () => {
		this.props.navigation.navigate('StudentProfile', { uid: this.state.uid });
	};
	clearLocations = () => {
		this.setState({ locationFilter: 'All Locations' });
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View>
					<Modal isVisible={this.state.isFilterVisable}>
						<View style={styles.filterModal}>
							<Text style={styles.filterTitle}>Filter</Text>
							<View style={styles.filtersContainer}>
								<Slider
									value={this.state.gpaFilter}
									maximumValue={4}
									minimumValue={0}
									step={0.25}
									thumbTintColor={primaryColor}
									trackStyle={styles.trackSlider}
									onValueChange={(value) => this.setState({ gpaFilter: value })}
								/>
								<Text style={styles.sliderText}>Minimum GPA: {this.state.gpaFilter}</Text>
								<Slider
									value={this.state.ratingFilter}
									maximumValue={5}
									minimumValue={0}
									step={0.25}
									thumbTintColor={primaryColor}
									trackStyle={styles.trackSlider}
									onValueChange={(value) => this.setState({ ratingFilter: value })}
								/>
								<Text style={styles.sliderText}>Minimum Rating: {this.state.ratingFilter}</Text>
							</View>
							<View style={styles.filterButtonsContainer}>
								<Button
									text={'Clear'}
									type={'secondary'}
									textStyle={styles.clearButtonText}
									buttonStyle={styles.filterButtons}
									onPress={() => {
										this.setState({ ratingFilter: 0, gpaFilter: 0 });
										this.toggleFilterWindow();
									}}
								/>

								<Button
									text={'Apply'}
									textStyle={styles.filterButtonsText}
									buttonStyle={styles.filterButtons}
									onPress={this.applyFilter}
								/>
							</View>
						</View>
					</Modal>
				</View>

				<View style={styles.mapContainer}>
					<Map locationPressFunc={this.locationFilter} mapPressFunc={this.clearLocations} isStudent={true} />
				</View>
				<View style={ContainerStyles.midbar}>
					<View style={styles.findTutorFilterContainer}>
						<Text style={styles.findTutorText} adjustsFontSizeToFit>
							Find Tutor
						</Text>
						<Icon
							style={styles.filterButton}
							name="settings-input-component"
							type="Octicons"
							color="black"
							onPress={this.toggleFilterWindow}
						/>
					</View>
				</View>
				<View style={styles.tutorList}>
					<FlatList
						ListHeaderComponentStyle={ContainerStyles.tutorList}
						data={this.state.data}
						renderItem={this.renderItem}
						keyExtractor={(item) => item.id}
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
		backgroundColor: secondaryColor
	},
	mapContainer: {
		flex: 8
	},
	findTutorFilterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	map: {
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flexGrow: 1
	},
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	findTutorText: {
		paddingLeft: 5,
		fontSize: 30
	},
	filterModal: {
		backgroundColor: 'rgba(255,255,255,0.8)',
		height: '40%',
		borderRadius: 15,
		padding: 10,
		justifyContent: 'space-around'
	},
	filterButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1
	},
	filterButtons: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '40%',
		height: '100%'
	},
	filterButtonsText: {
		fontSize: 30,
		color: secondaryColor
	},
	filterTitle: {
		flex: 1,
		fontSize: 40,
		alignSelf: 'center'
	},
	filtersContainer: {
		flex: 3,
		justifyContent: 'center'
	},
	sliderText: {
		fontSize: 20
	},

	clearButtonText: {
		fontSize: 30
		// color: primaryColor
	}
});

export default StudentMap;
