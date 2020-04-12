import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button } from '../components/buttons';
import firebase from '../../firebase';
import Loading from '../components/utils.js';
import '../components/global';

class StudentActiveRequests extends Component {
	constructor() {
		super();
		this.studentRef = firebase.firestore().collection('students');
		this.requestRef = firebase.firestore().collection('requests');
		this.unsubscribe = null;
		this.state = {
			uid: '',
			isLoading: true,
			requests: []
		};
	}

	static navigationOptions = {
		headerShown: false
	};

	renderItem = ({ item }) => {
		const pColor = item.status == 'pending' ? secondaryColor : primaryColor;
		const sColor = item.status == 'pending' ? primaryColor : secondaryColor;
		const screenNav = item.status == 'pending' ? 'RequestWaiting' : 'StudentChat';
		return (
			<TouchableOpacity
				style={[ styles.row, { backgroundColor: pColor, borderWidth: 1, borderColor: sColor } ]}
				onPress={() =>
					this.props.navigation.navigate(screenNav, {
						uid: this.state.uid,
						tutorUid: item.tutorUid,
						requestUid: item.id
					})}
			>
				<View style={styles.requestInfo}>
					<Text style={{ fontSize: 20, fontWeight: 'bold', color: sColor }} allowFontScaling={true}>
						{item.tutorInfo.name}
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
				{/* <View style={styles.requestButtons}>
					<Button
						type="primary"
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text="Update"
						onPress={() => this.accept({ item })}
					/>
					<Button
						type="secondary"
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text="Cancel"
						onPress={() => this.decline({ item })}
					/>
				</View> */}
			</TouchableOpacity>
		);
	};

	componentDidMount() {
		// this.state.uid = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid', '');
		this.state.uid = userUid;
		this.studentRef = this.studentRef.doc(this.state.uid);
		this.requestRef = this.requestRef
			.where('studentUid', '==', this.state.uid)
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
			var tutorInfo = {};

			const { tutorUid, description, classObj, estTime, location, status } = doc.data();
			firebase.firestore().collection('tutors').doc(tutorUid).get().then((tutorDoc) => {
				if (tutorDoc.exists) {
					tutorInfo = tutorDoc.data();
				} else {
				}
				if (status == 'accepted') {
				}
				requests.push({
					status,
					tutorUid,
					classObj,
					estTime,
					location,
					description,
					tutorInfo,
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

	cancel = ({ item }) => {
		firebase
			.firestore()
			.collection('requests')
			.doc(item.id)
			.update({ status: 'cancelled' })
			.then((docRef) => {})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	};

	cancelAll = () => {
		this.setState({ requests: [] });
		for (var i = 0; i < this.state.requests.length; i++) {
			firebase
				.firestore()
				.collection('requests')
				.doc(this.state.requests[i].id)
				.update({ status: 'cancelled' })
				.then((docRef) => {
					this.setState({ requests: [] });
				})
				.catch((error) => {
					console.error('Error adding document: ', error);
				});
		}
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
					<Button
						onPress={this.cancelAll}
						type={'secondary'}
						buttonStyle={styles.cancelAllButton}
						text={'Cancel All'}
					/>
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
		flex: 2,
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: secondaryColor,
		width: '100%'
	},
	cancelAllButton: {
		width: '40%',
		height: '40%',
		alignSelf: 'center'
	},
	headerText: {
		fontSize: 40,
		color: primaryColor
	},
	requestList: {
		paddingTop: 10,
		flex: 15,
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
		margin: 10
	},
	button: {
		alignSelf: 'center',
		width: '95%'
	},
	buttonText: {
		alignSelf: 'center',
		padding: 3
	},
	row: {
		backgroundColor: primaryColor,
		flexDirection: 'row',
		marginBottom: '2%',
		marginHorizontal: 16,
		borderRadius: 20
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
	}
});

export default StudentActiveRequests;
