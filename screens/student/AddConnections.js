/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import '../components/global';
import { UserBar } from '../components/UserBar';

class AddConnections extends Component {
    static navigationOptions = {
        gestureEnabled: false,
        title: 'Add Connections',
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
        this.tutorRef = firestore.collection('tutors');
        this.connectionsRef = firestore.collection('connections');
        this.unsubscribe = null;
        this.state = {
            uid: '',
            searchText: '',
            isLoading: true,
            tutors: [],
            connections: [],
        };
    }

    componentDidMount() {
        this.state.connections = this.props.navigation.getParam(
            'connections',
            []
        );
        this.state.uid = userUid;
        this.studentRef = this.studentRef.doc(this.state.uid);
        this.unsubscribe = this.tutorRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const tutors = [];
        querySnapshot.forEach((doc) => {
            const tutorInfo = doc.data();
            firestore
                .collection('pending-connections')
                .where('studentUid', '==', this.state.uid)
                .where('tutorUid', '==', doc.id)
                .get()
                .then((qSnap) => {
                    let pending = false;
                    qSnap.forEach(() => {
                        pending = true;
                    });
                    if (!pending && doc.id !== this.state.uid) {
                        tutors.push({
                            tutorInfo,
                            id: doc.id,
                        });
                    }
                    this.setState({
                        tutors,
                        isLoading: false,
                    });
                })
                .catch((error) => {
                    console.log('Error getting documents: ', error);
                });
        });
        this.setState({
            tutors,
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
            this.state.connections.filter((t) => {
                return item.id === t.id;
            }).length > 0
        ) {
            return false;
        }
        if (
            this.state.searchText !== '' &&
            !item.tutorInfo.name.includes(this.state.searchText)
        ) {
            return false;
        }
        return true;
    };

    renderItem = ({ item }) => {
        const id = item.id;
        if (!this.filter(item)) {
            return null;
        }
        const tutorInfo = item.tutorInfo;
        return (
            <UserBar
                onPressFunc={() =>
                    this.props.navigation.navigate('AddConnectionPreview', {
                        tutorUid: id,
                        uid: this.state.uid,
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
                        placeholder="Search tutor name"
                        onChangeText={(text) => this.searchFilterFunction(text)}
                        value={this.state.searchText}
                    />
                </View>
                <View style={styles.connectList}>
                    {this.state.tutors.length > 0 ? (
                        <FlatList
                            data={this.state.tutors}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noConnectionsText}>
                            No New Tutors
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
        // borderWidth: 1,
        // borderColor: 'black',
        paddingHorizontal: '2%',
    },
    noConnectionsText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: '50%',
    },
});

export default AddConnections;
