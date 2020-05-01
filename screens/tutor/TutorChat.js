import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Alert, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Modal, Text } from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';
import Loading from '../components/utils.js';
import { ChatHeader, StartWaiting, OptionsModal } from '../components/chat';
import { Icon } from 'react-native-elements';
import { ProfileIcon } from '../components/profile';

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
			modalVisible: false,
			optionsVisible: false
		};
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return {
			headerTitle: () => <ProfileIcon image={{ uri: params.studentImage }} name={params.studentName} />,
			headerStyle: {
				backgroundColor: secondaryColor,
				height: 115
			},
			headerRight: navigation.state.params.headerRight,
			headerTintColor: primaryColor,
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize: 40
			}
		};
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
		this.props.navigation.setParams({
			headerRight: () => (
				<Icon
					onPress={() => this.setState({ optionsVisible: true })}
					name="ellipsis-v"
					type="font-awesome"
					color={primaryColor}
					containerStyle={{ right: 17 }}
				/>
			)
		});
		this.state.uid = this.props.navigation.getParam('tutorUid', '');
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
		this.setState({ optionsVisible: false });
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
		this.setState({ optionsVisible: false, modalVisible: true });
		this.requestRef.update({ tutorReady: true }).then(() => {});
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
				classObj: this.state.request.classObj,
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
				this.setState({ modalVisible: false });
				this.begin();
			} else if (doc.data().status == 'cancelled') {
				Alert.alert(
					'Request Cancelled',
					'This student has cancelled their request',
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
							}
						}
					],
					{
						cancelable: false
					}
				);
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
				<OptionsModal
					visible={this.state.optionsVisible}
					cancelFunc={this.cancel}
					startFunc={this.start}
					dismissFunc={() => this.setState({ optionsVisible: false })}
				/>
				<GiftedChat
					textInputStyle={styles.chatTextInput}
					scrollToBottomStyle={styles.chatBottom}
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
		flex: 1
	},
	chatView: {
		flex: 1
	},
	chatTextInput: {},
	chatBottom: {
		backgroundColor: 'yellow'
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
		color: secondaryColor
	}
});
