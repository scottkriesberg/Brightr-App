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

export class RecapModal extends Component {
	static props = {
		visible: PropTypes.bool.isRequired,
		dismissFunc: PropTypes.func.isRequired,
		headingText: PropTypes.any.isRequired,
		time: PropTypes.any,
		cost: PropTypes.any.isRequired,
		duration: PropTypes.any.isRequired,
		ratingFunc: PropTypes.func.isRequired,
		ratingText: PropTypes.any.isRequired
	};
	render() {
		const { visible, dismissFunc, time, cost, duration, headingText, ratingFunc, ratingText } = this.props;
		return (
			<Modal animationType="slide" transparent={false} visible={visible}>
				<View style={styles.recapContainer}>
					<View style={styles.headingContainer}>
						<Text style={styles.recapTitleText}>{headingText}</Text>
					</View>
					<View style={styles.recapTextContainer}>
						<Text style={styles.recapTextHeader}>{'Time'}</Text>
						<Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.recapText}>
							{time}
						</Text>
						<Text style={styles.recapTextHeader}>{'Duration'}</Text>
						<Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.recapText}>
							{duration + ' minutes'}
						</Text>
						<Text style={styles.recapTextHeader}>{'Cost'}</Text>
						<Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.recapText}>
							{'$' + cost}
						</Text>
						<Text style={styles.modalRatingTitleText}>{ratingText}</Text>
						<AirbnbRating count={5} defaultRating={0} reviews={[]} onFinishRating={ratingFunc} />
					</View>
					<View style={styles.doneButtonConainter}>
						<Button type={'primary'} text={'Done'} buttonStyle={styles.doneButton} onPress={dismissFunc} />
					</View>
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
		textAlign: 'center',
		fontSize: 25,
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
	},
	//Recap Modal
	recapContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	headingContainer: {
		flex: 2,
		justifyContent: 'center'
	},
	recapTextContainer: {
		flex: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	doneButtonConainter: {
		flex: 1
	},
	recapTitleText: {
		textAlign: 'center',
		fontSize: 60,
		color: primaryColor
	},
	recapTextHeader: {
		textAlign: 'left',
		fontSize: 45,
		color: primaryColor,
		width: '90%'
	},
	recapText: {
		textAlign: 'left',
		fontSize: 45,
		color: primaryColor,
		borderColor: primaryColor,
		borderWidth: 1,
		borderRadius: 5,
		width: '90%',
		padding: 10,
		marginBottom: '4%'
	},
	doneButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: primaryColor,
		alignSelf: 'center',
		height: '80%',
		width: '90%',
		justifyContent: 'center',
		textAlign: 'center',
		marginBottom: 30
	}
});
