import React, { Component } from 'react';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import firebase from '../../firebase';
import ButtonStyle from '../../styles/button.js';
import Loading from '../components/utils.js';

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
				this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
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
		return (
			<View style={styles.container}>
				<Button
					style={ButtonStyle.normalButton}
					icon={<Icon name="arrow-left" size={20} color="white" />}
					iconLeft
					title="Cancel"
					onPress={() => {
						this.cancelRequest();
					}}
				/>
				<Loading />
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
	}
});
