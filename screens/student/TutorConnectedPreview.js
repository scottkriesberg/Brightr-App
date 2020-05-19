/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import { Button } from '../components/buttons';
import { ProfileHeadingInfo, ProfileClasses } from '../components/profile';

export default class TutorConnectedPreview extends Component {
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
            connectId: '',
            tutor: {},
            isLoading: true,
            uid: '',
        };
    }

    componentDidMount() {
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.uid = this.props.navigation.getParam('uid', '');
        this.state.connectId = this.props.navigation.getParam('connectId', '');
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

    disconnect = () => {
        firestore
            .collection('connections')
            .doc(this.state.connectId)
            .delete()
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
            <View style={styles.container}>
                <ProfileHeadingInfo
                    containerStyle={styles.basicInfoContainer}
                    avatarStyle={styles.avatar}
                    image={`demoImages/${this.state.tutorUid}.jpg`}
                    user={this.state.tutor}
                />
                <View style={styles.followConnectContainer}>
                    {/* <Button buttonStyle={{ width: '40%', height: '60%' }} text={'Follow'} /> */}
                    <Button
                        buttonStyle={{ width: '40%', height: '60%' }}
                        onPress={this.disconnect}
                        text="Disconnect"
                    />
                </View>
                <ProfileClasses items={this.state.tutor.classes} />
                <View style={styles.requestContianer}>
                    <Button
                        buttonStyle={{ width: '60%', height: '70%' }}
                        text="Request Tutor"
                        onPress={() =>
                            this.props.navigation.navigate(
                                'ConnectionRequestPreview',
                                {
                                    tutorUid: this.state.tutorUid,
                                    uid: this.state.uid,
                                }
                            )
                        }
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
});
