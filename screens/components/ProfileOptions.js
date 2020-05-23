import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { Button, ListButton } from './buttons';

export class ProfileOptionsModal extends Component {
    static props = {
        visible: PropTypes.any,
        aboutFunc: PropTypes.any,
        helpFunc: PropTypes.any,
        reportFunc: PropTypes.any,
        paymentFunc: PropTypes.any,
        sessionsFunc: PropTypes.any,
        switchFunc: PropTypes.any,
        editFunc: PropTypes.any,
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
                        onPress={this.props.editFunc}
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Your Sessions'
                        onPress={this.props.sessionsFunc}
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Payment'
                        onPress={this.props.paymentFunc}
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Help'
                        onPress={this.props.helpFunc}
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='Report'
                        onPress={this.props.reportFunc}
                    />
                    <ListButton
                        buttonStyle={styles.settingsButtons}
                        textStyle={styles.settingsButtonsText}
                        text='About'
                        onPress={this.props.aboutFunc}
                    />
                    <Button
                        buttonStyle={styles.switchButton}
                        text='Switch To Tutor Mode'
                        onPress={this.props.switchFunc}
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
        marginTop: 60,
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

export class AboutModal extends Component {
    static props = {
        visible: PropTypes.any,
        closeFunc: PropTypes.any,
        logoutFunc: PropTypes.any,
    };

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                swipeDirection={['down']}
                onSwipeComplete={this.props.closeFunc}
            >
                <View style={aboutStyles.modalContainer}>
                    <Icon
                        name='times'
                        type='font-awesome'
                        containerStyle={aboutStyles.xStyle}
                        onPress={this.props.closeFunc}
                    />
                    <Text style={aboutStyles.modalHeaderText}>About</Text>
                    <Text style={aboutStyles.aboutText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris sit amet auctor dolor. Proin ac elit tempus,
                        venenatis erat non, ultrices libero. Duis maximus ex
                        gravida ipsum imperdiet, ut varius ligula efficitur.
                        Nulla eu pellentesque eros. Etiam a velit et lectus
                        interdum dapibus ut in nunc. Morbi ac eros dapibus,
                        accumsan arcu ac, eleifend tellus. Vivamus blandit,
                        purus in consectetur sagittis, erat enim facilisis
                        augue, quis iaculis lacus mi ut nibh. Duis mauris arcu,
                        suscipit quis blandit at, euismod vel eros. {`\n\n`}
                        Orci varius natoque penatibus et magnis dis parturient
                        montes, nascetur ridiculus mus. Phasellus euismod quis
                        augue nec molestie. Vestibulum ante ipsum primis in
                        faucibus orci luctus et ultrices posuere cubilia curae;
                        Integer ipsum ex, tincidunt sit amet viverra eget,
                        bibendum a felis. In ultricies ac dui nec ullamcorper.
                        Suspendisse augue leo, fringilla tempus tempus sed,
                        luctus in tellus. Quisque feugiat ipsum at urna
                        sagittis, sit amet accumsan justo imperdiet. Vestibulum
                        rutrum gravida orci. Nam iaculis tristique ligula, et
                        viverra lacus tincidunt vitae. Maecenas ultrices
                        eleifend est sit amet efficitur. Curabitur viverra quam
                        quis sem sagittis vulputate. Cras vestibulum neque enim,
                        fermentum sagittis nulla finibus in. Aliquam eget tortor
                        tempus eros cursus feugiat.
                    </Text>
                </View>
            </Modal>
        );
    }
}

const aboutStyles = StyleSheet.create({
    modalContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    modalHeaderText: {
        fontSize: 30,
        marginTop: 10,
    },
    aboutText: {
        fontSize: 14,
        margin: 15,
    },
    xStyle: {
        position: 'absolute',
        left: 5,
        top: 5,
    },
});
