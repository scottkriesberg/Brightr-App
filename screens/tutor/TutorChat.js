import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Alert, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, Text } from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';
import Loading from '../components/utils.js';
import { ChatHeader, StartWaiting } from '../components/chat';

export default class Chat extends React.Component {
	constructor() {
		super();
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			requestUid: '',
			uid: '',
			user: {},
			request: {},
			isLoading: true,
			messages: [],
			code: '',
			modalVisible: false
		};
	}

	getUser() {
		return {
			name: this.state.user.name,
			email: 'email@email.com',
			id: this.state.uid,
			_id: this.state.uid
		};
	}

	onSend(messages) {
		this.requestRef.update({
			messages: Fire.firestore.FieldValue.arrayUnion(messages[0])
		});
	}

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);
		const ref = firebase.firestore().collection('tutors').doc(this.state.uid);
		ref.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id
				});
			}
		});
		this.requestRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					request: doc.data(),
					isLoading: false
				});
			}
		});
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	cancel = () => {
		this.requestRef
			.update({
				status: 'declined'
			})
			.then((docRef) => {
				this.props.navigation.navigate('TutorIncomingRequests', {
					uid: this.state.uid
				});
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
	};

	start = () => {
		this.requestRef.update({ tutorReady: true }).then(() => {
			this.setState({ modalVisible: true });
		});
	};

	begin = () => {
		const time = Date.now();
		firebase
			.firestore()
			.collection('sessions')
			.add({
				studentUid: this.state.request.studentUid,
				tutorUid: this.state.request.tutorUid,
				startTime: time,
				hourlyRate: this.state.user.hourlyRate,
				location: this.state.request.location,
				estTime: this.state.request.estTime,
				className: this.state.request.className,
				status: 'in progress',
				date: new Date(),
				tutorRating: 0.0,
				studentRating: 0.0,
				sessionTime: 0.0,
				studentDone: false,
				tutorDone: false
			})
			.then((docRef) => {
				this.props.navigation.navigate('TutorInProgress', {
					uid: this.state.uid,
					sessionUid: docRef.id
				});
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
	};

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			const messagesBackward = doc.data().messages;
			const messages = messagesBackward.reverse();
			for (var i = 0; i < messages.length; i++) {
				messages[i].createdAt = messages[i].createdAt.toDate();
			}
			this.setState({
				messages,
				isLoading: false
			});
			if (doc.data().status == 'started') {
				console.log('called');
				this.begin();
			}
		} else {
			this.props.navigation.navigate('TutorIncomingRequests', {
				uid: this.state.uid
			});
		}
	};
	componentWillUnmount() {
		this.unsubscribe();
	}
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<StartWaiting
					visible={this.state.modalVisible}
					text={'Waiting for student to start session...'}
					dismissFunc={() => {
						this.requestRef.update({ tutorReady: false }).then(() => {
							this.setState({ modalVisible: false });
						});
					}}
				/>
				<ChatHeader startFunction={this.start} cancelFunction={this.cancel} />
				<GiftedChat
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={this.getUser()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,
		paddingBottom: 10,
		flex: 1
	},
	chatView: {
		flex: 1
	},
	modal: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		justifyContent: 'space-between',
		paddingBottom: 40
	},
	modalHeader: {
		fontSize: 40,
		alignSelf: 'center'
	},
	codeInput: {
		alignSelf: 'center',
		width: '75%',
		backgroundColor: 'skyblue',
		height: '5%',
		color: 'white'
	}
});
