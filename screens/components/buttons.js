/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
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
        paddingHorizontal: 5,
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
        paddingHorizontal: 5,
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
        paddingHorizontal: 5,
    },
    text: {
        color: 'lightgrey',
        textAlign: 'center',
        fontSize: 40,
        fontFamily: primaryFont,
    },
});

export class ListButton extends Component {
    static props = {
        type: PropTypes.any,
        buttonStyle: PropTypes.any,
        textStyle: PropTypes.any,
        onPress: PropTypes.Func,
        text: PropTypes.any,
        disabled: PropTypes.any,
    };

    render() {
        const { disabled, onPress, text, buttonStyle, textStyle } = this.props;

        return (
            <TouchableOpacity
                style={[ListButtonStyle.button, buttonStyle]}
                disabled={disabled}
                onPress={onPress}
            >
                <Text
                    style={[ListButtonStyle.text, textStyle]}
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}
                >
                    {text}
                </Text>
                <Icon
                    name='keyboard-arrow-right'
                    size={40}
                    color={primaryColor}
                />
            </TouchableOpacity>
        );
    }
}
const ListButtonStyle = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
    },
    text: {
        color: primaryColor,
        textAlign: 'left',
        fontSize: 20,
        width: '70%',
    },
});
