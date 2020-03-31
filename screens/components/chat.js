import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
				<Button title="Cancel Session" onPress={this.props.cancelFunction} />
				<Text style={styles.chatTitle}>Chat</Text>
				<Button title="Start Session" onPress={this.props.startFunction} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	chatTitle: { fontSize: 40 }
});
