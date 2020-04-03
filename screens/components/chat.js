import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';

export class ChatHeader extends Component {
	static props = {
		startFunction: PropTypes.any,
		cancelFunction: PropTypes.any
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

const styles = StyleSheet.create({
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
		paddingHorizontal: 10
	},
	cancelButtonText: {
		fontSize: 20,
		color: '#6A7BD6'
	}
});
