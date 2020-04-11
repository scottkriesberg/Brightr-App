import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import './global';

export class Button extends Component {
	static props = {
		type: PropTypes.any,
		buttonStyle: PropTypes.any,
		textStyle: PropTypes.any,
		onPress: PropTypes.Func,
		text: PropTypes.any
	};
	render() {
		const { type, buttonStyle, textStyle, onPress, text } = this.props;
		var styles = PrimaryStyle;
		if (type == 'primary') {
			styles = PrimaryStyle;
		} else if (type == 'secondary') {
			styles = SecondaryStyle;
		}

		return (
			<TouchableOpacity style={[ styles.button, buttonStyle ]} onPress={onPress}>
				<Text
					style={[ styles.text, textStyle ]}
					allowFontScaling={true}
					adjustsFontSizeToFit={true}
					numberOfLines={1}
				>
					{text}
				</Text>
			</TouchableOpacity>
		);
	}
}
const PrimaryStyle = StyleSheet.create({
	button: {
		backgroundColor: primaryColor,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '80%',
		borderWidth: 1,
		borderColor: secondaryColor
	},
	text: {
		color: secondaryColor,
		textAlign: 'center',
		fontSize: 40
	}
});

const SecondaryStyle = StyleSheet.create({
	button: {
		backgroundColor: secondaryColor,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '80%',
		borderWidth: 1,
		borderColor: primaryColor
	},
	text: {
		color: primaryColor,
		textAlign: 'center',
		fontSize: 40
	}
});
