import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { ListButton } from '../components/buttons';

export default class Help extends Component {
    constructor() {
        super();
        this.state = { modalVisibilie: false, answer: '' };
    }

    renderItem = ({ item }) => {
        return (
            <ListButton
                textStyle={helpStyles.buttonText}
                buttonStyle={helpStyles.button}
                text={item.question}
                onPress={() =>
                    this.setState({ modalVisibilie: true, answer: item.answer })
                }
            />
        );
    };

    render() {
        const faqs = [
            {
                question: 'Can I be a tutor and a student?',
                answer:
                    'Yes you can be just a just a tutor, just a student or both.',
            },
            {
                question: 'How does payments work?',
                answer:
                    'Once you enter your payment info, we take care of the rest. For each transaction we take a small percentage. If you ever need to change your payment information, please go to they payment tab in the profile page.',
            },
            {
                question: "What if a the other person won't end the session?",
                answer:
                    'While this is very rare, it can happen. Please use the emergency end session button and then report the user.',
            },
            {
                question: 'How do tutors become verified?',
                answer: 'Tutors get verified by the university',
            },
        ];
        return (
            <View style={helpStyles.aboutContainer}>
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    isVisible={this.state.modalVisibilie}
                    swipeDirection={['down']}
                    onSwipeComplete={() =>
                        this.setState({ modalVisibilie: false, answer: '' })
                    }
                >
                    <View style={helpStyles.answerModalContainer}>
                        <Icon
                            name='times'
                            type='font-awesome'
                            onPress={() =>
                                this.setState({ modalVisibilie: false })
                            }
                            containerStyle={helpStyles.xStyle}
                        />
                        <Text style={helpStyles.answerHeader}>Answer</Text>
                        <Text style={helpStyles.answerText}>
                            {this.state.answer}
                        </Text>
                    </View>
                </Modal>
                <View style={helpStyles.faqContainer}>
                    <Text style={helpStyles.headerText}>FAQs</Text>
                    <FlatList
                        data={faqs}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={helpStyles.contactContainer}>
                    <Text style={helpStyles.headerText}>Contact</Text>
                    <Text style={helpStyles.sectionText}>
                        Phone: 555-555-5555
                    </Text>
                    <Text style={helpStyles.sectionText}>
                        Email: brightrtutoring@gmail.com
                    </Text>
                    <Text style={helpStyles.sectionText}>
                        To report a problem or user please use the report page
                    </Text>
                </View>
            </View>
        );
    }
}

const helpStyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 40,
        marginTop: 10,
    },
    sectionText: {
        fontSize: 14,
        margin: 15,
    },
    faqContainer: {
        flex: 3,
        alignItems: 'center',
    },
    contactContainer: {
        flex: 2,
        alignItems: 'center',
    },
    answerModalContainer: {
        height: '30%',
        width: '70%',
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
