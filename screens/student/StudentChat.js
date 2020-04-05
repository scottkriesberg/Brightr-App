import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Modal, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../../firebase';
import Fire from 'firebase';
import Loading from '../components/utils.js';
import { ChatHeader } from '../components/chat';

export default class Chat extends React.Component {
	constructor() {
		super();
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			requestUid: '',
			uid: '',
			user: {},
			isLoading: true,
			messages: [],
			modalVisible: false,
			request: {}
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
		// this.setState((previousState) => ({
		// 	messages: GiftedChat.append(previousState.messages, messages)
		// }));
		this.requestRef.update({
			messages: Fire.firestore.FieldValue.arrayUnion(messages[0])
		});
		// this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);
		const ref = firebase.firestore().collection('students').doc(this.state.uid);
		ref.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id
				});
				this.requestRef.get().then((doc) => {
					if (doc.exists) {
						this.setState({
							request: doc.data(),
							isLoading: false
						});
					} else {
						console.log('No such document!');
					}
				});
			} else {
				console.log('No such document!');
			}
		});

		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	cancel = () => {
		this.requestRef
			.delete()
			.then((docRef) => {
				this.props.navigation.navigate('StudentMap', {
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
		this.requestRef.update({ studentReady: true }).then(() => {
			this.setState({ modalVisible: true });
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
			if (doc.data().status == 'declined') {
				this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
			} else if (doc.data().tutorReady && doc.data().studentReady) {
				this.requestRef.update({ status: 'started' }).then(() => {
					this.props.navigation.navigate('StudentInProgress', { uid: this.state.uid });
				});
			}
		} else {
			this.props.navigation.navigate('StudentMap', {
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
				<Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
					<View style={styles.modalContainer}>
						<Loading />
						<Button
							style={styles.backToChatButton}
							title="Back to chat"
							onPress={() => {
								this.requestRef.update({ studentReady: false }).then(() => {
									this.setState({ modalVisible: false });
								});
							}}
						/>
					</View>
				</Modal>
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
	modalContainer: {
		flex: 1,
		paddingTop: 40,
		justifyContent: 'space-between'
	},
	modalHeader: {
		fontSize: 30,
		alignSelf: 'center'
	},
	codeText: {
		fontSize: 30,
		alignSelf: 'center'
	},
	backToChatButton: {}
});
