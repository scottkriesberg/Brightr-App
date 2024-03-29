/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import '../components/global';

import { UserBar } from '../components/UserBar';

class StudentConnections extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor() {
        super();
        this.studentRef = firestore.collection('tutors');
        this.connectionsRef = firestore.collection('connections');
        this.unsubscribe = null;
        this.state = {
            uid: '',
            searchText: '',
            isLoading: true,
            connections: [],
        };
    }

    componentDidMount() {
        this.state.uid = userUid;
        this.studentRef = this.studentRef.doc(this.state.uid);
        this.connectionsRef = this.connectionsRef.where(
            'tutorUid',
            '==',
            this.state.uid,
        );
        this.unsubscribe = this.connectionsRef.onSnapshot(
            this.onCollectionUpdate,
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const connections = [];
        querySnapshot.forEach((doc) => {
            let studentInfo = {};
            const { studentUid } = doc.data();
            firestore
                .collection('students')
                .doc(studentUid)
                .get()
                .then((studentDoc) => {
                    if (studentDoc.exists) {
                        studentInfo = studentDoc.data();
                    }
                    connections.push({
                        studentInfo,
                        id: studentDoc.id,
                        connectId: doc.id,
                    });
                    this.setState({
                        connections,
                        isLoading: false,
                    });
                });
        });
        this.setState({
            connections,
            isLoading: false,
        });
    };

    searchFilterFunction = (text) => {
        this.setState({
            searchText: text,
        });
    };

    filter = (item) => {
        if (
            this.state.searchText !== '' &&
            !item.name.includes(this.state.searchText)
        ) {
            return false;
        }
        return true;
    };

    toAddConnections = () => {
        this.props.navigation.navigate('TutorAddConnections', {
            uid: this.state.uid,
            connections: this.state.connections,
        });
    };

    toPendingConnections = () => {
        this.props.navigation.navigate({
            routeName: 'TutorPendingConnections',
            transitionStyle: 'inverted',
            params: {
                uid: this.state.uid,
                connections: this.state.connections,
            },
        });
    };

    renderItem = ({ item }) => {
        const connectId = item.connectId;
        const id = item.id;
        const studentInfo = item.studentInfo;
        if (!this.filter(item)) {
            return null;
        }
        return (
            <UserBar
                onPressFunc={() =>
                    this.props.navigation.navigate('StudentConnectionPreview', {
                        studentUid: id,
                        uid: this.state.uid,
                        connectId,
                    })
                }
                user={studentInfo}
                userId={id}
            />
        );
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text
                        adjustsFontSizeToFit
                        style={styles.headerText}
                        allowFontScaling={true}
                        numberOfLines={1}
                    >
                        Connections
                    </Text>
                    <Icon
                        containerStyle={styles.addConnection}
                        name='inbox'
                        type='font-awesome'
                        onPress={this.toPendingConnections}
                    />
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder='Search tutor name'
                        onChangeText={(text) => this.searchFilterFunction(text)}
                        value={this.state.searchText}
                    />
                </View>
                <View style={styles.connectList}>
                    {this.state.connections.length > 0 ? (
                        <FlatList
                            data={this.state.connections}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noConnectionsText}>
                            No Connections
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    header: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 0.25,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: '2%',
        borderTopWidth: 0.75,
        borderColor: 'black',
    },
    connectList: {
        flex: 5,
        width: '100%',
    },
    headerText: {
        fontSize: 40,
        color: primaryColor,
    },
    addConnection: {
        position: 'absolute',
        marginLeft: '55%',
    },
    searchBar: {
        width: '90%',
        paddingHorizontal: '2%',
    },
    noConnectionsText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: '50%',
    },
});

export default StudentConnections;
