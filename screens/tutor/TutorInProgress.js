import React, { Component } from 'react';
import {
	View,
	TextInput,
	Alert,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	StyleSheet,
	ActivityIndicator,
	Text
} from 'react-native';
import { Button, Icon, AirbnbRating } from 'react-native-elements';
import firebase from '../../firebase';
import Fire from 'firebase';

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
			modalVisible: false,
			code: '',
			rating: 0,
			finish: false
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

	toggleModal(visible) {
		this.setState({ modalVisible: visible });
	}

	padToTwo = (number) => (number <= 9 ? `0${number}` : number);

	finish = () => {
		if (this.state.rating == 0) {
			Alert.alert('No Rating', 'Please rate your student', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		}
		this.sessionRef
			.update({
				studentRating: this.state.rating
			})
			.then(() => {
				this.state.finish = true;
				this.toggleModal(false);
				this.sessionRef.onSnapshot(this.onCollectionUpdate);
			});
	};

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
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			this.state.session = doc.data();
			if (this.state.session.status == 'completed' && this.state.finish) {
				this.addRating('students', this.state.session.studentUid, this.state.rating);
				this.state.code = '';
				this.state.rating = 0;
				this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
			}
		}
		this.setState({
			isLoading: false
		});
	};

	render() {
		if (this.state.isLoading) {
			return (
				<View style={styles.activity}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<Modal
					animationType={'slide'}
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						console.log('Modal has been closed.');
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							Keyboard.dismiss();
						}}
					>
						<View style={styles.modal}>
							<Text style={styles.modalHeader}>End Session Code: {this.state.session.endCode}</Text>

							<View>
								<Text style={styles.rateText}>Please rate the student</Text>

								<AirbnbRating
									count={5}
									defaultRating={0}
									reviews={[]}
									onFinishRating={(rating) => {
										this.state.rating = rating;
									}}
								/>
							</View>

							<Button
								title="Finish"
								onPress={() => {
									this.finish();
								}}
							/>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				<Text style={styles.heading}>Session Time</Text>
				<View style={styles.clock}>
					<Text style={styles.child}>{this.padToTwo(this.state.hour) + ' : '}</Text>
					<Text style={styles.child}>{this.padToTwo(this.state.min) + ' : '}</Text>
					<Text style={styles.child}>{this.padToTwo(this.state.sec)}</Text>
				</View>
				<Button style={styles.button} title="End Session" onPress={() => this.toggleModal(true)} />
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
		paddingTop: 400,
		justifyContent: 'space-between',
		paddingBottom: 40
	},
	modalHeader: {
		fontSize: 30,
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
	clock: {
		flexDirection: 'row',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 125,
		borderColor: 'black',
		backgroundColor: 'skyblue',
		width: 250,
		height: 250,
		justifyContent: 'center',
		alignItems: 'center'
	},
	child: {
		fontSize: 35
	},
	heading: {
		fontSize: 50,
		alignSelf: 'center'
	}
});

export default TutorInProgress;
