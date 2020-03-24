import React, { Component } from 'react';
import {
	Alert,
	View,
	TextInput,
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
			modalVisible: false,
			code: '',
			rating: 0,
			sessionUid: '',
			session: {}
		};
		this.interval = null;
	}

	toggleModal(visible) {
		this.setState({ modalVisible: visible });
	}

	padToTwo = (number) => (number <= 9 ? `0${number}` : number);

	finish = () => {
		if (this.state.code != this.state.session.endCode) {
			Alert.alert('Wrong Code', 'Please try again', [ { text: 'OK' } ], {
				cancelable: false
			});
			return;
		} else if (this.state.rating == 0) {
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
		clearInterval(this.interval);
	}

	onCollectionUpdate = (querySnapshot) => {
		querySnapshot.forEach((doc) => {
			this.state.session = doc.data();
			this.sessionUid = doc.id;
			this.sessionRef = firebase.firestore().collection('sessions').doc(doc.id);
		});
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
							<Text style={styles.modalHeader}>End Session</Text>
							<TextInput
								keyboardType="numeric"
								returnKeyType="done"
								style={styles.codeInput}
								placeholder="Type code to end session"
								onChangeText={(code) => this.setState({ code })}
								value={this.state.code}
							/>

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
									this.state.code = '';
									this.state.rating = 0;
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

export default StudentInProgress;
