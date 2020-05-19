/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils';

export default class RequestPreview extends Component {
    static navigationOptions = {
        title: 'Request Preview',
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
        this.unsubscribe = null;
        this.requestRef = firestore.collection('requests');
        this.state = {
            studentUid: '',
            tutorUid: '',
            requestUid: '',
            student: {},
            request: {},
            isLoading: true,
        };
    }

    componentDidMount() {
        this.state.studentUid = this.props.navigation.getParam(
            'studentUid',
            ''
        );
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.requestUid = this.props.navigation.getParam(
            'requestUid',
            ''
        );
        this.requestRef = this.requestRef.doc(this.state.requestUid);

        this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    decline = () => {
        this.requestRef.update({ status: 'declined' }).catch((error) => {
            console.error('Error adding document: ', error);
        });
    };

    accept = () => {
        this.requestRef
            .update({
                status: 'accepted',
            })
            .then(() => {
                this.props.navigation.navigate('TutorChat', {
                    tutorUid: this.state.tutorUid,
                    studentUid: this.state.studentUid,
                    requestUid: this.state.requestUid,
                    studentImage:
                        'https://bootdey.com/img/Content/avatar/avatar6.png',
                    studentName: this.state.student.name,
                });
            });
    };

    onCollectionUpdate = (doc) => {
        if (doc.exists) {
            this.state.request = doc.data();
            if (doc.data().status === 'cancelled') {
                Alert.alert(
                    'Request Cancelled',
                    'This student has cancelled their request',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                this.props.navigation.navigate(
                                    'TutorIncomingRequests',
                                    { uid: this.state.tutorUid }
                                );
                            },
                        },
                    ],
                    {
                        cancelable: false,
                    }
                );
            } else if (doc.data().status === 'declined') {
                this.toTutorIncomingRequests();
                return;
            }
            const ref = firestore
                .collection('students')
                .doc(this.state.studentUid);
            ref.get().then((studentDoc) => {
                if (studentDoc.exists) {
                    this.setState({
                        student: doc.data(),
                        isLoading: false,
                    });
                } else {
                    console.log('No such document!');
                }
            });
        } else {
            this.props.navigation.navigate('TutorTabNavigator', {
                screen: 'TutorIncomingRequests',
                params: { uid: this.state.tutorUid },
            });
        }
    };

    toTutorIncomingRequests = () => {
        this.props.navigation.navigate('TutorTabNavigator', {
            screen: 'TutorIncomingRequests',
            params: { uid: this.state.tutorUid },
        });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <ProfileHeadingInfo
                    rating={this.state.student.rating}
                    year={this.state.student.year}
                    major={this.state.student.major.code}
                    name={this.state.student.name}
                    containerStyle={styles.basicInfoContainer}
                    avatarStyle={styles.avatar}
                    image={`demoImages/${this.state.studentUid}.jpg`}
                    bio={this.state.student.bio}
                />
                <View style={styles.requestInfoContainer}>
                    <Text style={styles.requestInfoHeader}>
                        Request Information
                    </Text>
                    <Text style={styles.requestInfoText}>
                        Class: {this.state.request.classObj.department}{' '}
                        {this.state.request.classObj.code}
                    </Text>
                    <Text style={styles.requestInfoText}>
                        Location: {this.state.request.location}
                    </Text>
                    <Text style={styles.requestInfoText}>
                        Estmated Session Time: {this.state.request.estTime}{' '}
                        minutes
                    </Text>
                    <Text style={styles.requestInfoText}>
                        Estmated Session cost: $
                        {Math.round(
                            (this.state.request.estTime / 60) *
                                this.state.request.hourlyRate *
                                100
                        ) / 100}
                    </Text>
                    <Text style={styles.requestInfoText}>
                        Session Description:{' '}
                        {this.state.request.description
                            ? this.state.request.description
                            : 'N/A'}
                    </Text>
                </View>

                <View style={styles.live}>
                    <TouchableOpacity
                        style={styles.declineButton}
                        onPress={this.decline}
                    >
                        <Text
                            adjustsFontSizeToFit
                            style={styles.declineButtonText}
                        >
                            Decline
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={this.accept}
                    >
                        <Text
                            adjustsFontSizeToFit
                            style={styles.acceptButtonText}
                        >
                            Accept
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: primaryColor,
        flex: 0.75,
        justifyContent: 'flex-start',
    },
    backButton: {
        height: '100%',
        width: '25%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    backButtonText: {
        fontSize: 30,
        color: secondaryColor,
    },
    basicInfoContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#F8F8FF',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        flex: 3,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: primaryColor,
        alignSelf: 'center',
        aspectRatio: 1,
    },
    requestInfoContainer: {
        flex: 3,
        backgroundColor: secondaryColor,
        justifyContent: 'space-around',
    },
    requestInfoHeader: {
        fontSize: 25,
        alignSelf: 'center',
    },
    requestInfoText: {
        fontSize: 20,
        marginLeft: '3%',
    },
    live: {
        marginTop: 5,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    declineButton: {
        backgroundColor: secondaryColor,
        height: '75%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderColor: primaryColor,
        borderWidth: 1,
    },
    declineButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: primaryColor,
    },
    acceptButton: {
        backgroundColor: primaryColor,
        height: '75%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    acceptButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: secondaryColor,
    },
});
