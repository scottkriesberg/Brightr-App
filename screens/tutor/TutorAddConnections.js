/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Rating } from '../components/profile';
import ContainerStyles from '../../styles/container';
import { firestore } from '../../firebase';
import Loading from '../components/utils';
import '../components/global';

class TutorAddConnections extends Component {
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
            students: [],
            connections: [],
        };
    }

    componentDidMount() {
        this.state.connections = this.props.navigation.getParam(
            'connections',
            [],
        );
        this.state.uid = userUid;
        this.tutorRef = this.tutorRef.doc(this.state.uid);
        this.unsubscribe = this.studentRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const students = [];
        querySnapshot.forEach((doc) => {
            const studentInfo = doc.data();
            firestore
                .collection('pending-connections')
                .where('tutorUid', '==', this.state.uid)
                .where('studentUid', '==', doc.id)
                .get()
                .then((qSnap) => {
                    let pending = false;
                    qSnap.forEach(() => {
                        pending = true;
                    });
                    if (!pending && doc.id !== this.state.uid) {
                        students.push({
                            studentInfo,
                            id: doc.id,
                        });
                    }
                    this.setState({
                        students,
                        isLoading: false,
                    });
                })
                .catch((error) => {
                    console.log('Error getting documents: ', error);
                });
        });
        this.setState({
            students,
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
            !item.studentInfo.name.includes(this.state.searchText)
        ) {
            return false;
        }
        return true;
    };

    renderItem = ({ item }) => {
        if (!this.filter(item)) {
            return null;
        }
        const studentInfo = item.studentInfo;
        let classList = '';
        for (let i = 0; i < studentInfo.classesArray.length; i++) {
            classList += `${studentInfo.classesArray[i]}, `;
        }
        classList = classList.substring(0, classList.length - 2);
        return (
            <TouchableOpacity
                style={[ContainerStyles.tutorPreviewContainer]}
                // onPress={() =>
                // 	this.props.navigation.navigate('TutorAddConnectionPreview', {
                // 		student: id,
                // 		uid: this.state.uid
                // 	})}
            >
                {/* Different containers needed for image and description for styling */
                /* Tutor image */}
                <View>
                    <Image
                        style={ContainerStyles.previewImage}
                        source={{
                            uri:
                                'https://bootdey.com/img/Content/avatar/avatar6.png',
                        }}
                    />
                </View>
                {/* Tutor Info */}
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                        }}
                    >
                        {studentInfo.name}
                    </Text>
                    <Rating rating={studentInfo.rating} />
                    <Text adjustsFontSizeToFit={true} numberOfLines={2}>
                        {studentInfo.major.code} / {studentInfo.year}
                    </Text>
                    <Text>${studentInfo.hourlyRate}/hour</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignSelf: 'flex-start',
                        marginTop: '3%',
                        margin: '8%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                        }}
                    >
                        Classes
                    </Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={3}>
                        {classList}
                    </Text>
                </View>
            </TouchableOpacity>
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
                        autoFocus={true}
                    />
                </View>
                <View style={styles.connectList}>
                    {this.state.students.length > 0 ? (
                        <FlatList
                            data={this.state.students}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text style={styles.noConnectionsText}>
                            No New Students
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
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: '2%',
    },
    noConnectionsText: {
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: '50%',
    },
});

export default TutorAddConnections;
