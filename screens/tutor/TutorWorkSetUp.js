/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Slider } from 'react-native-elements';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import { Map } from '../components/map';
import { Button } from '../components/buttons';

class TutorWorkSetUp extends Component {
    constructor() {
        super();
        this.tutorRef = firestore.collection('tutors');
        this.state = {
            uid: '',
            isLoading: true,
            locations: [],
            value: 25,
            status: 'Offline',
        };
    }

    componentDidMount() {
        // this.state.uid = this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('uid');
        this.state.uid = userUid;
        this.tutorRef = this.tutorRef.doc(this.state.uid);
        this.tutorRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    isLoading: false,
                    value: 25,
                    status: doc.data().isLive ? 'Live' : 'Offline',
                });
            } else {
                console.log('No such document!');
            }
        });
    }

    toProfile = () => {
        this.props.navigation.navigate('TutorProfile', { uid: this.state.uid });
    };

    goLive = () => {
        if (this.state.locations.length === 0) {
            Alert.alert(
                'No Locations',
                'Please select at least one location',
                [{ text: 'OK' }],
                {
                    cancelable: false,
                }
            );
            return;
        }
        this.tutorRef
            .update({
                isLive: true,
                hourlyRate: this.state.value,
                locations: this.state.locations,
            })
            .then(() => {
                this.setState({ status: 'Live' });
            });
    };

    toggleLoc = (pin) => {
        if (this.state.locations.includes(pin.title)) {
            this.state.locations = this.state.locations.filter(
                (x) => x !== pin.title
            );
        } else {
            this.state.locations.push(pin.title);
        }
    };

    clearLocations = () => {
        this.state.locations = [];
    };

    stopLive = () => {
        this.tutorRef
            .update({ isLive: false, hourlyRate: 0, locations: [] })
            .then(() => {
                firestore
                    .collection('requests')
                    .where('tutorUid', '==', this.state.uid)
                    .where('status', '==', 'pending')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            firestore
                                .collection('requests')
                                .doc(doc.id)
                                .update({ status: 'declined' })
                                .catch((error) => {
                                    console.error(
                                        'Error adding document: ',
                                        error
                                    );
                                });
                        });
                    })
                    .catch((error) => {
                        console.log('Error getting documents: ', error);
                    });

                this.setState({ status: 'Offline' });
            });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <Map
                        locationPressFunc={this.toggleLoc}
                        mapPressFunc={this.clearLocations}
                        isStudent={false}
                    />
                    <View
                        style={[
                            styles.statusContainer,
                            {
                                shadowColor:
                                    this.state.status === 'Live'
                                        ? primaryColor
                                        : 'black',
                            },
                        ]}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[
                                styles.statusText,
                                {
                                    color:
                                        this.state.status === 'Live'
                                            ? primaryColor
                                            : 'black',
                                },
                            ]}
                        >
                            Status: {this.state.status}
                        </Text>
                    </View>
                </View>
                <View style={styles.sliderContainer}>
                    <Slider
                        value={this.state.value}
                        maximumValue={100}
                        minimumValue={10}
                        step={5}
                        thumbTintColor={primaryColor}
                        trackStyle={styles.trackSlider}
                        thumbStyle={styles.thumbStyle}
                        onValueChange={(value) => this.setState({ value })}
                    />
                    <View style={styles.sliderText}>
                        <Text>$10/hr</Text>
                        <Text style={styles.currentRateText}>
                            Hourly Rate: ${this.state.value}
                        </Text>
                        <Text>$100/hr</Text>
                    </View>
                </View>
                {this.state.status === 'Live' ? (
                    <View style={styles.live}>
                        <Button
                            type="secondary"
                            buttonStyle={styles.liveButtons}
                            textStyle={styles.liveButtonsText}
                            text="End Live"
                            onPress={this.stopLive}
                        />
                        <Button
                            buttonStyle={styles.liveButtons}
                            textStyle={styles.liveButtonsText}
                            text="Update Live"
                            onPress={this.goLive}
                        />
                    </View>
                ) : (
                    <View style={styles.live}>
                        <Button
                            buttonStyle={styles.liveButtons}
                            textStyle={styles.liveButtonsText}
                            text="Go Live"
                            onPress={this.goLive}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'green',
        justifyContent: 'space-between',
    },
    cancelButton: {
        alignSelf: 'flex-start',
    },
    mapContainer: {
        flex: 5,
    },
    map: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexGrow: 1,
    },
    sliderContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
    },
    slider: {
        flex: 1,
    },
    sliderText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    currentRateText: {
        fontSize: 30,
    },
    live: {
        flex: 0.5,
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    liveButtons: {
        width: '40%',
        padding: 5,
    },
    liveButtonsText: {
        fontSize: 30,
    },
    trackSlider: {
        height: 15,
        borderRadius: 7.5,
    },
    thumbStyle: {
        height: 25,
        width: 25,
    },
    statusContainer: {
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        width: '50%',
        height: '7%',
        backgroundColor: 'white',
        justifyContent: 'center',
        top: '7%',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.8,
    },
    statusText: {
        textAlign: 'center',
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});

export default TutorWorkSetUp;
