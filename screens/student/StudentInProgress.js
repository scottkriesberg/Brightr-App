import React, { Component } from 'react';
import { Alert, View, Image, StyleSheet, Text } from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { RatingModal, WaitingModal, RecapModal } from '../components/inProgress';
import { Button } from '../components/buttons';
const FaceLogo = require('../../assets/FaceLogo.png');

class StudentInProgress extends Component {
	constructor() {
		super();
		this.ref = firebase.firestore().collection('students');
		this.sessionRef = firebase.firestore().collection('sessions');
		this.currentSessionRef = firebase.firestore().collection('sessions');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			min: 0,
			sec: 0,
			hour: 0,
			ratingModalVisible: false,
			waitingModalVisible: false,
			recapModalVisible: false,
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
				const sessionTime = Date.now() - this.state.session.startTime;
				var newMoneyMade =
					res.data().moneyMade + this.calcSessionCost(sessionTime, this.state.session.hourlyRate);

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

	componentDidMount() {
		this.state.uid = userUid;
		// this.state.uid = this.props.navigation.getParam('uid', '');
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
		// Alert.alert(
		// 	'Session Completed',
		// 	'test',
		// 	[
		// 		{
		// 			text: 'OK',
		// 			onPress: () => {
		// 				this.addRating('tutors', this.state.session.tutorUid, this.state.rating);
		// 				this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
		// 			}
		// 		}
		// 	],
		// 	{
		// 		cancelable: false
		// 	}
		// );
	}

	componentWillUnmount() {
		this.setState({ waitingModalVisible: false });
		this.setState({ ratingModalVisible: false });
		this.unsubscribe();
		clearInterval(this.interval);
	}

	calcSessionCost(sessionTime, hourlyRate) {
		const timeHours = sessionTime / 1000 / 60 / 60;
		if (timeHours < 0.25) {
			return 0.25 * hourlyRate;
		} else {
			return Math.round(timeHours * hourlyRate * 100) / 100;
		}
	}

	onCollectionUpdate = (querySnapshot) => {
		querySnapshot.forEach((doc) => {
			this.state.session = doc.data();
			if (doc.data().status == 'in progress') {
				this.sessionUid = doc.id;
				this.currentSessionRef = firebase.firestore().collection('sessions').doc(doc.id);
				if (doc.data().studentDone) {
					this.setState({ waitingModalVisible: true });
				}
				if (doc.data().tutorDone && doc.data().studentDone) {
					const sessionTime = Date.now() - this.state.session.startTime;
					const sessionCost = this.calcSessionCost(sessionTime, this.state.session.hourlyRate);
					const sessionRecap =
						'Time: ' + Math.round(sessionTime / 60000) + ' minutes \n' + ' Cost: $' + sessionCost;
					this.setState({ sessionRecap: sessionRecap });
					this.setState({ waitingModalVisible: false, ratingModalVisible: false, recapModalVisible: true });
					this.currentSessionRef
						.update({
							tutorRating: this.state.rating,
							sessionTime: sessionTime,
							status: 'completed',
							sessionCost: sessionCost
						})
						.then(() => {
							this.addRating('tutors', this.state.session.tutorUid, this.state.rating);
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
				<RecapModal
					visible={this.state.recapModalVisible}
					headingText={'Session Recap'}
					recapText={this.state.sessionRecap}
					dismissFunc={() => {
						this.setState({ recapModalVisible: false });
						this.props.navigation.navigate('StudentTabNavigator', {
							uid: this.state.uid
						});
					}}
				/>
				<RatingModal
					visible={this.state.ratingModalVisible}
					dismissFunc={() => {
						if (this.state.rating == 0) {
							Alert.alert('No Rating', 'Please rate your tutor', [ { text: 'OK' } ], {
								cancelable: false
							});
							console.log(this.currentSessionRef);
							return;
						}
						this.currentSessionRef.update({ studentDone: true }).then(() => {
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
						this.currentSessionRef.update({ studentDone: false }).then(() => {
							this.setState({ ratingModalVisible: false });
							this.setState({ waitingModalVisible: false });
						});
					}}
					text={'Waiting for tutor to finish session...'}
				/>
				<View style={styles.facesContainer}>
					<View style={styles.studentFace}>
						<Image source={FaceLogo} style={styles.face} />
					</View>
					<View style={styles.tutorFace}>
						<Image source={FaceLogo} style={styles.face} />
					</View>
				</View>
				<View style={styles.headerContainer}>
					<Text style={styles.heading}>Session Time</Text>
				</View>
				<View style={styles.clockContainer}>
					<Text style={styles.child} adjustsFontSizeToFit={true} numberOfLines={1}>
						{this.padToTwo(this.state.hour) + ' : ' + this.padToTwo(this.state.min)}
					</Text>
				</View>
				<View style={styles.live}>
					<Button
						text={'End Session'}
						onPress={() => {
							this.setState({ ratingModalVisible: true });
						}}
					/>
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
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	child: {
		fontSize: 65,
		fontWeight: 'bold'
	},
	headerContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		top: '6%'
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
	},
	tutorFace: {
		backgroundColor: accentColor,
		borderRadius: 150,
		borderColor: primaryColor,
		borderWidth: 5,
		height: 175,
		width: 175,
		right: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	studentFace: {
		backgroundColor: primaryColor,
		borderRadius: 150,
		borderColor: accentColor,
		borderWidth: 5,
		height: 175,
		width: 175,
		left: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	facesContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		top: '25%'
	}
});

export default StudentInProgress;
