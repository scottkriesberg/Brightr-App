import React, { Component } from 'react';
import {
	StyleSheet,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	Text,
	View,
	TouchableOpacity
} from 'react-native';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import { Dropdown } from '../components/dropdown';
import { Button } from '../components/buttons';
import { ProfileTopBar, ProfileHeadingInfo, ProfileClasses } from '../components/profile';

export default class TutorPendingConnectionPreview extends Component {
	static navigationOptions = {
		gestureEnabled: false,
		title: 'Pending Connection',
		headerStyle: {
			backgroundColor: secondaryColor
		},
		headerTintColor: primaryColor,
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize: 20
		}
	};

	constructor() {
		super();
		this.studentRef = firebase.firestore().collection('students');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			studentUid: '',
			description: '',
			student: {},
			isLoading: true,
			uid: '',
			pendingConnectionId: '',
			description: ''
		};
	}

	componentDidMount() {
		this.state.studentUid = this.props.navigation.getParam('studentUid', '');
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.pendingConnectionId = this.props.navigation.getParam('pendingConnectionId', '');
		this.state.description = this.props.navigation.getParam('description', '');
		this.studentRef = this.studentRef.doc(this.state.studentUid);
		this.studentRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					student: doc.data(),
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
		this.unsubscribe = this.studentRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			if (doc.data()) {
				this.setState({ student: doc.data() });
			}
		} else {
			this.props.navigation.navigate('StudentConnections', { uid: this.state.uid });
		}
	};

	componentWillUnmount() {
		this.unsubscribe();
	}

	cancelConnectionRequest = () => {
		firebase
			.firestore()
			.collection('pending-connections')
			.doc(this.state.pendingConnectionId)
			.delete()
			.then(() => this.props.navigation.navigate('TutorPendingConnections', { uid: this.state.uid }));
	};

	acceptConnectionRequest = () => {
		firebase
			.firestore()
			.collection('connections')
			.add({
				tutorUid: this.state.uid,
				studentUid: this.state.studentUid
			})
			.then(() => {
				this.cancelConnectionRequest();
			});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		console.log(this.state.student);
		return (
			<View style={styles.container}>
				<ProfileHeadingInfo
					rating={this.state.student.rating}
					year={this.state.student.year}
					major={this.state.student.major.code}
					gpa={this.state.student.gpa}
					name={this.state.student.name}
					containerStyle={styles.basicInfoContainer}
					avatarStyle={styles.avatar}
					image={'demoImages/' + this.state.studentUid + '.jpg'}
					bio={this.state.student.bio}
				/>
				<ProfileClasses items={this.state.student.classes} />
				<View style={styles.descriptionContainer}>
					<Text style={styles.descriptionTextHeader}>Request Description</Text>
					{this.state.description.length == 0 ? (
						<Text style={styles.descriptionText}>N/A</Text>
					) : (
						<Text style={styles.descriptionText}>{this.state.description}</Text>
					)}
				</View>
				<View style={styles.requestContianer}>
					<Button
						buttonStyle={{ width: '45%', height: '70%', justifyContent: 'center', padding: 7 }}
						text={'Cancel Request'}
						type={'secondary'}
						onPress={this.cancelConnectionRequest}
					/>
					<Button
						buttonStyle={{ width: '45%', height: '70%', justifyContent: 'center', padding: 7 }}
						text={'Accept Request'}
						onPress={this.acceptConnectionRequest}
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
		backgroundColor: '#F8F8FF'
	},
	basicInfoContainer: {
		flex: 5,
		flexDirection: 'row',
		backgroundColor: '#F8F8FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: '5%'
	},
	descriptionContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	avatar: {
		flex: 3,
		borderRadius: 75,
		borderWidth: 4,
		borderColor: primaryColor,
		alignSelf: 'center',
		aspectRatio: 1
	},
	followConnectContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'flex-start'
	},
	requestContianer: {
		flex: 1.5,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	descriptionText: {
		fontSize: 16,
		width: '90%',
		borderColor: 'grey',
		borderWidth: 1,
		borderRadius: 5,
		textAlign: 'left',
		height: '50%',
		padding: 10
	},
	descriptionTextHeader: {
		fontSize: 25
	}
});
