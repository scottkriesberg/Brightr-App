/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Slider } from 'react-native-elements';
import {
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Text,
    View,
} from 'react-native';
import { firestore } from '../../firebase';
import { ProfileHeadingInfo } from '../components/profile';
import Loading from '../components/utils';
import { Dropdown } from '../components/dropdown';
import { Button } from '../components/buttons';

export default class ConnectionRequestPreview extends Component {
    static navigationOptions = {
        gestureEnabled: false,
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
        this.tutorRef = firestore.collection('tutors');
        this.requestRef = firestore.collection('requests');
        this.unsubscribe = null;
        this.state = {
            uid: '',
            tutorUid: '',
            tutor: {},
            isLoading: true,
            classRequest: '',
            locationRequest: '',
            value: 15,
            rate: 25,
            description: '',
            locations: [
                'Cafe 84',
                'VKC Library',
                'SAL',
                'Leavey  Library',
                'USC Village Tables',
                'RTH Campus Center Tables',
                'Fertitta Hall',
            ],
        };
    }

    componentDidMount() {
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.uid = this.props.navigation.getParam('uid', '');
        console.log(this.state.uid);
        this.tutorRef = this.tutorRef.doc(this.state.tutorUid);
        this.tutorRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    tutor: doc.data(),
                    isLoading: false,
                });
            } else {
                console.log('No such document!');
            }
        });
        this.unsubscribe = this.tutorRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (doc) => {
        if (doc.exists) {
            if (doc.data().isLive === true) {
                this.props.navigation.navigate('StudentMap', {
                    uid: this.state.uid,
                });
            }
        }
    };

    rowItem = (item) => (
        <View
            style={{
                flex: 1,
                borderBottomWidth: 0.5,
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingVertical: 20,
                borderBottomColor: '##dfdfdf',
            }}
        >
            <Text>{item}</Text>
        </View>
    );

    classSelected = (selectedItem) => {
        this.state.classRequest = selectedItem[0];
    };

    locationSelected = (selectedItem) => {
        this.state.locationRequest = selectedItem[0];
    };

    toStudentMap = () => {
        this.props.navigation.navigate('StudentTabNavigator', {
            uid: this.state.uid,
        });
    };

    requestTutor = () => {
        if (this.state.classRequest === '') {
            Alert.alert('No Class', 'Please select a class', [{ text: 'OK' }], {
                cancelable: false,
            });
            return;
        }
        if (this.state.locationRequest === '') {
            Alert.alert(
                'No Location',
                'Please select a location',
                [{ text: 'OK' }],
                {
                    cancelable: false,
                }
            );
            return;
        }
        const time = Date.now();
        firestore
            .collection('requests')
            .where('tutorUid', '==', this.state.tutorUid)
            .where('status', '==', 'pending')
            .get()
            .then((querySnapshot) => {
                let requested = false;
                querySnapshot.forEach(() => {
                    requested = true;
                });
                if (requested) {
                    Alert.alert(
                        'Tutor Requested',
                        'You already have a pending request for this tutor',
                        [
                            {
                                text: 'OK',
                                onPress: () =>
                                    this.props.navigation.navigate(
                                        'StudentMap',
                                        {
                                            uid: this.state.uid,
                                        }
                                    ),
                            },
                        ],
                        {
                            cancelable: false,
                        }
                    );
                } else {
                    firestore
                        .collection('requests')
                        .add({
                            studentUid: this.state.uid,
                            tutorUid: this.state.tutorUid,
                            timestamp: time,
                            location: this.state.locationRequest,
                            estTime: this.state.value,
                            classObj: this.state.classRequest,
                            status: this.state.tutor.isLive
                                ? 'pending'
                                : 'waitingTutor',
                            studentReady: false,
                            tutorReady: false,
                            messages: [],
                            description: this.state.description,
                            hourlyRate: this.state.tutor.isLive
                                ? this.state.tutor.hourlyRate
                                : this.state.rate,
                            type: this.state.tutor.isLive
                                ? 'Live'
                                : 'Connection',
                        })
                        .then(() => {
                            console.log('requested');
                            this.props.navigation.navigate(
                                'StudentActiveRequests',
                                {
                                    uid: this.state.uid,
                                }
                            );
                        })
                        .catch((error) => {
                            console.error('Error adding document: ', error);
                            this.setState({
                                isLoading: false,
                            });
                        });
                }
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <View style={styles.container}>
                    <ProfileHeadingInfo
                        user={this.state.tutor}
                        containerStyle={styles.tutorInfo}
                        avatarStyle={styles.avatar}
                        image={`demoImages/${this.state.tutorUid}.jpg`}
                    />
                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={styles.description}
                            multiline={true}
                            placeholder="Description"
                            onChangeText={(description) =>
                                this.setState({ description })
                            }
                            value={this.state.description}
                        />
                    </View>
                    {this.state.tutor.isLive ? (
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={{ width: '90%' }}
                                value={this.state.value}
                                maximumValue={90}
                                minimumValue={15}
                                step={15}
                                thumbTintColor="#6A7BD6"
                                thumbTouchSize={{ width: 30, height: 30 }}
                                trackStyle={{ height: 15, borderRadius: 10 }}
                                thumbStyle={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                }}
                                onValueChange={(value) =>
                                    this.setState({ value })
                                }
                            />

                            <Text
                                style={styles.sliderText}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Estimated Session Time: {this.state.value}{' '}
                                minutes
                            </Text>

                            <Text
                                style={styles.sliderText}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Estimated Session Cost: $
                                {(this.state.value *
                                    this.state.tutor.hourlyRate) /
                                    60}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.sliderContainer}>
                            <View style={styles.individualSliderContainer}>
                                <Text>Time</Text>
                                <Slider
                                    style={{ width: '90%' }}
                                    value={this.state.value}
                                    maximumValue={90}
                                    minimumValue={15}
                                    step={15}
                                    thumbTintColor="#6A7BD6"
                                    thumbTouchSize={{ width: 30, height: 30 }}
                                    trackStyle={{
                                        height: 15,
                                        borderRadius: 10,
                                    }}
                                    thumbStyle={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: 15,
                                    }}
                                    onValueChange={(value) =>
                                        this.setState({ value })
                                    }
                                />

                                <Text
                                    style={styles.sliderText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    Estimated Session Time: {this.state.value}{' '}
                                    minutes
                                </Text>
                            </View>
                            <View style={styles.individualSliderContainer}>
                                <Text>Rate</Text>
                                <Slider
                                    style={{ width: '90%' }}
                                    value={this.state.rate}
                                    maximumValue={100}
                                    minimumValue={10}
                                    step={5}
                                    thumbTintColor="#6A7BD6"
                                    thumbTouchSize={{ width: 30, height: 30 }}
                                    trackStyle={{
                                        height: 15,
                                        borderRadius: 10,
                                        width: '100%',
                                    }}
                                    thumbStyle={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: 15,
                                    }}
                                    onValueChange={(rate) =>
                                        this.setState({ rate })
                                    }
                                />

                                <Text
                                    style={styles.sliderText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    Session Rate: ${this.state.rate}/hr
                                </Text>

                                <Text
                                    style={styles.sliderText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    Estimated Session Cost: $
                                    {(this.state.value * this.state.rate) / 60}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.pickerContainer}>
                        <Dropdown
                            containerStyle={{
                                width: '100%',
                                alignItems: 'center',
                                marginVertical: '2%',
                            }}
                            titleStyle={{ color: 'black', fontSize: 20 }}
                            items={this.state.locations}
                            getSelectedItem={(i) => {
                                this.setState({ locationRequest: i });
                            }}
                            modalHeaderText="Select a location"
                            intitalValue="Select a location"
                            dropdownTitle="Location"
                        />

                        <Dropdown
                            containerStyle={{
                                width: '100%',
                                alignItems: 'center',
                                marginVertical: '2%',
                            }}
                            titleStyle={{ color: 'black', fontSize: 20 }}
                            items={this.state.tutor.classes}
                            getSelectedItem={(i) => {
                                this.setState({ classRequest: i });
                            }}
                            modalHeaderText="Select a class"
                            intitalValue="Select a class"
                            dropdownTitle="Class"
                            renderItemTextFunc={(item) => item.name}
                        />
                    </View>
                    <View style={styles.live}>
                        <Button
                            text="Request Tutor"
                            onPress={this.requestTutor}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
        flexDirection: 'column',
    },
    backButtonContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
    },
    avatar: {
        flex: 3,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: primaryColor,
        alignSelf: 'center',
        aspectRatio: 1,
    },
    tutorInfo: {
        flex: 2,
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
    },
    descriptionContainer: {
        flex: 0.75,
        height: '30%',
        alignItems: 'center',
    },
    sliderContainer: {
        flex: 3,
        width: '100%',
        justifyContent: 'space-around',
    },
    individualSliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderText: {
        fontSize: 20,
        textAlign: 'justify',
        width: '85%',
        top: 10,
    },
    pickerContainer: {
        flex: 2,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        width: '90%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        textAlign: 'left',
        height: '100%',
        padding: 10,
    },
    backButton: {
        marginTop: 25,
        marginLeft: 10,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    live: {
        flex: 1,
        alignItems: 'center',
    },
});
