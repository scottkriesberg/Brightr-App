import React, { Component } from 'react';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import firebase from '../../firebase';
import Fire from 'firebase';

export default class TutorPreview extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.studentRef = firebase.firestore().collection('students');
		this.requestRef = firebase.firestore().collection('requests');
		this.state = {
			id: '',
			tutorId: '',
			isLoading: true,
			uid: '',
			requestUid: '',
			timer: 3
		};
	}
	componentDidMount() {
		this.state.tutorId = this.props.navigation.getParam('tutorId', '');
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.requestUid = this.props.navigation.getParam('requestUid', '');
		this.requestRef = this.requestRef.doc(this.state.requestUid);
		this.interval = setInterval(() => {
			this.setState((prevState) => ({ timer: prevState.timer - 1 }));
		}, 1000);
	}

	//   onCollectionUpdate = () => {
	//       var test = 0;
	//     this.studentRef.onSnapshot(function(doc) {
	//         const data = doc.data();
	//         if(data != undefined){
	//             test = data.requestStatus;
	//             this.requestStatus = test;
	//             console.log(this.requestStatus)
	//             if(this.requestStatus == 1){
	//                 clearInterval(this.interval);
	//                 this.cancelRequest()

	//               }
	//         }
	//     });
	//   }

	componentDidUpdate() {
		if (this.state.timer === 0) {
			clearInterval(this.interval);
			// this.props.navigation.navigate('StudentChat', { uid: this.state.uid });
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	cancelRequest = () => {
		this.requestRef
			.delete()
			.then((docRef) => {
				this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				this.setState({
					isLoading: false
				});
			});
	};

	render() {
		if (this.state.isLoading) {
			return (
				<View style={styles.container}>
					<Button
						style={styles.backButton}
						icon={<Icon name="arrow-left" size={20} color="white" />}
						iconLeft
						title="Cancel"
						onPress={this.cancelRequest}
					/>
					<View style={styles.activity}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.backButton}>
					<Button
						icon={<Icon name="arrow-left" size={20} color="white" />}
						iconLeft
						title="Cancel"
						onPress={this.cancelRequest}
					/>
					<Button title="To Chat Screen" />
				</View>
				<View style={styles.activity}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text> {this.state.timer} </Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: 40
	},
	backButton: {
		flex: 1
	},
	activity: {
		flex: 1
	}
});
