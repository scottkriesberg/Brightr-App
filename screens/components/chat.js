import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import Loading from './utils.js';

export class ChatHeader extends Component {
	static props = {
		startFunction: PropTypes.Func,
		cancelFunction: PropTypes.Func
	};
	render() {
		return (
			<View style={styles.top}>
				<TouchableOpacity style={styles.cancelButton} onPress={this.props.cancelFunction}>
					<Text style={styles.cancelButtonText}>Cancel Session</Text>
				</TouchableOpacity>
				<Text style={styles.chatTitle}>Chat</Text>
				<TouchableOpacity style={styles.cancelButton} onPress={this.props.startFunction}>
					<Text style={styles.cancelButtonText}>Start Session</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export class StartWaiting extends Component {
	static props = {
		visible: PropTypes.bool.isRequired,
		dismissFunc: PropTypes.func.isRequired,
		text: PropTypes.any.isRequired
	};
	render() {
		const { visible, dismissFunc, text } = this.props;
		return (
			<Modal animationType="slide" transparent={false} visible={visible}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitleText}>{text}</Text>
					<Loading />
					<TouchableOpacity style={styles.cancelModalButton} onPress={dismissFunc}>
						<Text style={styles.cancelModalButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	//ChatHeader styles
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	chatTitle: { fontSize: 40, color: '#6A7BD6', fontWeight: 'bold' },
	cancelButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#6A7BD6',
		justifyContent: 'center',
		alignContent: 'center',
		paddingHorizontal: 10,
		width: '30%'
	},
	cancelButtonText: {
		textAlign: 'center',
		fontSize: 20,
		color: '#6A7BD6'
	},
	//StartWaiting Styles
	modalContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	cancelModalButton: {
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
	cancelModalButtonText: {
		fontSize: 40,
		color: '#6A7BD6',
		alignSelf: 'center'
	},
	modalTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: '#6A7BD6'
	}
});
