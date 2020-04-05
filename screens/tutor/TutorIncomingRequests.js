import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
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
			<TouchableOpacity
				style={styles.row}
				onPress={() =>
					this.props.navigation.navigate('TutorRequestPreview', {
						tutorUid: this.state.uid,
						studentUid: item.studentUid
					})}
			>
				<View style={styles.requestInfo}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} allowFontScaling={true}>
						{item.studentInfo.name}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>
						Class: {item.className.department} {item.className.code}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Location: {item.location}</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>
						Estimated Time: {item.estTime} min
					</Text>
					<Text
						style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}
						minimumFontScale={0.4}
						adjustsFontSizeToFit={true}
						numberOfLines={2}
						allowFontScaling={true}
					>
						Description: {item.description}
					</Text>
				</View>
				<View style={styles.requestButtons}>
					<Button type="clear" style={styles.button} title="Accept" onPress={() => this.accept({ item })} />
					<Button type="clear" style={styles.button} title="Decline" onPress={() => this.decline({ item })} />
				</View>
			</TouchableOpacity>
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
					<Text adjustsFontSizeToFit style={styles.headerText}>
						Incoming Requests
					</Text>
				</View>
				<View style={styles.requestList}>
					<FlatList
						data={this.state.requests}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
				<View style={styles.live}>
					<TouchableOpacity style={styles.liveButton} onPress={this.stopLive}>
						<Text style={styles.liveButtonText}>End Live</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	headerText: {
		fontSize: 40
	},
	requestList: {
		paddingTop: 10,
		flex: 15,
		backgroundColor: 'white'
	},
	requestInfo: {
		flex: 2,
		justifyContent: 'space-around',
		margin: 10
	},
	requestButtons: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'stretch',
		margin: 10
	},
	button: {
		alignSelf: 'center',
		width: '85%',
		backgroundColor: 'white',
		borderRadius: 15
	},
	row: {
		backgroundColor: '#6A7BD6',
		flexDirection: 'row',
		marginBottom: '2%',
		marginHorizontal: 16,
		borderRadius: 20
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		paddingBottom: 40
	},
	live: {
		flex: 1,
		alignItems: 'center'
	},
	liveButton: {
		backgroundColor: '#6A7BD6',
		height: '100%',
		width: '75%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		alignContent: 'center'
	},
	liveButtonText: {
		fontSize: 40,
		color: 'white'
	}
});

export default TutorIncomingRequests;
