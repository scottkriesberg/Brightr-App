import React, { Component } from 'react';
import { Alert, View, TextInput, Modal, TouchableOpacity, Keyboard, StyleSheet, Text } from 'react-native';
import { Button, AirbnbRating } from 'react-native-elements';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { RatingModal, WaitingModal } from '../components/inProgress';

class StudentInProgress extends Component {
	constructor() {
		super();
		this.ref = firebase.firestore().collection('students');
		this.sessionRef = firebase.firestore().collection('sessions');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			min: 0,
			sec: 0,
			hour: 0,
			ratingModalVisible: false,
			waitingModalVisible: false,
			code: '',
			rating: 0,
			sessionUid: '',
			session: {}
		};
		this.interval = null;
	}

	toggleModal(visible) {
		this.setState({ ratingModalVisible: visible });
	}

	padToTwo = (number) => (number <= 9 ? `0${number}` : number);

	addRating(collection, uid, rating) {
		// In a transaction, add the new rating and update the aggregate totals
		var ref = firebase.firestore().collection(collection).doc(uid);
		return firebase.firestore().runTransaction((transaction) => {
			return transaction.get(ref).then((res) => {
				if (!res.exists) {
					throw 'Document does not exist!';
				}

				// Compute new number of ratings
				var newNumRatings = res.data().numRatings + 1;

				// Compute new average rating
				var oldRatingTotal = res.data().rating * res.data().numRatings;
				var newAvgRating = (oldRatingTotal + rating) / newNumRatings;

				//update stats
				var sessionRate = this.state.session.hourlyRate;
				var newTopHourlyRate = res.data().topHourlyRate;
				if (newTopHourlyRate < sessionRate) {
					newTopHourlyRate = sessionRate;
				}

				var newTimeWorked = res.data().timeWorked + this.state.hour * 60 + this.state.min;
				var newMoneyMade =
					res.data().moneyMade + sessionRate * this.state.hour + sessionRate * this.state.min / 60;

				// Commit to Firestore
				transaction.update(ref, {
					numRatings: newNumRatings,
					rating: newAvgRating,
					topHourlyRate: newTopHourlyRate,
					timeWorked: newTimeWorked,
					moneyMade: newMoneyMade
				});
			});
		});
	}

	finish = () => {
		if (this.state.rating == 0) {
			Alert.alert('No Rating', 'Please rate your tutor', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		this.sessionRef
			.update({
				tutorRating: this.state.rating,
				sessionTime: Date.now() - this.state.session.startTime,
				status: 'completed'
			})
			.then(() => {
				this.addRating('tutors', this.state.session.tutorUid, this.state.rating);
				this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
			});
	};

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.sessionRef = this.sessionRef
			.where('studentUid', '==', this.state.uid)
			.where('status', '==', 'in progress');
		this.unsubscribe = this.sessionRef.onSnapshot(this.onCollectionUpdate);
		this.interval = setInterval(() => {
			if (this.state.sec !== 59) {
				this.setState({
					sec: this.state.sec + 1
				});
			} else if (this.state.min !== 59) {
				this.setState({
					sec: 0,
					min: ++this.state.min
				});
			} else {
				this.setState({
					sec: 0,
					min: 0,
					hour: ++this.state.hour
				});
			}
		}, 1000);
	}

	componentWillUnmount() {
		this.setState({ waitingModalVisible: false });
		this.setState({ ratingModalVisible: false });
		this.unsubscribe();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	onCollectionUpdate = (querySnapshot) => {
		querySnapshot.forEach((doc) => {
			this.state.session = doc.data();
			if (doc.data().status == 'in progress') {
				this.sessionUid = doc.id;
				this.sessionRef = firebase.firestore().collection('sessions').doc(doc.id);
				if (doc.data().studentDone) {
					this.setState({ waitingModalVisible: true });
				}
				if (doc.data().tutorDone && doc.data().studentDone) {
					this.setState({ waitingModalVisible: false });
					this.setState({ ratingModalVisible: false });
					this.sessionRef
						.update({
							tutorRating: this.state.rating,
							sessionTime: Date.now() - this.state.session.startTime,
							status: 'completed'
						})
						.then(() => {
							this.addRating('tutors', this.state.session.tutorUid, this.state.rating);

							this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
						});
				}
			}
		});
		this.setState({
			isLoading: false
		});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<RatingModal
					visible={this.state.ratingModalVisible}
					dismissFunc={() => {
						if (this.state.rating == 0) {
							Alert.alert('No Rating', 'Please rate your tutor', [ { text: 'OK' } ], {
								cancelable: false
							});
							return;
						}
						this.sessionRef.update({ studentDone: true }).then(() => {
							this.setState({ ratingModalVisible: false });
						});
					}}
					text={'Please rate the tutor'}
					ratingFunc={(rating) => {
						this.state.rating = rating;
					}}
				/>

				<WaitingModal
					visible={this.state.waitingModalVisible}
					dismissFunc={() => {
						this.sessionRef.update({ studentDone: false }).then(() => {
							this.setState({ ratingModalVisible: false });
							this.setState({ waitingModalVisible: false });
						});
					}}
					text={'Waiting for tutor to finish session...'}
				/>

				<Text style={styles.heading}>Session Time</Text>
				<View style={styles.clockContainer}>
					<View style={styles.clock}>
						<Text style={styles.child}>{this.padToTwo(this.state.hour) + ' : '}</Text>
						<Text style={styles.child}>{this.padToTwo(this.state.min) + ' : '}</Text>
						<Text style={styles.child}>{this.padToTwo(this.state.sec)}</Text>
					</View>
				</View>
				<View style={styles.live}>
					<TouchableOpacity
						style={styles.liveButton}
						onPress={() => {
							this.setState({ ratingModalVisible: true });
						}}
					>
						<Text style={styles.liveButtonText}>End Session</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		justifyContent: 'space-between',
		paddingBottom: 40
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
		height: '5%'
	},
	rateText: {
		alignSelf: 'center'
	},
	activity: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	clockContainer: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	clock: {
		flexDirection: 'row',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 125,
		borderColor: 'black',
		justifyContent: 'center',
		backgroundColor: '#6A7BD6',
		width: 250,
		height: 250,
		alignItems: 'center'
	},
	child: {
		fontSize: 35
	},
	heading: {
		fontSize: 50,
		alignSelf: 'center'
	},
	cancelEndingButton: {
		justifyContent: 'center',
		alignSelf: 'center'
	},
	live: {
		flex: 0.75,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	liveButton: {
		backgroundColor: '#6A7BD6',
		alignSelf: 'center',
		height: '25%',
		width: '85%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 40,
		color: 'white'
	}
});

export default StudentInProgress;
