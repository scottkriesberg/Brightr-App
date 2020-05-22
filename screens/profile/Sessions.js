import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import AsyncImage from '../components/AsyncImage';

export default class Sessions extends Component {
    static navigationOptions = {
        title: 'Previous Sessions',
    };

    constructor() {
        super();
        this.state = { modalVisibilie: false, session: {} };
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={sessionStyles.sessionRow}
                onPress={() =>
                    this.setState({ modalVisibilie: true, session: item })
                }
            >
                <View>
                    <AsyncImage
                        style={{ width: 75, height: 75, borderRadius: 45 }}
                        image='/students/testProfileImage.png'
                    />
                </View>
                <View>
                    <Text style={sessionStyles.sessionNamePreviewText}>
                        {item.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name='circle'
                            type='font-awesome'
                            size={10}
                            containerStyle={{ marginRight: 5 }}
                        />
                        <Text style={sessionStyles.sessionPreviewText}>
                            {item.date}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name='circle'
                            type='font-awesome'
                            size={10}
                            containerStyle={{ marginRight: 5 }}
                        />
                        <Text style={sessionStyles.sessionPreviewText}>
                            {item.time}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name='circle'
                            type='font-awesome'
                            size={10}
                            containerStyle={{ marginRight: 5 }}
                        />
                        <Text style={sessionStyles.sessionPreviewText}>
                            {item.cost}
                        </Text>
                    </View>
                </View>
                <Icon
                    name='keyboard-arrow-right'
                    size={50}
                    color={primaryColor}
                />
            </TouchableOpacity>
        );
    };

    render() {
        const faqs = [
            {
                name: 'Alex Li',
                date: '05/20/20',
                location: 'Leavey Library',
                time: '2:30pm-3:12pm',
                class: 'Introduction to Programmings',
                cost: '$14.00',
            },
        ];
        return (
            <View style={sessionStyles.aboutContainer}>
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    isVisible={this.state.modalVisibilie}
                    swipeDirection={['down']}
                    onSwipeComplete={() =>
                        this.setState({ modalVisibilie: false, session: {} })
                    }
                >
                    <View style={sessionStyles.answerModalContainer}>
                        <Icon
                            name='times'
                            type='font-awesome'
                            onPress={() =>
                                this.setState({
                                    modalVisibilie: false,
                                    session: {},
                                })
                            }
                            containerStyle={sessionStyles.xStyle}
                        />
                        <Text style={sessionStyles.answerHeader}>
                            Session Details
                        </Text>
                        <Text style={sessionStyles.answerText}>
                            {this.state.session.name}
                        </Text>
                    </View>
                </Modal>
                <View style={sessionStyles.faqContainer}>
                    <FlatList
                        data={faqs}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </View>
        );
    }
}

const sessionStyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    sessionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        height: '120%',
        width: '90%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    sessionPreviewText: {
        fontSize: 15,
    },
    sectionText: {
        fontSize: 14,
        margin: 15,
    },
    sessionNamePreviewText: {
        marginBottom: 5,
        fontSize: 25,
    },
    faqContainer: {
        flex: 3,
        alignItems: 'center',
        width: '100%',
    },
    answerModalContainer: {
        height: '60%',
        width: '85%',
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 15,
    },
    button: {
        width: '85%',
        alignSelf: 'center',
        marginTop: '2%',
    },
    xStyle: {
        position: 'absolute',
        top: 5,
        left: 5,
    },
    answerHeader: {
        margin: 10,
        fontSize: 25,
        fontWeight: 'bold',
    },
    answerText: {
        fontSize: 15,
        marginHorizontal: 5,
    },
});
