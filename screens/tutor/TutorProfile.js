import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import firebase from '../../firebase';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ProfileTopBar, ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils.js';
import ButtonStyles from '../../styles/button';

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
				<Text>{item.name}</Text>
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
				<ProfileTopBar logoutFunction={this.logout} editPageFunction={this.toEditPage} />
				<ProfileHeadingInfo
					rating={this.state.user.rating}
					year={this.state.user.year}
					major={this.state.user.major}
					name={this.state.user.name}
					containerStyle={styles.basicInfoContainer}
					image={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
					bio={this.state.user.bio}
				/>
				<View style={styles.stats}>
					<Text style={styles.statsHeader}>Stats</Text>
					<Text style={styles.statsText}>People Helped: {this.state.user.numRatings}</Text>
					<Text style={styles.statsText}>Time Worked: {this.state.user.timeWorked} minutes</Text>
					<Text style={styles.statsText}>Money Made: ${this.state.user.moneyMade}</Text>
					<Text style={styles.statsText}>Top Hourly Rate: ${this.state.user.topHourlyRate}/hr</Text>
					<Text style={styles.statsText}>
						Average Hourly Rate: ${Math.round(
							this.state.user.moneyMade / this.state.user.timeWorked * 60 * 100
						) / 100}/hr
					</Text>
				</View>

				<View style={styles.classes}>
					<FlatList
						data={this.state.user.classes}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>

				<Button type="outline" title="Start Tutoring" onPress={this.toWorkPage} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 40,
		paddingBottom: 20
	},
	basicInfoContainer: {
		flex: 5,
		backgroundColor: 'skyblue',
		justifyContent: 'space-around',
		alignItems: 'center'
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
		flex: 4,
		backgroundColor: 'white',
		justifyContent: 'space-between'
	},
	statsHeader: {
		alignSelf: 'center',
		fontSize: 30
	},
	statsText: {
		fontSize: 20
	},
	classes: {
		flex: 5,
		backgroundColor: 'grey',
		alignItems: 'stretch'
	},
	classRow: {
		height: 60,
		marginBottom: 5,
		backgroundColor: 'skyblue'
	},
	classText: {
		fontSize: 30
	},
	work: {
		flex: 1
	}
});

export default TutorHome;
