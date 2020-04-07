import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Button, AirbnbRating } from 'react-native-elements';
import PropTypes from 'prop-types';
import Loading from './utils.js';

export class RatingModal extends Component {
	static props = {
		visible: PropTypes.bool.isRequired,
		dismissFunc: PropTypes.func.isRequired,
		ratingFunc: PropTypes.func.isRequired,
		text: PropTypes.any.isRequired
	};
	render() {
		const { visible, dismissFunc, ratingFunc, text } = this.props;
		return (
			<Modal animationType="slide" transparent={false} visible={visible}>
				<View style={styles.ratingModalContainer}>
					<Text style={styles.modalRatingTitleText}>{text}</Text>
					<AirbnbRating count={5} defaultRating={0} reviews={[]} onFinishRating={ratingFunc} />
					<TouchableOpacity style={styles.finishRatingModalButton} onPress={dismissFunc}>
						<Text style={styles.finishRatingModalButtonText}>Finish</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}

export class WaitingModal extends Component {
	static props = {
		visible: PropTypes.bool.isRequired,
		dismissFunc: PropTypes.func.isRequired,
		text: PropTypes.any.isRequired
	};
	render() {
		const { visible, dismissFunc, text } = this.props;
		return (
			<Modal animationType="slide" transparent={false} visible={visible}>
				<View style={styles.waitingModalContainer}>
					<Text style={styles.modalWaitingTitleText}>{text}</Text>
					<Loading />
					<TouchableOpacity style={styles.cancelWaitingModalButton} onPress={dismissFunc}>
						<Text style={styles.cancelWaitingModalButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	//RatingModal Styles
	ratingModalContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	finishRatingModalButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#6A7BD6',
		alignSelf: 'center',
		height: '7%',
		width: '90%',
		justifyContent: 'center',
		textAlign: 'center',
		marginBottom: 30
	},
	finishRatingModalButtonText: {
		fontSize: 40,
		color: '#6A7BD6',
		alignSelf: 'center'
	},
	modalRatingTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: '#6A7BD6'
	},
	//WaitingModal Styles
	waitingModalContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	cancelWaitingModalButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#6A7BD6',
		alignSelf: 'center',
		height: '7%',
		width: '90%',
		justifyContent: 'center',
		textAlign: 'center',
		marginBottom: 30
	},
	cancelWaitingModalButtonText: {
		fontSize: 40,
		color: '#6A7BD6',
		alignSelf: 'center'
	},
	modalWaitingTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: '#6A7BD6'
	}
});
