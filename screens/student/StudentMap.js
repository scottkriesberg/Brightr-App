/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Icon, Slider } from 'react-native-elements';
import Modal from 'react-native-modal';
import { firestore } from '../../firebase';
import ContainerStyles from '../../styles/container';
import Loading from '../components/utils';
import { Map } from '../components/map';
import { Button } from '../components/buttons';
import { Dropdown } from '../components/dropdown';
import store from '../../redux/store';
import { UserBar } from '../components/UserBar';

class StudentMap extends Component {
    static navigationOptions = {
        headerShown: false,
        title: '',
    };

    constructor() {
        super();
        this.ref = firestore.collection('tutors').where('isLive', '==', true);
        this.unsubscribe = null;
        this.state = {
            uid: '',
            isLoading: true,
            data: [],
            locationFilter: 'All Locations',
            ratingFilter: 0,
            gpaFilter: 0,
            classFilter: null,
            isFilterVisable: false,
            user: {},
        };
        this.filter = this.filter.bind(this);
    }

    componentDidMount() {
        const userCreds = store.getState().user;
        this.setState({
            uid: userCreds.uid,
        });
        firestore
            .collection('students')
            .doc(userCreds.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({
                        user: doc.data(),
                    });
                    this.ref = this.ref.where(
                        'classesArray',
                        'array-contains-any',
                        this.state.user.classesArray,
                    );
                    this.unsubscribe = this.ref.onSnapshot(
                        this.onCollectionUpdate,
                    );
                } else {
                    console.log('No such document!');
                }
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    toggleFilterWindow = () => {
        this.setState((prevState) => ({
            isFilterVisable: !prevState.isFilterVisable,
        }));
    };

    clearLocations = () => {
        this.setState({ locationFilter: 'All Locations' });
    };

    filter = (tutor) => {
        if (tutor.id === this.state.uid) {
            return false;
        }
        if (tutor.rating < this.state.ratingFilter) {
            return false;
        }
        if (
            !tutor.locations.includes(this.state.locationFilter) &&
            this.state.locationFilter !== 'All Locations'
        ) {
            return false;
        }
        if (tutor.gpa < this.state.gpaFilter) {
            return false;
        }
        if (this.state.classFilter === null) {
            return true;
        }
        for (let i = 0; i < tutor.classes.length; i++) {
            if (tutor.classes[i].name === this.state.classFilter.name) {
                return true;
            }
        }
        return false;
    };

    applyFilter = () => {
        this.setState({});
        this.toggleFilterWindow();
    };

    onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const tutor = doc.data();
            tutor.id = doc.id;
            data.push(tutor);
        });
        this.setState({
            data,
            isLoading: false,
        });
    };

    renderItem = ({ item }) => {
        if (!this.filter(item)) {
            return null;
        }
        return (
            <UserBar
                onPressFunc={() =>
                    this.props.navigation.navigate('TutorPreview', {
                        tutorUid: item.id,
                        uid: this.state.uid,
                    })
                }
                user={item}
                userId={item.id}
                rate={true}
            />
        );
    };

    locationFilter = (pin) => {
        this.setState({ locationFilter: pin.title });
    };

    toProfile = () => {
        this.props.navigation.navigate('StudentProfile', {
            uid: this.state.uid,
        });
    };

    render() {
        if (this.state.isLoading) {
            return <Loading />;
        }
        return (
            <View style={styles.container}>
                <View>
                    <Modal isVisible={this.state.isFilterVisable}>
                        <View style={styles.filterModal}>
                            <Text style={styles.filterTitle}>Filter</Text>
                            <View style={styles.filtersContainer}>
                                <Dropdown
                                    containerStyle={{
                                        width: '100%',
                                        alignItems: 'center',
                                        height: '35%',
                                    }}
                                    titleStyle={{
                                        color: 'black',
                                        fontSize: 10,
                                    }}
                                    items={this.state.user.classes}
                                    getSelectedItem={(i) => {
                                        this.setState({ classFilter: i });
                                    }}
                                    modalHeaderText='Select a class'
                                    intitalValue={
                                        this.state.classFilter
                                            ? this.state.classFilter.name
                                            : 'Filter by class'
                                    }
                                    renderItemTextFunc={(item) => item.name}
                                />
                                <Slider
                                    value={this.state.gpaFilter}
                                    maximumValue={4}
                                    minimumValue={0}
                                    step={0.25}
                                    thumbTintColor={primaryColor}
                                    trackStyle={styles.trackSlider}
                                    onValueChange={(value) =>
                                        this.setState({ gpaFilter: value })
                                    }
                                />
                                <Text style={styles.sliderText}>
                                    Minimum GPA: {this.state.gpaFilter}
                                </Text>
                                <Slider
                                    value={this.state.ratingFilter}
                                    maximumValue={5}
                                    minimumValue={0}
                                    step={0.25}
                                    thumbTintColor={primaryColor}
                                    trackStyle={styles.trackSlider}
                                    onValueChange={(value) =>
                                        this.setState({ ratingFilter: value })
                                    }
                                />
                                <Text style={styles.sliderText}>
                                    Minimum Rating: {this.state.ratingFilter}
                                </Text>
                            </View>
                            <View style={styles.filterButtonsContainer}>
                                <Button
                                    text='Clear'
                                    type='secondary'
                                    textStyle={styles.clearButtonText}
                                    buttonStyle={styles.filterButtons}
                                    onPress={() => {
                                        this.setState({
                                            ratingFilter: 0,
                                            gpaFilter: 0,
                                            classFilter: null,
                                        });
                                        this.toggleFilterWindow();
                                    }}
                                />

                                <Button
                                    text='Apply'
                                    textStyle={styles.filterButtonsText}
                                    buttonStyle={styles.filterButtons}
                                    onPress={this.applyFilter}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={styles.mapContainer}>
                    <Map
                        locationPressFunc={this.locationFilter}
                        mapPressFunc={this.clearLocations}
                        isStudent={true}
                    />
                </View>
                <View style={ContainerStyles.midbar}>
                    <View style={styles.findTutorFilterContainer}>
                        <Text style={styles.findTutorText} adjustsFontSizeToFit>
                            Find Tutor
                        </Text>
                        <Icon
                            style={styles.filterButton}
                            name='settings-input-component'
                            type='Octicons'
                            color='black'
                            onPress={this.toggleFilterWindow}
                        />
                    </View>
                </View>
                <View style={styles.tutorList}>
                    <FlatList
                        ListHeaderComponentStyle={ContainerStyles.tutorList}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    currentLocationText: {
        flex: 1,
        paddingLeft: 5,
    },
    filterButton: {
        flex: 1,
    },
    tutorList: {
        flex: 5,
        backgroundColor: secondaryColor,
    },
    mapContainer: {
        flex: 8,
    },
    findTutorFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    map: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexGrow: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    findTutorText: {
        paddingLeft: 5,
        fontSize: 30,
    },
    filterModal: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        height: '44%',
        borderRadius: 15,
        padding: 10,
        justifyContent: 'space-around',
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    filterButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        height: '100%',
    },
    filterButtonsText: {
        fontSize: 30,
        color: secondaryColor,
    },
    filterTitle: {
        flex: 1,
        fontSize: 40,
        alignSelf: 'center',
    },
    filtersContainer: {
        flex: 3,
        justifyContent: 'center',
    },
    sliderText: {
        fontSize: 20,
    },
    clearButtonText: {
        fontSize: 30,
    },
});

export default StudentMap;
