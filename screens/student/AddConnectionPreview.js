/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, TextInput, View, YellowBox } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import { Button } from '../components/buttons';
import { ProfileHeadingInfo, ProfileClasses } from '../components/profile';

YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);
export default class AddConnectionPreview extends Component {
    static navigationOptions = {
        gestureEnabled: false,
        title: 'Tutor Profile',
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
            description: '',
            tutor: {},
            isLoading: true,
            uid: '',
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
            if (doc.data()) {
                this.setState({ tutor: doc.data() });
            }
        } else {
            this.props.navigation.navigate('StudentConnections', {
                uid: this.state.uid,
            });
        }
    };

    requestConnection = () => {
        firestore
            .collection('pending-connections')
            .add({
                tutorUid: this.state.tutorUid,
                studentUid: this.state.uid,
                description: this.state.description,
            })
            .then(() =>
                this.props.navigation.navigate('StudentConnections', {
                    uid: this.state.uid,
                })
            );
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#4c69a5' }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
            >
                <View style={styles.container}>
                    <ProfileHeadingInfo
                        rating={this.state.tutor.rating}
                        year={this.state.tutor.year}
                        major={this.state.tutor.major.code}
                        gpa={this.state.tutor.gpa}
                        name={this.state.tutor.name}
                        containerStyle={styles.basicInfoContainer}
                        avatarStyle={styles.avatar}
                        image={`demoImages/${this.state.tutorUid}.jpg`}
                        bio={this.state.tutor.bio}
                    />
                    <ProfileClasses items={this.state.tutor.classes} />
                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={styles.description}
                            multiline={true}
                            placeholder="Request Description"
                            onChangeText={(description) =>
                                this.setState({ description })
                            }
                            value={this.state.description}
                        />
                    </View>
                    <View style={styles.requestContianer}>
                        <Button
                            buttonStyle={{ width: '90%', height: '80%' }}
                            text="Request Connection"
                            onPress={this.requestConnection}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F8F8FF',
    },
    basicInfoContainer: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: '#F8F8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '5%',
    },
    descriptionContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        flex: 3,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: primaryColor,
        alignSelf: 'center',
        aspectRatio: 1,
    },
    followConnectContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
    requestContianer: {
        flex: 1,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        width: '90%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'left',
        height: '60%',
        padding: 10,
    },
});
