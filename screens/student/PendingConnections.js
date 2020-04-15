import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Button } from '../components/buttons';
import { Rating } from '../components/profile';
import ContainerStyles from '../../styles/container.js';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import '../components/global';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
class PendingConnections extends Component {
	constructor() {
		super();
		this.studentRef = firebase.firestore().collection('students');
		this.connectionsRef = firebase.firestore().collection('pending-connections');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			searchText: '',
			isLoading: true,
			connections: []
		};
	}

	static navigationOptions = {
		headerShown: false
	};

	static navigationOptions = {
		gestureEnabled: false,
		title: 'Pending Connections',
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
		this.state.uid = userUid;
		this.studentRef = this.studentRef.doc(this.state.uid);
		this.connectionsRef = this.connectionsRef.where('studentUid', '==', this.state.uid);
		this.unsubscribe = this.connectionsRef.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const connections = [];
		querySnapshot.forEach((doc) => {
			var tutorInfo = {};
			const { tutorUid } = doc.data();
			firebase.firestore().collection('tutors').doc(tutorUid).get().then((tutorDoc) => {
				if (tutorDoc.exists) {
					tutorInfo = tutorDoc.data();
				} else {
				}

				connections.push({
					tutorInfo,
					id: tutorDoc.id,
					pendingConnectionId: doc.id,
					description: doc.data().description
				});
				this.setState({
					connections,
					isLoading: false,
					numActive: connections.length
				});
			});
		});
		this.setState({
			connections,
			isLoading: false,
			numActive: connections.length
		});
	};

	searchFilterFunction = (text) => {
		this.setState({
			searchText: text
		});
	};

	filter = (item) => {
		if (this.state.searchText != '' && !item.name.includes(this.state.searchText)) {
			return false;
		}
		return true;
	};

	renderItem = ({ item }) => {
		const pendingConnectionId = item.pendingConnectionId;
		const id = item.id;
		const description = item.description;
		item = item.tutorInfo;
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
				style={[ ContainerStyles.tutorPreviewContainer ]}
				onPress={() =>
					this.props.navigation.navigate('PendingConnectionPreview', {
						tutorUid: id,
						uid: this.state.uid,
						pendingConnectionId: pendingConnectionId,
						description: description
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

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchBar}
						placeholder="Search tutor name"
						onChangeText={(text) => this.searchFilterFunction(text)}
						value={this.state.searchText}
					/>
				</View>
				<View style={styles.connectList}>
					{this.state.connections.length > 0 ? (
						<FlatList
							data={this.state.connections}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
						<Text style={styles.noPendingText}>No Pending Connections</Text>
					)}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	header: {
		flex: 0.5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	searchContainer: {
		flex: 0.25,
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: '2%'
	},
	connectList: {
		flex: 5,
		width: '100%'
	},
	headerText: {
		fontSize: 40,
		color: primaryColor
	},
	addConnection: {
		alignSelf: 'flex-start',
		justifyContent: 'flex-start'
	},
	searchBar: {
		width: '90%',
		// borderWidth: 1,
		// borderColor: 'black',
		paddingHorizontal: '2%'
	},
	noPendingText: {
		fontSize: 20,
		alignSelf: 'center',
		paddingTop: '50%'
	}
});

export default PendingConnections;
