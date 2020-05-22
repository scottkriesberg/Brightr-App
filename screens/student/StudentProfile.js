/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { firestore } from '../../firebase';
import { ProfileHeadingInfo, ProfileClasses } from '../components/profile';
import { ProfileOptionsModal, AboutModal } from '../components/ProfileOptions';
import Loading from '../components/utils';
import { clearUser } from '../../redux/actions/userAction';

// This allows us to dispatch the action through props in component
const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => {
            dispatch(clearUser());
        },
    };
};
class Profile extends Component {
    static navigationOptions = {
        headerShown: false,
        title: 'Profile',
    };

    constructor() {
        super();
        this.state = {
            uid: '',
            user: {},
            isLoading: true,
            isTutor: false,
            profileOptionsVisible: false,
            aboutModalVisible: false,
        };
    }

    componentDidMount() {
        // Get UID from redux
        const userCreds = store.getState().user;
        this.state.uid = userCreds.uid;
        const ref = firestore.collection('students').doc(userCreds.uid);
        ref.get().then((doc) => {
            if (doc.exists) {
                firestore
                    .collection('tutors')
                    .doc(userCreds.uid)
                    .get()
                    .then((tutorDoc) => {
                        if (tutorDoc.exists) {
                            this.setState({
                                user: doc.data(),
                                isLoading: false,
                                isTutor: true,
                            });
                        } else {
                            this.setState({
                                user: doc.data(),
                                isLoading: false,
                            });
                        }
                    });
            } else {
                console.log('No such document!');
            }
        });
    }

    logout = () => {
        this.props.clearUser();
        this.props.navigation.navigate('Login');
    };

    toStudentMap = () => {
        this.props.navigation.navigate('StudentMap', { uid: this.state.uid });
    };

    toTutorAccount = () => {
        this.props.navigation.navigate('TutorNavigator', {
            uid: this.state.uid,
        });
    };

    toggleProfileOptions = () => {
        this.setState((prevState) => ({
            profileOptionsVisible: !prevState.profileOptionsVisible,
        }));
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <SafeAreaView style={styles.container}>
                <Icon
                    name='bars'
                    type='font-awesome'
                    onPress={this.toggleProfileOptions}
                    containerStyle={styles.optionsStyle}
                    size={30}
                />
                <ProfileOptionsModal
                    visible={this.state.profileOptionsVisible}
                    closeFunc={this.toggleProfileOptions}
                    logoutFunc={this.logout}
                    aboutFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('About');
                    }}
                    helpFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('Help');
                    }}
                    reportFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('Report');
                    }}
                    sessionsFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('Sessions');
                    }}
                    paymentFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('Payment');
                    }}
                    editFunc={() => {
                        this.setState({ profileOptionsVisible: false });
                        this.props.navigation.navigate('EditProfile');
                    }}
                />
                <AboutModal
                    visible={this.state.aboutModalVisible}
                    closeFunc={() =>
                        this.setState({
                            aboutModalVisible: false,
                        })
                    }
                />
                <ProfileHeadingInfo
                    user={this.state.user}
                    containerStyle={styles.basicInfoContainer}
                    avatarStyle={styles.avatar}
                    image={`demoImages/${this.state.uid}.jpg`}
                />
                <ProfileClasses items={this.state.user.classes} />
            </SafeAreaView>
        );
    }
}

export default connect(null, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
    basicInfoContainer: {
        flex: 5,
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
        justifyContent: 'space-evenly',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
    },
    clearButton: {
        marginTop: 40,
        marginRight: 15,
        height: 50,
        width: 50,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: primaryColor,
        alignSelf: 'center',
        aspectRatio: 1,
    },
    optionsStyle: {
        position: 'absolute',
        alignSelf: 'flex-start',
        left: '3%',
        top: '3%',
        zIndex: 999,
    },
});
