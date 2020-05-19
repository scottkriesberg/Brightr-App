/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Modal,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from '../components/buttons';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import '../components/global';

class StudentActiveRequests extends Component {
    static navigationOptions = {
        headerShown: false,
        title: '',
    };

    constructor() {
        super();
        this.studentRef = firestore.collection('students');
        this.requestRef = firestore.collection('requests');
        this.unsubscribe = null;
        this.state = {
            uid: '',
            isLoading: true,
            requests: [],
            menuVisible: false,
        };
    }

    componentDidMount() {
        this.state.uid = userUid;
        this.studentRef = this.studentRef.doc(this.state.uid);
        this.requestRef = this.requestRef
            .where('studentUid', '==', this.state.uid)
            .where('status', 'in', [
                'pending',
                'accepted',
                'waitingTutor',
                'waitingStudent',
            ]);
        this.unsubscribe = this.requestRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
            this.setState({
                isLoading: true,
            });
            let tutorInfo = {};

            const {
                tutorUid,
                description,
                classObj,
                estTime,
                location,
                status,
            } = doc.data();
            firestore
                .collection('tutors')
                .doc(tutorUid)
                .get()
                .then((tutorDoc) => {
                    if (tutorDoc.exists) {
                        tutorInfo = tutorDoc.data();
                    }
                    requests.push({
                        status,
                        tutorUid,
                        classObj,
                        estTime,
                        location,
                        description,
                        tutorInfo,
                        id: doc.id,
                    });
                    this.setState({
                        requests,
                        isLoading: false,
                    });
                });
        });
        this.setState({
            requests,
            isLoading: false,
        });
    };

    renderItem = ({ item }) => {
        let pColor, sColor, screenNav;
        switch (item.status) {
            case 'pending':
                pColor = secondaryColor;
                sColor = primaryColor;
                screenNav = 'RequestWaiting';
                break;
            case 'accepted':
                pColor = primaryColor;
                sColor = secondaryColor;
                screenNav = 'StudentChat';
                break;
            case 'waitingTutor':
                pColor = secondaryColor;
                sColor = primaryColor;
                screenNav = 'RequestWaiting';
                break;
            case 'waitingStudent':
                pColor = accentColor;
                sColor = primaryColor;
                screenNav = 'StudentRequestRespond';
                break;
            default:
                return null;
        }
        return (
            <TouchableOpacity
                style={[
                    styles.row,
                    {
                        backgroundColor: pColor,
                        borderWidth: 1,
                        borderColor: sColor,
                    },
                ]}
                onPress={() => {
                    this.props.navigation.navigate(screenNav, {
                        uid: this.state.uid,
                        tutorUid: item.tutorUid,
                        requestUid: item.id,
                        tutorImage:
                            'https://bootdey.com/img/Content/avatar/avatar6.png',
                        tutorName: item.tutorInfo.name,
                    });
                }}
            >
                <View style={styles.requestInfo}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: sColor,
                        }}
                        allowFontScaling={true}
                    >
                        {item.tutorInfo.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: sColor,
                        }}
                    >
                        Class: {item.classObj.department} {item.classObj.code}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: sColor,
                        }}
                    >
                        Location: {item.location}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: sColor,
                        }}
                        numberOfLines={1}
                    >
                        Estimated Time: {item.estTime} min
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: sColor,
                        }}
                        minimumFontScale={0.4}
                        adjustsFontSizeToFit={true}
                        numberOfLines={2}
                        allowFontScaling={true}
                    >
                        Description:{' '}
                        {item.description ? item.description : 'N/A'}
                    </Text>
                </View>
                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Icon
                        name="keyboard-arrow-right"
                        size={60}
                        color={sColor}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    cancel = ({ item }) => {
        firestore
            .collection('requests')
            .doc(item.id)
            .update({ status: 'cancelled' })
            .then(() => {})
            .catch((error) => {
                console.error('Error adding document: ', error);
            });
    };

    cancelAll = () => {
        this.setState({ requests: [] });
        for (let i = 0; i < this.state.requests.length; i++) {
            firestore
                .collection('requests')
                .doc(this.state.requests[i].id)
                .update({ status: 'cancelled' })
                .then(() => {
                    this.setState({ requests: [] });
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });
        }
        this.setState({ menuVisible: false });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <SafeAreaView style={styles.container}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.menuVisible}
                >
                    <View style={styles.menuContainer}>
                        <Button
                            onPress={this.cancelAll}
                            type="secondary"
                            buttonStyle={styles.cancelAllButton}
                            text="Cancel All"
                        />
                        <Button
                            onPress={() =>
                                this.setState({ menuVisible: false })
                            }
                            type="primary"
                            buttonStyle={styles.cancelAllButton}
                            text="Dismiss"
                        />
                    </View>
                </Modal>
                <View style={styles.header}>
                    <Text
                        adjustsFontSizeToFit
                        style={styles.headerText}
                        allowFontScaling={true}
                        numberOfLines={1}
                    >
                        Active Requests
                    </Text>
                    <Icon
                        onPress={() => this.setState({ menuVisible: true })}
                        name="ellipsis-v"
                        type="font-awesome"
                        color={primaryColor}
                        containerStyle={{
                            position: 'absolute',
                            right: 10,
                        }}
                    />
                </View>
                <View style={styles.legendContianer}>
                    <View
                        style={[
                            styles.legends,
                            {
                                backgroundColor: 'white',
                                borderColor: primaryColor,
                                borderWidth: 1,
                            },
                        ]}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.legendText, { color: primaryColor }]}
                        >
                            Open
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.legends,
                            { backgroundColor: primaryColor },
                        ]}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={styles.legendText}
                        >
                            Accepted
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.legends,
                            {
                                backgroundColor: accentColor,
                                borderColor: accentColor,
                                borderWidth: 1,
                            },
                        ]}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={[styles.legendText, { color: primaryColor }]}
                        >
                            Resopnse Needed
                        </Text>
                    </View>
                </View>
                <View style={styles.requestList}>
                    {this.state.requests.length > 0 ? (
                        <FlatList
                            data={this.state.requests}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noRequstsText}>
                            No Active Requests
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: secondaryColor,
        width: '100%',
    },
    cancelAllButton: {
        alignSelf: 'center',
        margin: 10,
    },
    headerText: {
        fontSize: 40,
        color: primaryColor,
    },
    requestList: {
        paddingTop: 10,
        flex: 12,
        backgroundColor: secondaryColor,
    },
    requestInfo: {
        flex: 2,
        justifyContent: 'space-around',
        margin: 10,
    },
    requestButtons: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'stretch',
        margin: 10,
    },
    button: {
        alignSelf: 'center',
        width: '95%',
    },
    buttonText: {
        alignSelf: 'center',
        padding: 3,
    },
    row: {
        backgroundColor: primaryColor,
        flexDirection: 'row',
        marginBottom: '2%',
        marginHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        shadowOpacity: 0.5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    live: {
        flex: 2,
        alignItems: 'center',
        width: '100%',
    },
    noRequstsText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: '50%',
    },
    legendContianer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    legends: {
        width: '30%',
        textAlign: 'center',
        borderRadius: 5,
        alignItems: 'center',
        height: '50%',
        justifyContent: 'center',
    },
    legendText: {
        color: 'white',
    },
    menuContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default StudentActiveRequests;
