/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import '../components/global';
import { UserBar } from '../components/UserBar';

class PendingConnections extends Component {
    static navigationOptions = {
        gestureEnabled: false,
        title: 'Pending Connections',
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
        this.connectionsRef = firestore.collection('pending-connections');
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
            'studentUid',
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
            let tutorInfo = {};
            const { tutorUid } = doc.data();
            firestore
                .collection('tutors')
                .doc(tutorUid)
                .get()
                .then((tutorDoc) => {
                    if (tutorDoc.exists) {
                        tutorInfo = tutorDoc.data();
                    }

                    connections.push({
                        tutorInfo,
                        id: tutorDoc.id,
                        pendingConnectionId: doc.id,
                        description: doc.data().description,
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

    renderItem = ({ item }) => {
        const pendingConnectionId = item.pendingConnectionId;
        const id = item.id;
        const description = item.description;
        const tutorInfo = item.tutorInfo;
        if (!this.filter(item)) {
            return null;
        }
        return (
            <UserBar
                onPressFunc={() =>
                    this.props.navigation.navigate('PendingConnectionPreview', {
                        tutorUid: id,
                        uid: this.state.uid,
                        pendingConnectionId,
                        description,
                    })
                }
                user={tutorInfo}
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
                        <Text style={styles.noPendingText}>
                            No Pending Connections
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
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    searchBar: {
        width: '90%',
        paddingHorizontal: '2%',
    },
    noPendingText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: '50%',
    },
});

export default PendingConnections;
