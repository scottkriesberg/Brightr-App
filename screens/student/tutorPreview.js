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

export default class TutorPreview extends Component {
    static navigationOptions = {
        gestureEnabled: false,
        title: 'Tutor Preview',
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
            tutorUid: '',
            tutor: {},
            isLoading: true,
            uid: '',
            classRequest: '',
            locationRequest: '',
            value: 15,
            description: '',
        };
    }

    componentDidMount() {
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.uid = this.props.navigation.getParam('uid', '');
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
            if (doc.data().isLive === false) {
                Alert.alert(
                    'Tutor Unavailable',
                    'Please request a different tutor',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                this.props.navigation.navigate('StudentMap', {
                                    uid: this.state.uid,
                                }),
                        },
                    ],
                    {
                        cancelable: false,
                    }
                );
            }
        } else {
            this.props.navigation.navigate('StudentMap', {
                uid: this.state.uid,
            });
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
                    const {
                        uid,
                        tutorUid,
                        locationRequest,
                        value,
                        classRequest,
                        description,
                        tutor,
                    } = this.state;
                    firestore
                        .collection('requests')
                        .add({
                            studentUid: uid,
                            tutorUid,
                            timestamp: time,
                            location: locationRequest,
                            estTime: value,
                            classObj: classRequest,
                            status: 'pending',
                            studentReady: false,
                            tutorReady: false,
                            messages: [],
                            description,
                            hourlyRate: tutor.hourlyRate,
                            type: 'Live',
                        })
                        .then(() => {
                            console.log('requested');
                            this.props.navigation.navigate(
                                'StudentActiveRequests',
                                {
                                    uid,
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
        const { tutorUid, value, tutor, isLoading, description } = this.state;
        if (isLoading) {
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
                        rating={tutor.rating}
                        year={tutor.year}
                        major={tutor.major.code}
                        containerStyle={styles.tutorInfo}
                        avatarStyle={styles.avatar}
                        name={tutor.name}
                        bio={tutor.bio}
                        image={`demoImages/${tutorUid}.jpg`}
                        gpa={tutor.gpa}
                    />
                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={styles.description}
                            multiline
                            placeholder="Description"
                            onChangeText={(d) =>
                                this.setState({ description: d })
                            }
                            value={description}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Slider
                            style={{ width: '90%' }}
                            value={value}
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
                            onValueChange={(v) => this.setState({ value: v })}
                        />

                        <Text
                            style={styles.sliderText}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            Estimated Session Time: {value} minutes
                        </Text>
                        <Text
                            style={styles.sliderText}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            Estimated Session Cost: $
                            {(value * tutor.hourlyRate) / 60}
                        </Text>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Dropdown
                            containerStyle={{
                                width: '100%',
                                alignItems: 'center',
                                marginVertical: '2%',
                            }}
                            titleStyle={{ color: 'black', fontSize: 20 }}
                            items={tutor.locations}
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
                            items={tutor.classes}
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
        flex: 2,
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
