import React, { Component } from 'react';
import { Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

export default class TutorConnectedPreview extends Component {
	static navigationOptions = {
		gestureEnabled: false,
		title: 'Tutor Profile',
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
		this.tutorRef = firebase.firestore().collection('tutors');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			id: '',
			tutorUid: '',
			connectId: '',
			tutor: {},
			isLoading: true,
			uid: '',
			classRequest: '',
			locationRequest: '',
			value: 15,
			description: ''
		};
	}

	componentDidMount() {
		this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
		this.state.uid = this.props.navigation.getParam('uid', '');
		this.state.connectId = this.props.navigation.getParam('connectId', '');
		this.tutorRef = this.tutorRef.doc(this.state.tutorUid);
		this.tutorRef.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					tutor: doc.data(),
					id: doc.id,
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
		this.unsubscribe = this.tutorRef.onSnapshot(this.onCollectionUpdate);
	}

	onCollectionUpdate = (doc) => {
		if (doc.exists) {
			if (doc.data()) {
				this.setState({ tutor: doc.data() });
			}
		} else {
			this.props.navigation.navigate('StudentConnections', { uid: this.state.uid });
		}
	};

	componentWillUnmount() {
		this.unsubscribe();
	}

	disconnect() {
		firebase
			.firestore()
			.collection('connections')
			.doc(this.state.connectId)
			.delete()
			.then(() => this.props.navigation.navigate('StudentConnections', { uid: this.state.uid }));
	}

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<ProfileHeadingInfo
					rating={this.state.tutor.rating}
					year={this.state.tutor.year}
					major={this.state.tutor.major.code}
					gpa={this.state.tutor.gpa}
					name={this.state.tutor.name}
					containerStyle={styles.basicInfoContainer}
					avatarStyle={styles.avatar}
					image={{
						uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
					}}
					bio={this.state.tutor.bio}
				/>
				<View style={styles.followConnectContainer}>
					{/* <Button buttonStyle={{ width: '40%', height: '60%' }} text={'Follow'} /> */}
					<Button
						buttonStyle={{ width: '40%', height: '60%' }}
						onPress={this.disconnect}
						text={'Disconnect'}
					/>
				</View>
				<ProfileClasses items={this.state.tutor.classes} />
				<View style={styles.requestContianer}>
					<Button buttonStyle={{ width: '60%', height: '70%' }} text={'Request Tutor'} />
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
		flex: 1,
		alignItems: 'center'
	}
});
