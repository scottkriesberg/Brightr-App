import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import PropTypes from 'prop-types';
import Loading from './utils.js';
import { Button } from './buttons';

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
					<Button
						type={'secondary'}
						textStyle={styles.finishRatingModalButtonText}
						text={'Finish'}
						buttonStyle={styles.finishRatingModalButton}
						onPress={dismissFunc}
					/>
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
					<Button
						type={'secondary'}
						textStyle={styles.cancelWaitingModalButtonText}
						text={'Cancel'}
						buttonStyle={styles.cancelWaitingModalButton}
						onPress={dismissFunc}
					/>
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
		borderColor: primaryColor,
		alignSelf: 'center',
		height: '7%',
		width: '90%',
		justifyContent: 'center',
		textAlign: 'center',
		marginBottom: 30
	},
	finishRatingModalButtonText: {
		fontSize: 40,
		color: primaryColor,
		alignSelf: 'center'
	},
	modalRatingTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: primaryColor
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
		borderColor: primaryColor,
		alignSelf: 'center',
		height: '7%',
		width: '90%',
		justifyContent: 'center',
		textAlign: 'center',
		marginBottom: 30
	},
	cancelWaitingModalButtonText: {
		fontSize: 40,
		color: primaryColor,
		alignSelf: 'center'
	},
	modalWaitingTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: primaryColor
	}
});
