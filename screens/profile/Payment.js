import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Payment extends Component {
    render() {
        return (
            <View style={aboutStyles.aboutContainer}>
                <Text style={aboutStyles.aboutText}>Payment</Text>
            </View>
        );
    }
}

const aboutStyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 30,
        marginTop: 10,
    },
    aboutText: {
        fontSize: 14,
        margin: 15,
    },
    xStyle: {
        position: 'absolute',
        left: 15,
        top: 15,
    },
});
