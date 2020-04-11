import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import ContainerStyles from '../../styles/container';
import ButtonStyles from '../../styles/button';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils';

export default class RequestPreview extends Component {
	constructor() {
		super();
		this.unsubscribe = null;
		this.requestRef = firebase.firestore().collection('requests');
		this.state = {
			studentUid: '',
			tutorUid: '',
			requestUid: '',
			student: {},
			request: {},
			isLoading: true
		};
	}

	componentDidMount() {
		this.state.studentUid = this.props.navigation.getParam('studentUid', '');
		this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);

		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	decline = () => {
		this.requestRef.update({ status: 'declined' }).then((docRef) => {}).catch((error) => {
			console.error('Error adding document: ', error);
		});
	};

	accept = () => {
		this.requestRef
			.update({
				status: 'accepted'
			})
			.then(() => {
				this.props.navigation.navigate('TutorChat', {
					uid: this.state.tutorUid,
					requestUid: this.state.requestUid
				});
			});
	};

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			this.state.request = doc.data();
			if (doc.data().status == 'cancelled') {
				Alert.alert(
					'Request Cancelled',
					'This student has cancelled their request',
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.tutorUid });
							}
						}
					],
					{
						cancelable: false
					}
				);
			} else if (doc.data().status == 'declined') {
				this.toTutorIncomingRequests();
				return;
			}
			const ref = firebase.firestore().collection('students').doc(this.state.studentUid);
			ref.get().then((doc) => {
				if (doc.exists) {
					this.setState({
						student: doc.data(),
						key: doc.id,
						isLoading: false
					});
				} else {
					console.log('No such document!');
				}
			});
		} else {
			this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.tutorUid });
		}
	};

	componentWillUnmount() {
		this.unsubscribe();
	}

	toTutorIncomingRequests = () => {
		this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.tutorUid });
	};
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.backButton} onPress={this.toTutorIncomingRequests}>
						<Icon name="arrow-left" size={30} color={secondaryColor} />
						<Text style={styles.backButtonText}>Back</Text>
					</TouchableOpacity>
				</View>
				<ProfileHeadingInfo
					rating={this.state.student.rating}
					year={this.state.student.year}
					major={this.state.student.major.code}
					name={this.state.student.name}
					containerStyle={styles.basicInfoContainer}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.student.bio}
				/>
				<View style={styles.requestInfoContainer}>
					<Text style={styles.requestInfoHeader}>Request Information</Text>
					<Text style={styles.requestInfoText}>
						Class: {this.state.request.classObj.department} {this.state.request.classObj.code}
					</Text>
					<Text style={styles.requestInfoText}>Location: {this.state.request.location}</Text>
					<Text style={styles.requestInfoText}>Estmated Session Time: {this.state.request.estTime}</Text>
					<Text style={styles.requestInfoText}>Session Description: {this.state.request.description}</Text>
				</View>

				<View style={styles.live}>
					<TouchableOpacity style={styles.declineButton} onPress={this.decline}>
						<Text adjustsFontSizeToFit style={styles.declineButtonText}>
							Decline
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.acceptButton} onPress={this.accept}>
						<Text adjustsFontSizeToFit style={styles.acceptButtonText}>
							Accept
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		backgroundColor: primaryColor,
		flex: 0.75,
		justifyContent: 'flex-start'
	},
	backButton: {
		height: '100%',
		width: '25%',
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	backButtonText: {
		fontSize: 30,
		color: secondaryColor
	},
	basicInfoContainer: {
		flex: 5,
		backgroundColor: 'skyblue',
		alignItems: 'center'
	},
	requestInfoContainer: {
		flex: 3,
		backgroundColor: secondaryColor,
		justifyContent: 'space-around'
	},
	requestInfoHeader: {
		fontSize: 25,
		alignSelf: 'center'
	},
	requestInfoText: {
		fontSize: 20,
		marginLeft: '3%'
	},
	live: {
		marginTop: 5,
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	declineButton: {
		backgroundColor: secondaryColor,
		height: '75%',
		width: '35%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		borderColor: primaryColor,
		borderWidth: 1
	},
	declineButtonText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: primaryColor
	},
	acceptButton: {
		backgroundColor: primaryColor,
		height: '75%',
		width: '35%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	acceptButtonText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: secondaryColor
	}
});
