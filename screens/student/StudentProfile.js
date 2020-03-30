import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Image } from 'react-native';
import ContainerStyles from '../../styles/container';
import TextStyles from '../../styles/text';
import ButtonStyles from '../../styles/button';
import { Rating, ProfileHeadingInfo } from '../components/profile';
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
				<Icon.Button name="close" size={25} style={ButtonStyles.clearButton} onPress={this.toStudentMap} />
				<ProfileHeadingInfo
					rating={this.state.user.rating}
					year={this.state.user.year}
					major={this.state.user.major}
					name={this.state.user.name}
					containerStyle={styles.basicInfoContainer}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.user.bio}
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
