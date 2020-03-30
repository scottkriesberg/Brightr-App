import React, { Component } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import firebase from '../../firebase';
import Loading from '../components/utils.js';

class TutorIncomingRequests extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			requests: []
		};
	}

	renderItem = ({ item }) => {
		return (
			<View style={styles.row}>
				<View style={styles.requestInfo}>
					<Text>{item.studentInfo.name}</Text>
					<Text>Class: {item.className.department}</Text>
					<Text>Location: {item.location}</Text>
					<Text>Estimated Session Time: {item.estTime} minutes</Text>
					<Text>{item.description}</Text>
				</View>
				<View style={styles.requestButtons}>
					<Button style={styles.button} title="Decline" onPress={() => this.decline({ item })} />
					<Button style={styles.button} title="Accept" onPress={() => this.accept({ item })} />
				</View>
			</View>
		);
	};

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.requestRef = this.requestRef.where('tutorUid', '==', this.state.uid).where('status', '==', 'pending');
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (querySnapshot) => {
		const requests = [];
		querySnapshot.forEach((doc) => {
			this.setState({
				isLoading: true
			});
			var studentInfo = {};
			const { studentUid, description, className, estTime, location } = doc.data();
			firebase.firestore().collection('students').doc(studentUid).get().then((studentDoc) => {
				if (studentDoc.exists) {
					studentInfo = studentDoc.data();
				} else {
				}
				requests.push({
					studentUid,
					className,
					estTime,
					location,
					description,
					studentInfo,
					id: doc.id
				});
				this.setState({
					requests,
					isLoading: false,
					numActive: requests.length
				});
			});
		});
		this.setState({
			requests,
			isLoading: false,
			numActive: requests.length
		});
	};

	decline = ({ item }) => {
		firebase
			.firestore()
			.collection('requests')
			.doc(item.id)
			.update({ status: 'declined' })
			.then((docRef) => {})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	};

	accept = ({ item }) => {
		firebase
			.firestore()
			.collection('requests')
			.doc(item.id)
			.update({
				status: 'accepted'
			})
			.then(() => {
				this.props.navigation.navigate('TutorChat', { uid: this.state.uid, requestUid: item.id });
			});
	};

	stopLive = () => {
		this.tutorRef.update({ isLive: false, hourlyRate: 0, locations: [] }).then(() => {
			for (var i = 0; i < this.state.requests.length; i++) {
				firebase
					.firestore()
					.collection('requests')
					.doc(this.state.requests[i].id)
					.update({ status: 'declined' })
					.then((docRef) => {})
					.catch((error) => {
						console.error('Error adding document: ', error);
					});
			}
			this.props.navigation.navigate('TutorWorkSetUp', { uid: this.state.uid });
		});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Incoming Requests</Text>
				</View>
				<View style={styles.requestList}>
					<FlatList
						data={this.state.requests}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
				<Button style={styles.endButton} title="End Live" onPress={this.stopLive} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'grey'
	},
	headerText: {
		fontSize: 40
	},
	requestList: {
		paddingTop: 10,
		flex: 15,
		backgroundColor: 'grey'
	},
	requestButtons: {
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	button: {
		height: 40,
		width: 150,
		alignSelf: 'flex-end',
		paddingLeft: 65
	},
	row: {
		padding: 15,
		marginBottom: 5,
		backgroundColor: 'skyblue',
		color: 'red',
		flexDirection: 'row',
		height: 120
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		paddingBottom: 40
	},
	activity: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default TutorIncomingRequests;
