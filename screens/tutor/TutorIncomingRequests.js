import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button } from '../components/buttons';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import '../components/global';

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

	static navigationOptions = {
		headerShown: false
	};

	renderItem = ({ item }) => {
		const color = item.status == 'pending' ? 'grey' : 'green';
		const screenNav = item.status == 'pending' ? 'TutorRequestPreview' : 'TutorChat';
		return (
			<TouchableOpacity
				style={[ styles.row, { backgroundColor: color } ]}
				onPress={() =>
					this.props.navigation.navigate(screenNav, {
						tutorUid: this.state.uid,
						studentUid: item.studentUid,
						requestUid: item.id
					})}
			>
				<View style={styles.requestInfo}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', color: secondaryColor }} allowFontScaling={true}>
						{item.studentInfo.name}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: secondaryColor }}>
						Class: {item.classObj.department} {item.classObj.code}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: secondaryColor }}>
						Location: {item.location}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: secondaryColor }} numberOfLines={1}>
						Estimated Time: {item.estTime} min
					</Text>
					<Text
						style={{ fontSize: 15, fontWeight: 'bold', color: secondaryColor }}
						minimumFontScale={0.4}
						adjustsFontSizeToFit={true}
						numberOfLines={2}
						allowFontScaling={true}
					>
						Description: {item.description ? item.description : 'N/A'}
					</Text>
				</View>
				{item.status == 'pending' ? (
					<View style={styles.requestButtons}>
						<Button
							type="primary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Accept"
							onPress={() => this.accept({ item })}
						/>
						<Button
							type="secondary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Decline"
							onPress={() => this.decline({ item })}
						/>
					</View>
				) : null}
			</TouchableOpacity>
		);
	};

	componentDidMount() {
		// this.state.uid = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid', '');
		this.state.uid = userUid;
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.requestRef = this.requestRef
			.where('tutorUid', '==', this.state.uid)
			.where('status', 'in', [ 'pending', 'accepted' ]);
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const requests = [];
		querySnapshot.forEach((doc) => {
			this.setState({
				isLoading: true
			});
			var studentInfo = {};
			const { studentUid, description, classObj, estTime, location, status } = doc.data();
			firebase.firestore().collection('students').doc(studentUid).get().then((studentDoc) => {
				if (studentDoc.exists) {
					studentInfo = studentDoc.data();
				} else {
				}
				requests.push({
					studentUid,
					status,
					classObj,
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
				this.props.navigation.navigate('TutorChat', { tutorUid: this.state.uid, requestUid: item.id });
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
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text
						adjustsFontSizeToFit
						style={styles.headerText}
						allowFontScaling={true}
						adjustsFontSizeToFit={true}
						numberOfLines={1}
					>
						Active Requests
					</Text>
				</View>
				<View style={styles.requestList}>
					{this.state.requests.length > 0 ? (
						<FlatList
							data={this.state.requests}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
						<Text style={styles.noRequstsText}>No Active Requests</Text>
					)}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: secondaryColor,
		width: '100%'
	},
	headerText: {
		fontSize: 40,
		color: primaryColor
	},
	requestList: {
		paddingTop: 10,
		flex: 15,
		backgroundColor: secondaryColor
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
		width: '95%'
	},
	buttonText: {
		alignSelf: 'center',
		padding: 3
	},
	row: {
		backgroundColor: primaryColor,
		flexDirection: 'row',
		marginBottom: '2%',
		marginHorizontal: 16,
		borderRadius: 20
	},
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	live: {
		flex: 2,
		alignItems: 'center',
		width: '100%'
	},
	noRequstsText: {
		fontSize: 20,
		alignSelf: 'center',
		paddingTop: '50%'
	}
});

export default TutorIncomingRequests;
