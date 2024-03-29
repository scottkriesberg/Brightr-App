/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Alert, StyleSheet, Text, Image } from 'react-native';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import {
    RatingModal,
    WaitingModal,
    RecapModal,
} from '../components/inProgress';
import { Button } from '../components/buttons';

const FaceLogo = require('../../assets/FaceLogo.png');

class TutorInProgress extends Component {
    constructor() {
        super();
        this.ref = firestore.collection('tutors');
        this.sessionRef = firestore.collection('sessions');
        this.unsubscribe = null;

        this.state = {
            uid: '',
            sessionUid: '',
            session: {},
            isLoading: true,
            min: 0,
            sec: 0,
            hour: 0,
            ratingModalVisible: false,
            waitingModalVisible: false,
            recapModalVisible: false,
            rating: 0,
            duration: '',
            time: '',
            cost: '',
        };
        this.interval = null;
    }

    componentDidMount() {
        this.state.uid = this.props.navigation.getParam('uid', '');
        this.state.sessionUid = this.props.navigation.getParam(
            'sessionUid',
            '',
        );
        this.ref = this.ref.doc(this.state.uid);
        this.sessionRef = this.sessionRef.doc(this.state.sessionUid);
        this.unsubscribe = this.sessionRef.onSnapshot(this.onCollectionUpdate);
        this.interval = setInterval(() => {
            if (this.state.sec !== 59) {
                this.setState((prevState) => ({
                    sec: prevState.sec + 1,
                }));
            } else if (this.state.min !== 59) {
                this.setState((prevState) => ({
                    sec: 0,
                    min: prevState.min + 1,
                }));
            } else {
                this.setState((prevState) => ({
                    sec: 0,
                    min: 0,
                    hour: prevState.hour + 1,
                }));
            }
        }, 1000);
    }

    componentWillUnmount() {
        this.setState({
            waitingModalVisible: false,
            ratingModalVisible: false,
            recapModalVisible: false,
        });
        clearInterval(this.interval);
        this.unsubscribe();
    }

    onCollectionUpdate = (doc) => {
        if (doc.exists) {
            this.state.session = doc.data();
            if (!doc.data().studentDone && doc.data().tutorDone) {
                this.setState({ waitingModalVisible: true });
            }
            if (
                doc.data().tutorDone &&
                doc.data().studentDone &&
                doc.data().studentRating === 0
            ) {
                this.setState({
                    waitingModalVisible: false,
                    ratingModalVisible: false,
                    recapModalVisible: true,
                });
                const sessionTime = Date.now() - this.state.session.startTime;
                const duration = Math.round(sessionTime / 60000);
                const cost = this.calcSessionCost(
                    sessionTime,
                    this.state.session.hourlyRate,
                ).toFixed(2);
                const time = `${new Date(
                    this.state.session.startTime,
                ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })} - ${new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`;
                this.setState({ duration, cost, time });
            }
        }
        this.setState({
            isLoading: false,
        });
    };

    padToTwo = (number) => (number <= 9 ? `0${number}` : number);

    addRating(collection, uid, rating) {
        console.log(rating);
        // In a transaction, add the new rating and update the aggregate totals
        const ref = firestore.collection(collection).doc(uid);
        return firestore.runTransaction((transaction) => {
            return transaction.get(ref).then((res) => {
                if (!res.exists) {
                    throw 'Document does not exist!';
                }

                // Compute new number of ratings
                const newNumRatings = res.data().numRatings + 1;

                // Compute new average rating
                const oldRatingTotal =
                    res.data().rating * res.data().numRatings;
                const newAvgRating = (oldRatingTotal + rating) / newNumRatings;

                // Commit to Firestore
                transaction.update(ref, {
                    numRatings: newNumRatings,
                    rating: newAvgRating,
                });
            });
        });
    }

    calcSessionCost(sessionTime, hourlyRate) {
        const timeHours = sessionTime / 1000 / 60 / 60;
        if (timeHours < 0.25) {
            return 0.25 * hourlyRate;
        }
        return Math.round(timeHours * hourlyRate * 100) / 100;
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <RecapModal
                    visible={this.state.recapModalVisible}
                    headingText='Summary'
                    time={this.state.time}
                    cost={this.state.cost}
                    duration={this.state.duration}
                    dismissFunc={() => {
                        if (this.state.rating === 0) {
                            Alert.alert(
                                'No Rating',
                                'Please rate your student',
                                [{ text: 'OK' }],
                                {
                                    cancelable: false,
                                },
                            );
                            return;
                        }
                        this.setState({ recapModalVisible: false });
                        this.sessionRef
                            .update({
                                studentRating: this.state.rating,
                            })
                            .then(() => {
                                this.addRating(
                                    'students',
                                    this.state.session.studentUid,
                                    this.state.rating,
                                );
                                this.setState({ recapModalVisible: false });
                                this.props.navigation.navigate(
                                    'TutorRequestNavigator',
                                    {
                                        uid: this.state.uid,
                                    },
                                );
                            });
                    }}
                    ratingText='Please rate the student'
                    ratingFunc={(rating) => {
                        this.state.rating = rating;
                    }}
                />
                <RatingModal
                    visible={this.state.ratingModalVisible}
                    dismissFunc={() => {
                        this.sessionRef.update({ tutorDone: true }).then(() => {
                            this.setState({ ratingModalVisible: false });
                        });
                    }}
                    text='Please rate the student'
                    ratingFunc={(rating) => {
                        this.state.rating = rating;
                    }}
                />
                <WaitingModal
                    visible={this.state.waitingModalVisible}
                    dismissFunc={() => {
                        this.sessionRef
                            .update({ tutorDone: false })
                            .then(() => {
                                this.setState({ ratingModalVisible: false });
                                this.setState({ waitingModalVisible: false });
                            });
                    }}
                    text='Waiting for student to finish session...'
                />
                <View style={styles.facesContainer}>
                    <View style={styles.studentFace}>
                        <Image source={FaceLogo} style={styles.face} />
                    </View>
                    <View style={styles.tutorFace}>
                        <Image source={FaceLogo} style={styles.face} />
                    </View>
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.heading}>Session Time</Text>
                </View>
                <View style={styles.clockContainer}>
                    {this.state.min === 0 && this.state.hour === 0 ? (
                        <Text
                            style={styles.child}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        >
                            {`${this.padToTwo(
                                this.state.hour,
                            )} : ${this.padToTwo(
                                this.state.min,
                            )} : ${this.padToTwo(this.state.sec)}`}
                        </Text>
                    ) : (
                        <Text
                            style={styles.child}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        >
                            {`${this.padToTwo(
                                this.state.hour,
                            )} : ${this.padToTwo(this.state.min)}`}
                        </Text>
                    )}
                </View>
                <View style={styles.live}>
                    <Button
                        text='End Session'
                        onPress={() => {
                            this.sessionRef
                                .update({ tutorDone: true })
                                .then(() => {
                                    this.setState({
                                        waitingModalVisible: true,
                                    });
                                });
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 40,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    clockContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    child: {
        fontSize: 55,
        fontWeight: 'bold',
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        top: '6%',
    },
    heading: {
        fontSize: 50,
        alignSelf: 'center',
    },
    cancelEndingButton: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    live: {
        flex: 0.75,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    liveButton: {
        backgroundColor: primaryColor,
        alignSelf: 'center',
        height: '25%',
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    liveButtonText: {
        fontSize: 40,
        color: secondaryColor,
    },
    tutorFace: {
        backgroundColor: accentColor,
        borderRadius: 150,
        borderColor: primaryColor,
        borderWidth: 5,
        height: 175,
        width: 175,
        right: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentFace: {
        backgroundColor: primaryColor,
        borderRadius: 150,
        borderColor: accentColor,
        borderWidth: 5,
        height: 175,
        width: 175,
        left: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    facesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: '25%',
    },
});

export default TutorInProgress;
