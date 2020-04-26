import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button } from '../components/buttons';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import '../components/global';

class TutorIncomingRequests extends Component {
	constructor() {
		super();
		this.tutorRef = firebase.firestore().collection('tutors');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			requests: []
		};
	}

	static navigationOptions = {
		headerShown: false,
		title: ''
	};

	renderItem = ({ item }) => {
		const pColor = item.status == 'pending' ? secondaryColor : primaryColor;
		const sColor = item.status == 'pending' ? primaryColor : secondaryColor;
		const screenNav = item.status == 'pending' ? 'TutorRequestPreview' : 'TutorChat';
		return (
			<TouchableOpacity
				style={[ styles.row, { backgroundColor: pColor, borderWidth: 1, borderColor: sColor } ]}
				onPress={() =>
					this.props.navigation.navigate(screenNav, {
						tutorUid: this.state.uid,
						studentUid: item.studentUid,
						requestUid: item.id,
						studentImage: 'https://bootdey.com/img/Content/avatar/avatar6.png',
						studentName: item.studentInfo.name
					})}
			>
				<View style={styles.requestInfo}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', color: sColor }} allowFontScaling={true}>
						{item.studentInfo.name}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: sColor }}>
						Class: {item.classObj.department} {item.classObj.code}
					</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: sColor }}>Location: {item.location}</Text>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: sColor }} numberOfLines={1}>
						Estimated Time: {item.estTime} min
					</Text>
					<Text
						style={{ fontSize: 15, fontWeight: 'bold', color: sColor }}
						minimumFontScale={0.4}
						adjustsFontSizeToFit={true}
						numberOfLines={2}
						allowFontScaling={true}
					>
						Description: {item.description ? item.description : 'N/A'}
					</Text>
				</View>
				{item.status == 'pending' ? (
					<View style={styles.requestButtons}>
						<Button
							type="primary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Accept"
							onPress={() => this.accept({ item })}
						/>
						<Button
							type="secondary"
							buttonStyle={styles.button}
							textStyle={styles.buttonText}
							text="Decline"
							onPress={() => this.decline({ item })}
						/>
					</View>
				) : null}
			</TouchableOpacity>
		);
	};

	componentDidMount() {
		this.state.uid = userUid;
		this.tutorRef = this.tutorRef.doc(this.state.uid);
		this.requestRef = this.requestRef
			.where('tutorUid', '==', this.state.uid)
			.where('status', 'in', [ 'pending', 'accepted' ]);
		this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const requests = [];
		querySnapshot.forEach((doc) => {
			this.setState({
				isLoading: true
			});
			var studentInfo = {};
			const { studentUid, description, classObj, estTime, location, status } = doc.data();
			firebase.firestore().collection('students').doc(studentUid).get().then((studentDoc) => {
				if (studentDoc.exists) {
					studentInfo = studentDoc.data();
				} else {
				}
				requests.push({
					studentUid,
					status,
					classObj,
					estTime,
					location,
					description,
					studentInfo,
					id: doc.id
				});
				this.setState({
					requests,
					isLoading: false,
					numActive: requests.length
				});
			});
		});
		this.setState({
			requests,
			isLoading: false,
			numActive: requests.length
		});
	};

	decline = ({ item }) => {
		firebase
			.firestore()
			.collection('requests')
			.doc(item.id)
			.update({ status: 'declined' })
			.then((docRef) => {})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	};

	accept = ({ item }) => {
		firebase
			.firestore()
			.collection('requests')
			.doc(item.id)
			.update({
				status: 'accepted'
			})
			.then(() => {
				this.props.navigation.navigate('TutorChat', {
					tutorUid: this.state.uid,
					studentUid: item.studentUid,
					requestUid: item.id,
					studentImage: 'https://bootdey.com/img/Content/avatar/avatar6.png',
					studentName: item.studentInfo.name
				});
			});
	};

	stopLive = () => {
		this.tutorRef.update({ isLive: false, hourlyRate: 0, locations: [] }).then(() => {
			for (var i = 0; i < this.state.requests.length; i++) {
				firebase
					.firestore()
					.collection('requests')
					.doc(this.state.requests[i].id)
					.update({ status: 'declined' })
					.then((docRef) => {})
					.catch((error) => {
						console.error('Error adding document: ', error);
					});
			}
			this.props.navigation.navigate('TutorWorkSetUp', { uid: this.state.uid });
		});
	};

	render() {
		if (this.state.isLoading) {
			return <Loading />;
		}
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text
						adjustsFontSizeToFit
						style={styles.headerText}
						allowFontScaling={true}
						adjustsFontSizeToFit={true}
						numberOfLines={1}
					>
						Active Requests
					</Text>
				</View>
				<View style={styles.legendContianer}>
					<View
						style={[
							styles.legends,
							{ backgroundColor: 'white', borderColor: primaryColor, borderWidth: 1 }
						]}
					>
						<Text
							adjustsFontSizeToFit={true}
							numberOfLines={1}
							style={[ styles.legendText, { color: primaryColor } ]}
						>
							Open
						</Text>
					</View>
					<View style={[ styles.legends, { backgroundColor: primaryColor } ]}>
						<Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.legendText}>
							Accepted
						</Text>
					</View>
					<View
						style={[
							styles.legends,
							{ backgroundColor: accentColor, borderColor: accentColor, borderWidth: 1 }
						]}
					>
						<Text
							adjustsFontSizeToFit={true}
							numberOfLines={1}
							style={[ styles.legendText, { color: primaryColor } ]}
						>
							Resopnse Needed
						</Text>
					</View>
				</View>
				<View style={styles.requestList}>
					{this.state.requests.length > 0 ? (
						<FlatList
							data={this.state.requests}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					) : (
						<Text style={styles.noRequstsText}>No Active Requests</Text>
					)}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: secondaryColor,
		width: '100%'
	},
	headerText: {
		fontSize: 40,
		color: primaryColor
	},
	requestList: {
		paddingTop: 10,
		flex: 10,
		backgroundColor: secondaryColor
	},
	requestInfo: {
		flex: 2,
		justifyContent: 'space-around',
		margin: 10
	},
	requestButtons: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'stretch',
		margin: 15
	},
	button: {
		alignSelf: 'center',
		width: '95%',
		padding: 5
	},
	buttonText: {
		alignSelf: 'center'
	},
	row: {
		backgroundColor: primaryColor,
		flexDirection: 'row',
		marginBottom: '2%',
		marginHorizontal: 16,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.5
	},
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	live: {
		flex: 2,
		alignItems: 'center',
		width: '100%'
	},
	noRequstsText: {
		fontSize: 20,
		alignSelf: 'center',
		paddingTop: '50%'
	},
	legendContianer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	legends: {
		width: '30%',
		textAlign: 'center',
		borderRadius: 5,
		alignItems: 'center',
		height: '50%',
		justifyContent: 'center'
	},
	legendText: {
		color: 'white'
	}
});

export default TutorIncomingRequests;
