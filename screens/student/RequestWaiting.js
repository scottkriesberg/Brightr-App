import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { Alert, StyleSheet, View, Image } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { Button } from '../components/buttons';
import { Icon } from 'react-native-elements';
const FaceLogo = require('../../assets/FaceLogo.png');

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
			tutor: {}
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
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			firebase.firestore().collection('tutors').doc(doc.data().tutorUid).get().then((tutorDoc) => {
				if (tutorDoc.exists) {
					this.setState({
						tutor: tutorDoc.data()
					});
				} else {
					console.log('No such document!');
				}
			});
			if (doc.data().status == 'accepted') {
				this.props.navigation.navigate('StudentChat', {
					uid: this.state.uid,
					requestUid: this.state.requestUid,
					tutorImage: 'https://bootdey.com/img/Content/avatar/avatar6.png',
					tutorUid: this.state.tutorUid,
					tutorName: this.state.tutor.name
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

	componentWillUnmount() {
		this.unsubscribe();
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
				<View style={styles.iconBackground}>
					<Image source={FaceLogo} style={styles.face} />
					<Icon name="check" type="font-awesome" color="white" size={50} containerStyle={styles.checkMark} />
				</View>
				<Loading />
				<View style={styles.holdTextContainer}>
					<Text style={styles.holdText}>You will be notified once your tutor responds to your request.</Text>
				</View>
				<Button text={'Cancel Request'} onPress={this.cancelRequest} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		alignContent: 'stretch',
		paddingBottom: '5%'
	},
	iconBackground: {
		backgroundColor: primaryColor,
		borderRadius: 150,
		borderColor: accentColor,
		borderWidth: 5,
		height: '25%',
		width: '40%',
		alignItems: 'center',
		justifyContent: 'center',
		top: '20%'
	},
	face: {
		top: 25
	},
	checkMark: {
		position: 'relative',
		left: 55,
		backgroundColor: accentColor,
		borderRadius: 25
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
		fontWeight: 'bold',
		textAlign: 'center'
	}
});
