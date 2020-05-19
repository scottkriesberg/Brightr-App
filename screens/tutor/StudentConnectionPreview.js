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
        title: 'Student Profile',
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
        this.studentRef = firestore.collection('students');
        this.requestRef = firestore.collection('requests');
        this.unsubscribe = null;
        this.state = {
            studentUid: '',
            connectId: '',
            student: {},
            isLoading: true,
            uid: '',
        };
    }

    componentDidMount() {
        this.state.studentUid = this.props.navigation.getParam(
            'studentUid',
            ''
        );
        this.state.uid = this.props.navigation.getParam('uid', '');
        this.state.connectId = this.props.navigation.getParam('connectId', '');
        this.studentRef = this.studentRef.doc(this.state.studentUid);
        this.studentRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    student: doc.data(),
                    isLoading: false,
                });
            } else {
                console.log('No such document!');
            }
        });
        this.unsubscribe = this.studentRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (doc) => {
        if (doc.exists) {
            if (doc.data()) {
                this.setState({ student: doc.data() });
            }
        } else {
            this.props.navigation.navigate('TutorConnections', {
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
                this.props.navigation.navigate('TutorConnections', {
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
                    rating={this.state.student.rating}
                    year={this.state.student.year}
                    major={this.state.student.major.code}
                    gpa={this.state.student.gpa}
                    name={this.state.student.name}
                    containerStyle={styles.basicInfoContainer}
                    avatarStyle={styles.avatar}
                    image={`demoImages/${this.state.studentUid}.jpg`}
                    bio={this.state.student.bio}
                />
                <View style={styles.followConnectContainer}>
                    {/* <Button buttonStyle={{ width: '40%', height: '60%' }} text={'Follow'} /> */}
                    <Button
                        buttonStyle={{ width: '40%', height: '60%' }}
                        onPress={this.disconnect}
                        text="Disconnect"
                    />
                </View>
                <ProfileClasses items={this.state.student.classes} />
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
