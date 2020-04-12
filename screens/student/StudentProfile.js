import React, { Component } from 'react';
import firebase from '../../firebase';
import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import { ProfileTopBar, ProfileHeadingInfo, ProfileClasses } from '../components/profile';
import Loading from '../components/utils';

export default class Profile extends Component {
	constructor() {
		super();
		this.state = {
			uid: '',
			user: {},
			isLoading: true
		};
	}

	componentDidMount() {
		// console.log(this.props.navigation.state.params.results);
		this.state.uid = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid');
		// this.state.uid = this.state.uid = userUid;
		const ref = firebase.firestore().collection('students').doc(this.state.uid);
		ref.get().then((doc) => {
			if (doc.exists) {
				this.setState({
					user: doc.data(),
					key: doc.id,
					isLoading: false
				});
			} else {
				console.log('No such document!');
			}
		});
	}

	logout = () => {
		this.props.navigation.navigate('Login');
	};

	toStudentMap = () => {
		this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
	};
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<SafeAreaView style={styles.container}>
				<ProfileTopBar
					containerStyle={styles.profileHeaderContainer}
					logoutFunction={this.logout}
					closeFunc={this.toStudentMap}
				/>

				<ProfileHeadingInfo
					rating={this.state.user.rating}
					year={this.state.user.year}
					major={this.state.user.major.code}
					name={this.state.user.name}
					containerStyle={styles.basicInfoContainer}
					avatarStyle={styles.avatar}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.user.bio}
				/>
				<ProfileClasses items={this.state.user.classes} />
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	basicInfoContainer: {
		flex: 5,
		alignItems: 'center',
		backgroundColor: '#F8F8FF',
		flexDirection: 'row',
		alignSelf: 'center'
	},
	profileHeaderContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#F8F8FF',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		backgroundColor: primaryColor,
		justifyContent: 'space-evenly'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: '#F8F8FF'
	},
	clearButton: {
		marginTop: 40,
		marginRight: 15,
		height: 50,
		width: 50,
		borderRadius: 25,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	avatar: {
		height: 150,
		width: 150,
		borderRadius: 75,
		borderWidth: 4,
		borderColor: primaryColor,
		alignSelf: 'center',
		aspectRatio: 1
	}
});
