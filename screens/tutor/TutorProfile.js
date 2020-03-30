import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../../firebase';
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import Rating from '../components/profile';
import Loading from '../components/utils.js';

class TutorHome extends Component {
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
		const ref = firebase.firestore().collection('tutors').doc(this.state.uid);
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

	renderItem = ({ item }) => {
		return (
			<View style={styles.classRow}>
				<Text style={styles.classText}>
					{item.department}: {item.code}
				</Text>
			</View>
		);
	};

	logout = () => {
		this.props.navigation.navigate('Login');
	};

	toWorkPage = () => {
		this.props.navigation.navigate('TutorWorkSetUp', { uid: this.state.uid });
	};

	toEditPage = () => {
		this.props.navigation.navigate('TutorEditProfile', { uid: this.state.uid });
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Button
						style={styles.logoutButton}
						icon={<Icon name="arrow-left" size={15} color="white" />}
						iconLeft
						title="Logout"
						onPress={this.logout}
					/>

					<Text style={styles.profileText}>Profile</Text>
					<Icon
						style={styles.editProfile}
						name="account-edit"
						type="MaterialCommunityIcons"
						color="black"
						size={50}
						onPress={this.toEditPage}
					/>
				</View>

				<View style={styles.selfInfo}>
					<Image
						style={styles.avatar}
						source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					/>

					<View style={styles.info}>
						<Text style={styles.name}>{this.state.user.name}</Text>
						<Text style={styles.yearMajor}>
							{this.state.user.year} / {this.state.user.major}
						</Text>
						<Rating style={styles.ratingText} rating={this.state.user.rating} />
					</View>
				</View>

				<View style={styles.bioContainer}>
					<Text style={styles.bio}>{this.state.user.bio}</Text>
				</View>

				<View style={styles.stats} />

				<View style={styles.classes}>
					<FlatList
						data={this.state.user.classes}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>

				<View style={styles.work}>
					<Button style={styles.workButton} title="Start Tutoring" onPress={this.toWorkPage} />
				</View>

				<View style={styles.navbar} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	activity: {
		flex: 1,
		alignContent: 'center',
		paddingTop: '100%'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'green',
		justifyContent: 'space-between'
	},
	logoutButton: {
		alignSelf: 'flex-start'
	},
	profileText: {
		fontSize: 40
	},
	editProfile: {
		alignSelf: 'flex-end'
	},
	selfInfo: {
		flex: 3,
		backgroundColor: 'black',
		flexDirection: 'row'
	},
	avatar: {
		borderRadius: 63,
		borderWidth: 4,
		borderColor: 'white',
		flex: 1,
		height: '90%',
		alignSelf: 'center'
	},
	info: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	name: {
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},
	yearMajor: {
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},
	bioContainer: {
		flex: 2
	},
	bio: {
		fontSize: 30
	},
	rating: {
		flexDirection: 'row'
	},
	ratingText: {
		fontSize: 20,
		color: 'white'
	},
	ratingStars: {
		alignSelf: 'center',
		marginLeft: 5
	},
	stats: {
		flex: 4,
		backgroundColor: 'yellow'
	},
	classes: {
		flex: 5,
		backgroundColor: 'blue',
		alignItems: 'stretch'
	},
	classRow: {
		height: 60,
		marginBottom: 5,
		backgroundColor: 'skyblue'
	},
	classText: {
		fontSize: 50
	},
	work: {
		flex: 1,
		backgroundColor: 'purple'
	},
	navbar: {
		flex: 1,
		backgroundColor: 'red'
	}
});

export default TutorHome;
