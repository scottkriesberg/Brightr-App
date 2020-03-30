import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Image } from 'react-native';
import ContainerStyles from '../../styles/container';
import TextStyles from '../../styles/text';
import ButtonStyles from '../../styles/button';
import { Rating } from '../components/profile';
import Loading from '../components/utils.js';

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
		this.state.uid = this.props.navigation.getParam('uid', '');
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

	toStudentMap = () => {
		this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
	};
	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={ContainerStyles.container}>
				<View style={ContainerStyles.profileHeaderContainer}>
					<Image
						style={ContainerStyles.avatarContainer}
						source={{
							uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
						}}
					/>
					<Icon.Button name="close" size={25} style={ButtonStyles.clearButton} onPress={this.toStudentMap} />
				</View>
				<View style={ContainerStyles.profileContainer}>
					<Text style={TextStyles.name}>{this.state.user.name}</Text>
					<Text style={styles.info}>Senior / CSCI</Text>
					<Text style={styles.description}>
						I love developing apps in my free time. I interned at Google last summer. I hope can help you.
					</Text>
					<Rating style={styles.rating} rating={this.state.user.rating} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		marginTop: 10,
		alignItems: 'center',
		padding: 60
	},
	info: {
		fontSize: 16,
		color: '#00BFFF',
		marginTop: 10
	},
	description: {
		fontSize: 16,
		color: '#696969',
		marginTop: 10,
		textAlign: 'center'
	},
	buttonContainer: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
		borderRadius: 30,
		backgroundColor: '#00BFFF'
	}
});
