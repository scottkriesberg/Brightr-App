import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Modal, Button, StyleSheet, Text } from 'react-native';
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
		console.log('mod on');
		this.setState({ modalVisible: true });
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
			} else if (doc.data().status == 'started') {
				this.props.navigation.navigate('StudentInProgress', { uid: this.state.uid });
			}
		} else {
			this.props.navigation.navigate('StudentMap', {
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
				<Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
					<View style={{ marginTop: 22 }}>
						<View>
							<Text style={styles.modalHeader}>Start Code: {this.state.request.startCode}</Text>

							<Button
								title="Back to chat"
								onPress={() => {
									this.setState({ modalVisible: false });
								}}
							/>
						</View>
					</View>
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
	modalHeader: {
		fontSize: 30,
		alignSelf: 'center'
	}
});
