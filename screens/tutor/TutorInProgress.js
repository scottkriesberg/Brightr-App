import React, { Component } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
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
			requests: []
		};
    }
    
    back = () => {
        console.log("cancel")
		this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.uid });
	};

	componentDidMount() {
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.ref = this.ref.doc(this.state.uid);
		this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		const requests = doc.data().requests;
		this.setState({
			requests,
			isLoading: false,
			numActive: requests.length
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
				<Button style={styles.button} title="back" onPress={this.back} />
                <Text>00:00</Text>
                <Button style={styles.button} title="End Session" onPress={this.back} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	tutorInfo: {
		color: 'white'
	},
	tutorList: {
		flex: 5,
		backgroundColor: 'blue'
	},
	row: {
		padding: 15,
		marginBottom: 5,
		backgroundColor: 'skyblue',
		color: 'red',
		flexDirection: 'row'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40
	},
	activity: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default TutorInProgress;
