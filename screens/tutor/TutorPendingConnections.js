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

class TutorPendingConnections extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutorRef');
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
		title: 'Connection Requests',
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
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.connectionsRef = this.connectionsRef.where('tutorUid', '==', this.state.uid);
		this.unsubscribe = this.connectionsRef.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const connections = [];
		querySnapshot.forEach((doc) => {
			var studentInfo = {};
			const { studentUid } = doc.data();
			firebase.firestore().collection('students').doc(studentUid).get().then((studentDoc) => {
				if (studentDoc.exists) {
					studentInfo = studentDoc.data();
				} else {
				}

				connections.push({
					studentInfo,
					id: studentDoc.id,
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
		item = item.studentInfo;
		if (!this.filter(item)) {
			return;
		}
		return (
			<UserBar
				onPressFunc={() =>
					this.props.navigation.navigate('TutorPendingConnectionPreview', {
						studentUid: id,
						uid: this.state.uid,
						pendingConnectionId: pendingConnectionId,
						description: description
					})}
				user={item}
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
						placeholder="Search student name"
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
						<Text style={styles.noPendingText}>No Connection Requests</Text>
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
		width: '100%',

		paddingHorizontal: '2%'
	},
	noPendingText: {
		fontSize: 20,
		alignSelf: 'center',
		paddingTop: '50%'
	}
});

export default TutorPendingConnections;
