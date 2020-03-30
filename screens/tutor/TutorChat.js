import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {
	View,
	Alert,
	Button,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
	Text,
	TextInput
} from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';
import Loading from '../components/utils.js';

export default class Chat extends React.Component {
	constructor() {
		super();
		this.requestRef = firebase.firestore().collection('requests');
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

	codeGenerator = () => {
		const num1 = Math.floor(Math.random() * 10);
		const num2 = Math.floor(Math.random() * 10);
		const num3 = Math.floor(Math.random() * 10);
		const num4 = Math.floor(Math.random() * 10);
		return num1.toString() + num2.toString() + num3.toString() + num4.toString();
	};

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
		this.setState({ modalVisible: true });
	};

	begin = () => {
		if (this.state.code != this.state.request.startCode) {
			Alert.alert('Wrong Code', 'Please try again', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		const time = Date.now();
		this.requestRef
			.update({
				status: 'started'
			})
			.then((docRef) => {
				firebase
					.firestore()
					.collection('sessions')
					.add({
						studentUid: this.state.request.studentUid,
						tutorUid: this.state.request.tutorUid,
						startTime: time,
						location: this.state.request.location,
						estTime: this.state.request.estTime,
						className: this.state.request.className,
						startCode: this.state.request.startCode,
						status: 'in progress',
						date: new Date(),
						tutorRating: 0.0,
						studentRating: 0.0,
						sessionTime: 0.0,
						endCode: this.codeGenerator()
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
		} else {
			this.props.navigation.navigate('TutorIncomingRequests', {
				uid: this.state.uid
			});
		}
	};
	componentWillUnmount() {}
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<Modal
					animationType={'slide'}
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						console.log('Modal has been closed.');
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							Keyboard.dismiss();
						}}
					>
						<View style={styles.modal}>
							<Text style={styles.modalHeader}>Begin Session</Text>
							<TextInput
								keyboardType="numeric"
								returnKeyType="done"
								style={styles.codeInput}
								placeholder="Type code to begin session"
								onChangeText={(code) => this.setState({ code })}
								value={this.state.code}
							/>

							<Button
								title="Begin Session"
								onPress={() => {
									this.begin();
									this.state.code = '';
									this.state.rating = 3;
								}}
							/>
							<Button
								title="Back to Chat"
								onPress={() => {
									this.setState({ modalVisible: false });
								}}
							/>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				<View styel={styles.top}>
					<Button style={styles.button} title="Start Session" onPress={() => this.start()} />
					<Button style={styles.button} title="Cancel Session" onPress={() => this.cancel()} />
				</View>
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
	top: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'black'
	},
	chatView: {
		flex: 1
	},
	button: {},
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
		height: '5%'
	}
});
