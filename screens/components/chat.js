/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { Button } from './buttons';
import Loading from './utils';

export class ChatHeader extends Component {
    static props = {
        startFunction: PropTypes.Func,
        cancelFunction: PropTypes.Func,
    };

    render() {
        return (
            <View style={styles.top}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={this.props.cancelFunction}
                >
                    <Text style={styles.cancelButtonText}>Cancel Session</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={this.props.startFunction}
                >
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
        text: PropTypes.any.isRequired,
    };

    render() {
        const { visible, dismissFunc, text } = this.props;
        return (
            <Modal animationType='slide' transparent={false} visible={visible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitleText}>{text}</Text>
                    <Loading />
                    <Button
                        type='secondary'
                        textStyle={styles.cancelModalButtonText}
                        text='Cancel'
                        buttonStyle={styles.cancelModalButton}
                        onPress={dismissFunc}
                    />
                </View>
            </Modal>
        );
    }
}

export class OptionsModal extends Component {
    static props = {
        visible: PropTypes.bool.isRequired,
        cancelFunc: PropTypes.func.isRequired,
        startFunc: PropTypes.func.isRequired,
        dismissFunc: PropTypes.func.isRequired,
    };

    render() {
        const { visible, cancelFunc, startFunc, dismissFunc } = this.props;
        return (
            <Modal animationType='fade' transparent={true} visible={visible}>
                <View style={styles.centeredView}>
                    <View style={styles.optionsModalContainer}>
                        <Icon
                            name='times'
                            type='font-awesome'
                            color='grey'
                            containerStyle={{
                                alignSelf: 'flex-start',
                                bottom: '10%',
                                right: '5%',
                            }}
                            onPress={dismissFunc}
                        />
                        <Button
                            type='secondary'
                            text='Cancel Session'
                            buttonStyle={styles.optionsButton}
                            onPress={cancelFunc}
                        />
                        <Button
                            type='primary'
                            text='Start Session'
                            buttonStyle={styles.optionsButton}
                            onPress={startFunc}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    // ChatHeader styles
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chatTitle: { fontSize: 40, color: primaryColor, fontWeight: 'bold' },
    cancelButton: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: 10,
        width: '30%',
    },
    cancelButtonText: {
        textAlign: 'center',
        fontSize: 20,
        color: primaryColor,
    },
    // StartWaiting Styles
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cancelModalButton: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,
        alignSelf: 'center',
        height: '7%',
        width: '90%',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 30,
    },
    cancelModalButtonText: {
        fontSize: 40,
        color: primaryColor,
        alignSelf: 'center',
    },
    modalTitleText: {
        paddingTop: '50%',
        textAlign: 'center',
        fontSize: 35,
        color: primaryColor,
    },
    // OPtions modal
    optionsModalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    optionsButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 10,
        margin: 10,
    },
});
