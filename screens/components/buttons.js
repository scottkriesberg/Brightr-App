/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import './global';

export class Button extends Component {
    static props = {
        type: PropTypes.any,
        buttonStyle: PropTypes.any,
        textStyle: PropTypes.any,
        onPress: PropTypes.Func,
        text: PropTypes.any,
        disabled: PropTypes.any,
    };

    render() {
        const {
            disabled,
            type,
            buttonStyle,
            textStyle,
            onPress,
            text,
        } = this.props;
        let styles = PrimaryStyle;
        if (type === 'primary') {
            styles = PrimaryStyle;
        } else if (type === 'secondary') {
            styles = SecondaryStyle;
        }

        if (disabled) {
            styles = DisabledStyle;
        }

        return (
            <TouchableOpacity
                style={[styles.button, buttonStyle]}
                disabled={disabled}
                onPress={onPress}
            >
                <Text
                    style={[styles.text, textStyle]}
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
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80%',
        borderWidth: 1,
        borderColor: secondaryColor,
    },
    text: {
        color: secondaryColor,
        textAlign: 'center',
        fontSize: 40,
    },
});

const SecondaryStyle = StyleSheet.create({
    button: {
        backgroundColor: secondaryColor,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80%',
        borderWidth: 1,
        borderColor: primaryColor,
    },
    text: {
        color: primaryColor,
        textAlign: 'center',
        fontSize: 40,
    },
});

const DisabledStyle = StyleSheet.create({
    button: {
        backgroundColor: '#A0A0A0',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80%',
        borderWidth: 1,
        borderColor: 'grey',
    },
    text: {
        color: 'lightgrey',
        textAlign: 'center',
        fontSize: 40,
        fontFamily: primaryFont,
    },
});
