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
import { UserBar } from '../components/UserBar';
class AddConnections extends Component {
	constructor() {
		super();
		this.studentRef = firebase.firestore().collection('students');
		this.tutorRef = firebase.firestore().collection('tutors');
		this.connectionsRef = firebase.firestore().collection('connections');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			searchText: '',
			isLoading: true,
			tutors: [],
			connections: []
		};
	}

	static navigationOptions = {
		gestureEnabled: false,
		title: 'Add Connections',
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
		this.state.connections = this.props.navigation.getParam('connections', []);
		this.state.uid = userUid;
		this.studentRef = this.studentRef.doc(this.state.uid);
		this.unsubscribe = this.tutorRef.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const tutors = [];
		querySnapshot.forEach((doc) => {
			var tutorInfo = doc.data();
			firebase
				.firestore()
				.collection('pending-connections')
				.where('studentUid', '==', this.state.uid)
				.where('tutorUid', '==', doc.id)
				.get()
				.then((querySnapshot) => {
					var pending = false;
					querySnapshot.forEach((pendingDoc) => {
						pending = true;
					});
					if (!pending && doc.id != this.state.uid) {
						tutors.push({
							tutorInfo,
							id: doc.id
						});
					}
					this.setState({
						tutors,
						isLoading: false,
						numActive: tutors.length
					});
				})
				.catch(function(error) {
					console.log('Error getting documents: ', error);
				});
		});
		this.setState({
			tutors,
			isLoading: false,
			numActive: tutors.length
		});
	};

	searchFilterFunction = (text) => {
		this.setState({
			searchText: text
		});
	};

	filter = (item) => {
		if (
			this.state.connections.filter((t) => {
				return item.id == t.id;
			}).length > 0
		) {
			return false;
		}
		if (this.state.searchText != '' && !item.tutorInfo.name.includes(this.state.searchText)) {
			return false;
		}
		return true;
	};

	renderItem = ({ item }) => {
		const id = item.id;
		if (!this.filter(item)) {
			return;
		}
		item = item.tutorInfo;
		return (
			<UserBar
				onPressFunc={() =>
					this.props.navigation.navigate('AddConnectionPreview', {
						tutorUid: id,
						uid: this.state.uid
					})}
				user={item}
				userId={id}
			/>
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
					{this.state.tutors.length > 0 ? (
						<FlatList
							data={this.state.tutors}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
						<Text style={styles.noConnectionsText}>No New Tutors</Text>
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
	noConnectionsText: {
		fontSize: 20,
		alignSelf: 'center',
		paddingTop: '50%'
	}
});

export default AddConnections;
