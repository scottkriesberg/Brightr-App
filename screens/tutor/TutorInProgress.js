import React, { Component } from 'react';
import {
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

class TutorInProgress extends Component {
	constructor() {
		super();
		this.ref = firebase.firestore().collection('tutors');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			requests: [],
			min: 0,
			sec: 0,
			hour: 0,
			modalVisible: false,
			code: '',
			rating: 3
		};
		this.interval = null;
	}

	toggleModal(visible) {
		this.setState({ modalVisible: visible });
	}

	padToTwo = (number) => (number <= 9 ? `0${number}` : number);

	finish = () => {
		this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
	};

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.ref = this.ref.doc(this.state.uid);
		this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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
									this.state.rating = 3;
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

export default TutorInProgress;
