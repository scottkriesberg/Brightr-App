import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { Button, ListButton } from './buttons';

export class ProfileOptionsModal extends Component {
    static props = {
        visible: PropTypes.any,
        closeFunc: PropTypes.any,
        logoutFunc: PropTypes.any,
    };

    render() {
        return (
            <Modal
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                isVisible={this.props.visible}
                swipeDirection={['left']}
                onSwipeComplete={this.props.closeFunc}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeaderText}>Settings</Text>
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Edit Account'
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Your Sessions'
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Payment'
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Help'
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Report'
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='About'
                    />
                    <Button
                        buttonStyle={styles.switchButton}
                        text='Switch To Tutor Mode'
                    />
                    <Button
                        type='secondary'
                        buttonStyle={styles.logoutButton}
                        onPress={this.props.logoutFunc}
                        text='Logout'
                    />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        height: '105%',
        width: '75%',
        right: '5%',
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    modalHeaderText: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    settingsButtons: {
        height: '8%',
        paddingLeft: 10,
        backgroundColor: 'white',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    settingsButtonsText: {
        fontSize: 20,
        textAlign: 'left',
        color: primaryColor,
        borderBottomColor: primaryColor,
        borderBottomWidth: 10,
    },
    logoutButton: {
        marginTop: 30,
    },
    switchButton: {
        marginTop: 30,
        height: '10%',
        justifyContent: 'center',
    },
});
