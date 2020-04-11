import React, { Component } from 'react';
import firebase from '../../firebase';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ProfileTopBar, ProfileHeadingInfo, ProfileClasses } from '../components/profile';
import Loading from '../components/utils.js';
import { Button } from '../components/buttons';

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
					{this.state.user.classes[item].department}: {this.state.user.classes[item].code}
				</Text>
				<Text style={styles.classNameText}>{this.state.user.classes[item].name}</Text>
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
				<ProfileTopBar
					containerStyle={styles.profileHeaderContainer}
					logoutFunction={this.logout}
					closeFunc={this.toWorkPage}
				/>
				<ProfileHeadingInfo
					rating={this.state.user.rating}
					year={this.state.user.year}
					major={this.state.user.major.code}
					gpa={this.state.user.gpa}
					name={this.state.user.name}
					containerStyle={styles.basicInfoContainer}
					avatarStyle={styles.avatar}
					image={{
						uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
					}}
					bio={this.state.user.bio}
				/>
				<View style={styles.stats}>
					<Text style={styles.statsHeader}>Stats</Text>
					<Text style={styles.statsText}>Total Sessions: {this.state.user.numRatings}</Text>
					<Text style={styles.statsText}>Total Time: {this.state.user.timeWorked} minutes</Text>
					<Text style={styles.statsText}>
						Total Revenue: ${Math.round(this.state.user.moneyMade * 100) / 100}
					</Text>
					<Text style={styles.statsText}>Top Hourly Rate: ${this.state.user.topHourlyRate}/hr</Text>
					<Text style={styles.statsText}>
						Average Hourly Rate: $
						{Math.round(this.state.user.moneyMade / this.state.user.timeWorked * 60 * 100) / 100}
						/hr
					</Text>
				</View>
				<ProfileClasses items={this.state.user.classes} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		paddingBottom: 30,
		backgroundColor: '#F8F8FF'
	},
	profileHeaderContainer: {
		flex: 2,
		flexDirection: 'row',
		backgroundColor: '#F8F8FF',
		justifyContent: 'space-between',
		alignItems: 'center'
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
	info: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	bioContainer: {
		flex: 2,
		justifyContent: 'center'
	},
	bio: {
		alignSelf: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		textAlign: 'center'
	},
	stats: {
		flex: 5,
		backgroundColor: '#F8F8FF',
		justifyContent: 'space-between'
	},
	statsHeader: {
		color: primaryColor,
		alignSelf: 'center',
		fontSize: 30,
		fontWeight: 'bold'
	},
	statsText: {
		fontSize: 15,
		marginLeft: '4%'
	},
	classesHeader: {
		alignSelf: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: primaryColor
	},
	classes: {
		flex: 6,
		backgroundColor: '#F8F8FF',
		alignItems: 'stretch'
	},
	classRow: {
		height: 50,
		marginBottom: 7,
		marginHorizontal: 10,
		backgroundColor: primaryColor,
		borderRadius: 5
	},
	classText: {
		fontSize: 20,
		color: '#F8F8FF',
		fontWeight: 'bold',
		marginLeft: '2%'
	},
	classNameText: {
		marginLeft: '2%',
		fontWeight: 'bold',
		color: 'lightgrey'
	},
	live: {
		marginTop: 5,
		flex: 1.5,
		alignItems: 'center'
	}
});

export default TutorHome;
