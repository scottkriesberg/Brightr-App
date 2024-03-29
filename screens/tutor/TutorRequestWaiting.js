/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Alert, StyleSheet, View, Image } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import { Button } from '../components/buttons';

const FaceLogo = require('../../assets/FaceLogo.png');

export default class TutorRequestWaiting extends Component {
    static navigationOptions = {
        title: 'Request Pending',
        headerStyle: {
            backgroundColor: secondaryColor,
        },
        headerTintColor: primaryColor,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
        },
    };

    constructor() {
        super();
        this.tutorRef = firestore.collection('tutors');
        this.studentRef = firestore.collection('students');
        this.requestRef = firestore.collection('requests');
        this.unsubscribe = null;
        this.state = {
            tutorUid: '',
            studentUid: '',
            requestUid: '',
            studentName: '',
            studentImage: '',
        };
    }

    componentDidMount() {
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.studentUid = this.props.navigation.getParam(
            'studentUid',
            '',
        );
        this.state.requestUid = this.props.navigation.getParam(
            'requestUid',
            '',
        );
        this.state.studentName = this.props.navigation.getParam(
            'studentName',
            '',
        );
        this.state.studentImage = this.props.navigation.getParam(
            'studentImage',
            '',
        );
        this.setState({});
        this.requestRef = this.requestRef.doc(this.state.requestUid);
        this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (doc) => {
        if (doc.exists) {
            if (doc.data().status === 'accepted') {
                this.props.navigation.navigate('TutorChat', {
                    tutorUid: this.state.tutorUid,
                    studentUid: this.state.studentUid,
                    requestUid: this.state.requestUid,
                    studentImage: this.state.studentImage,
                    studentName: this.state.studentName,
                });
            } else if (doc.data().status === 'declined') {
                Alert.alert(
                    'Request Cancelled',
                    'The student has cancelled the request',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                this.props.navigation.navigate(
                                    'TutorIncomingRequests',
                                    { uid: this.state.tutorUid },
                                ),
                        },
                    ],
                    {
                        cancelable: false,
                    },
                );
            }
        } else {
            this.props.navigation.navigate('TutorIncomingRequests', {
                uid: this.state.uid,
            });
        }
    };

    cancelRequest = () => {
        this.requestRef
            .update({ status: 'declined' })
            .then(() => {
                this.props.navigation.navigate('TutorIncomingRequests', {
                    uid: this.state.uid,
                });
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
                this.setState({
                    isLoading: false,
                });
            });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <View style={styles.iconBackground}>
                    <Image source={FaceLogo} style={styles.face} />
                    <Icon
                        name='check'
                        type='font-awesome'
                        color='white'
                        size={50}
                        containerStyle={styles.checkMark}
                    />
                </View>
                <Loading />
                <View style={styles.holdTextContainer}>
                    <Text style={styles.holdText}>
                        You will be notified once {this.state.studentName}{' '}
                        responds to your request.
                    </Text>
                </View>
                <Button text='Cancel Request' onPress={this.cancelRequest} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'stretch',
        paddingBottom: '5%',
    },
    iconBackground: {
        backgroundColor: primaryColor,
        borderRadius: 150,
        borderColor: accentColor,
        borderWidth: 5,
        height: '25%',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        top: '20%',
    },
    face: {
        top: 25,
    },
    checkMark: {
        position: 'relative',
        left: 55,
        backgroundColor: accentColor,
        borderRadius: 25,
    },
    live: {
        marginTop: 5,
        flex: 1,
        alignItems: 'center',
    },
    liveButton: {
        backgroundColor: primaryColor,
        height: '85%',
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    liveButtonText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: secondaryColor,
    },
    holdTextContainer: {
        flex: 8,
        justifyContent: 'center',
        marginBottom: '15%',
    },
    holdText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
