import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { Button } from '../components/buttons';

export default class TutorPreview extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.studentRef = firebase.firestore().collection('students');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			id: '',
			tutorUid: '',
			isLoading: true,
			uid: '',
			requestUid: '',
			timer: 3
		};
	}

	static navigationOptions = {
		title: 'Request Pending',
		headerStyle: {
			backgroundColor: secondaryColor
		},
		headerTintColor: primaryColor,
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 20
		}
	};

	componentDidMount() {
		this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);
		this.interval = setInterval(() => {
			this.setState((prevState) => ({ timer: prevState.timer - 1 }));
		}, 1000);
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			if (doc.data().status == 'accepted') {
				this.props.navigation.navigate('StudentChat', {
					uid: this.state.uid,
					requestUid: this.state.requestUid
				});
			} else if (doc.data().status == 'declined') {
				Alert.alert(
					'Tutor Unavailable',
					'Please request a different tutor',
					[
						{
							text: 'OK',
							onPress: () => this.props.navigation.navigate('StudentMap', { uid: this.state.uid })
						}
					],
					{
						cancelable: false
					}
				);
			}
		} else {
			this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
		}
	};

	componentDidUpdate() {
		if (this.state.timer === 0) {
			clearInterval(this.interval);
			// this.props.navigation.navigate('StudentChat', { uid: this.state.uid });
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
		clearInterval(this.interval);
	}

	cancelRequest = () => {
		this.requestRef
			.update({ status: 'cancelled' })
			.then((docRef) => {
				this.props.navigation.navigate('StudentActiveRequests', { uid: this.state.uid });
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
	};

	render() {
		return (
			<View style={styles.container}>
				{/* <View style={styles.holdTextContainer}>
					<Text style={styles.holdText}>Please hold while your tutor responds</Text>
				</View> */}
				<Loading />
				<Button text={'Cancel Request'} onPress={this.cancelRequest} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column-reverse',
		alignItems: 'center',
		alignContent: 'stretch',
		paddingBottom: '5%'
	},
	live: {
		marginTop: 5,
		flex: 1,
		alignItems: 'center'
	},
	liveButton: {
		backgroundColor: primaryColor,
		height: '85%',
		width: '75%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: secondaryColor
	},
	holdTextContainer: {
		flex: 8,
		justifyContent: 'center',
		marginBottom: '15%'
	},
	holdText: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});
