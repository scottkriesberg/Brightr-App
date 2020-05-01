import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, Modal, StyleSheet, Text, Alert } from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';
import Loading from '../components/utils.js';
import { ChatHeader, StartWaiting, OptionsModal } from '../components/chat';
import { ProfileIcon } from '../components/profile';
import { Icon } from 'react-native-elements';
import store from '../../redux/store';

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
			optionsVisible: false,
			request: {}
		};
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		console.log(params);
		return {
			headerTitle: navigation.state.params.headerTitle,
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
		const tutorUid = this.props.navigation.getParam('tutorUid', '');
		const tutorName = this.props.navigation.getParam('tutorName', '');
		console.log('demoImages/' + tutorUid + '.jpg');
		this.props.navigation.setParams({
			headerTitle: () => <ProfileIcon image={'demoImages/' + tutorUid + '.jpg'} name={tutorName} />,
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
		const userCreds = store.getState().user;
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);
		const ref = firebase.firestore().collection('students').doc(userCreds.uid);
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
		this.setState({ optionsVisible: false });
		this.requestRef
			.update({ status: 'cancelled' })
			.then((docRef) => {
				console.log('test');
				this.props.navigation.navigate('StudentActiveRequests', {
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
		// this.setState({ optionsVisible: false, modalVisible: true });
		this.requestRef.update({ studentReady: true }).then(() => {
			console.log(this.state.modalVisible);

			this.setState({ update: true });
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
				Alert.alert(
					'Tutor Canceled Request',
					'Please request a different tutor',
					[
						{
							text: 'OK',
							onPress: () =>
								this.props.navigation.navigate('StudentMap', {
									uid: this.state.uid
								})
						}
					],
					{
						cancelable: false
					}
				);
			} else if (!doc.data().tutorReady && doc.data().studentReady) {
				console.log('here');
				this.setState({ optionsVisible: false, modalVisible: true });
			} else if (doc.data().tutorReady && doc.data().studentReady) {
				this.setState({ optionsVisible: false, modalVisible: false });
				this.requestRef.update({ status: 'started' }).then(() => {
					this.props.navigation.navigate('StudentInProgress', {
						uid: this.state.uid
					});
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
				<StartWaiting
					visible={this.state.modalVisible}
					text={'Waiting for tutor to start session...'}
					dismissFunc={() => {
						this.requestRef.update({ studentReady: false }).then(() => {
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
	}
});
