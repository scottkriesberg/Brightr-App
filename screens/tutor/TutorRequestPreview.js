import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Image } from 'react-native';
import ContainerStyles from '../../styles/container';
import ButtonStyles from '../../styles/button';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils';

export default class RequestPreview extends Component {
	constructor() {
		super();
		this.state = {
			studentUid: '',
			tutorUid: '',
			student: {},
			isLoading: true
		};
	}

	componentDidMount() {
		this.state.studentUid = this.props.navigation.getParam('studentUid', '');
		this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
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
	}

	toTutorIncomingRequests = () => {
		this.props.navigation.navigate('TutorIncomingRequests', { uid: this.state.tutorUid });
	};
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={ContainerStyles.container}>
				<Icon.Button
					name="close"
					size={25}
					style={ButtonStyles.clearButton}
					onPress={this.toTutorIncomingRequests}
				/>
				<ProfileHeadingInfo
					rating={this.state.student.rating}
					year={this.state.student.year}
					major={this.state.student.major}
					name={this.state.student.name}
					containerStyle={styles.basicInfoContainer}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.student.bio}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	basicInfoContainer: {
		flex: 5,
		backgroundColor: 'skyblue',
		alignItems: 'center'
	}
});
