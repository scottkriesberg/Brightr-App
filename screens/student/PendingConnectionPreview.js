/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import { Button } from '../components/buttons';
import { ProfileHeadingInfo, ProfileClasses } from '../components/profile';

export default class PendingConnectionPreview extends Component {
    static navigationOptions = {
        gestureEnabled: false,
        title: 'Pending Connection',
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
            pendingConnectionId: '',
        };
    }

    componentDidMount() {
        this.state.tutorUid = this.props.navigation.getParam('tutorUid', '');
        this.state.uid = this.props.navigation.getParam('uid', '');
        this.state.pendingConnectionId = this.props.navigation.getParam(
            'pendingConnectionId',
            '',
        );
        this.state.description = this.props.navigation.getParam(
            'description',
            '',
        );
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

    cancelConnectionRequest = () => {
        firestore
            .collection('pending-connections')
            .doc(this.state.pendingConnectionId)
            .delete()
            .then(() =>
                this.props.navigation.navigate('PendingConnections', {
                    uid: this.state.uid,
                }),
            );
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <ProfileHeadingInfo
                    user={this.state.tutor}
                    containerStyle={styles.basicInfoContainer}
                    avatarStyle={styles.avatar}
                    image={`demoImages/${this.state.tutorUid}.jpg`}
                />
                <ProfileClasses items={this.state.tutor.classes} />
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTextHeader}>
                        Request Description
                    </Text>
                    <Text style={styles.descriptionText}>
                        {this.state.description}
                    </Text>
                </View>
                <View style={styles.requestContianer}>
                    <Button
                        buttonStyle={{ width: '90%', height: '80%' }}
                        text='Cancel Request'
                        onPress={this.cancelConnectionRequest}
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
    descriptionContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    descriptionText: {
        fontSize: 16,
        width: '90%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'left',
        height: '50%',
        padding: 10,
    },
    descriptionTextHeader: {
        fontSize: 25,
    },
});
