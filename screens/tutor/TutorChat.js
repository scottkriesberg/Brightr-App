import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Button, StyleSheet } from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';

export default class Chat extends React.Component {
	constructor() {
		super();
		this.requestRef = firebase.firestore().collection('requests');
		this.state = {
			requestUid: '',
			uid: '',
			user: {},
			isLoading: true,
			messages: []
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
		console.log(messages);
		this.requestRef.update({
			messages: Fire.firestore.FieldValue.arrayUnion(messages[0])
		});
		// this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
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
					key: doc.id,
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		const messagesBackward = doc.data().messages;
		const messages = messagesBackward.reverse();
		for (var i = 0; i < messages.length; i++) {
			messages[i].createdAt = messages[i].createdAt.toDate();
		}
		this.setState({
			messages,
			isLoading: false
		});
		console.log(messages);
	};
	componentWillUnmount() {}
	render() {
		return (
			// <View styles={styles.container}>
			// 	<View styel={styles.top}>
			// 		<Button style={styles.button} title="Start Session" onPress={() => this.start()} />
			// 		<Button style={styles.button} title="Cancel Session" onPress={() => this.cancel()} />
			// 	</View>
			// 	<View style={styles.chatView}>
			<GiftedChat
				messages={this.state.messages}
				onSend={(messages) => this.onSend(messages)}
				user={this.getUser()}
			/>
			// 	</View>
			// </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 100,
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
	}
});
