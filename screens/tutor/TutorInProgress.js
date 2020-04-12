import React, { Component } from 'react';
import { View, Alert, TouchableOpacity, StyleSheet, Text } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { RatingModal, WaitingModal, RecapModal } from '../components/inProgress';

class TutorInProgress extends Component {
	constructor() {
		super();
		this.ref = firebase.firestore().collection('tutors');
		this.sessionRef = firebase.firestore().collection('sessions');
		this.unsubscribe = null;

		this.state = {
			uid: '',
			sessionUid: '',
			session: {},
			isLoading: true,
			min: 0,
			sec: 0,
			hour: 0,
			ratingModalVisible: false,
			waitingModalVisible: false,
			recapModalVisible: false,
			rating: 0,
			finish: false,
			sessionRecap: ''
		};
		this.interval = null;
	}

	addRating(collection, uid, rating) {
		console.log(rating);
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

				// Commit to Firestore
				transaction.update(ref, {
					numRatings: newNumRatings,
					rating: newAvgRating
				});
			});
		});
	}

	calcSessionCost(sessionTime, hourlyRate) {
		const timeHours = sessionTime / 1000 / 60 / 60;
		if (timeHours < 0.25) {
			return 0.25 * hourlyRate;
		} else {
			return Math.round(timeHours * hourlyRate * 100) / 100;
		}
	}

	padToTwo = (number) => (number <= 9 ? `0${number}` : number);

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.sessionUid = this.props.navigation.getParam('sessionUid', '');
		this.ref = this.ref.doc(this.state.uid);
		this.sessionRef = this.sessionRef.doc(this.state.sessionUid);
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
		clearInterval(this.interval);
		this.unsubscribe();
		this.setState({ waitingModalVisible: false });
		this.setState({ ratingModalVisible: false });
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			this.state.session = doc.data();
			if (doc.data().tutorDone) {
				this.setState({ waitingModalVisible: true });
			}
			if (doc.data().tutorDone && doc.data().studentDone) {
				this.setState({ waitingModalVisible: false, ratingModalVisible: false, recapModalVisible: true });
				const sessionTime = Date.now() - this.state.session.startTime;
				const sessionRecap =
					'Time: ' +
					Math.round(sessionTime / 60000) +
					' minutes \n' +
					' Cost: $' +
					this.calcSessionCost(sessionTime, this.state.session.hourlyRate);
				this.setState({ sessionRecap: sessionRecap });
				this.sessionRef
					.update({
						studentRating: this.state.rating
					})
					.then(() => {
						this.addRating('students', this.state.session.studentUid, this.state.rating);
					});
			}
		}
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
				<RecapModal
					visible={this.state.recapModalVisible}
					headingText={'Session Recap'}
					recapText={this.state.sessionRecap}
					dismissFunc={() => {
						this.setState({ recapModalVisible: false });
						this.props.navigation.navigate('TutorRequestNavigator', {
							uid: this.state.uid
						});
					}}
				/>
				<RatingModal
					visible={this.state.ratingModalVisible}
					dismissFunc={() => {
						if (this.state.rating == 0) {
							Alert.alert('No Rating', 'Please rate your student', [ { text: 'OK' } ], {
								cancelable: false
							});
							return;
						}
						this.sessionRef.update({ tutorDone: true }).then(() => {
							this.setState({ ratingModalVisible: false });
						});
					}}
					text={'Please rate the student'}
					ratingFunc={(rating) => {
						this.state.rating = rating;
					}}
				/>
				<WaitingModal
					visible={this.state.waitingModalVisible}
					dismissFunc={() => {
						this.sessionRef.update({ tutorDone: false }).then(() => {
							this.setState({ ratingModalVisible: false });
							this.setState({ waitingModalVisible: false });
						});
					}}
					text={'Waiting for student to finish session...'}
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
		backgroundColor: primaryColor,
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
		backgroundColor: primaryColor,
		alignSelf: 'center',
		height: '25%',
		width: '85%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	liveButtonText: {
		fontSize: 40,
		color: secondaryColor
	}
});

export default TutorInProgress;
