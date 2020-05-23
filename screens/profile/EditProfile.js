import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { SearchableDropdown } from '../components/dropdown';

export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            year: '',
            gpa: '',
            major: null,
        };
        this.majors = [
            {
                name: 'Computer Science',
                code: 'CSCI',
            },
            {
                name: 'Computer Science Business Administration',
                code: 'CSBA',
            },
            {
                name: 'Business Administration',
                code: 'BUAD',
            },
            {
                name: 'Economics',
                code: 'ECON',
            },
        ];
        this.years = [
            {
                name: 'Freshman',
                value: 'Freshman',
            },
            {
                name: 'Sophmore',
                value: 'Sophmore',
            },
            {
                name: 'Junior',
                value: 'Junior',
            },
            {
                name: 'Senior',
                value: 'Senior',
            },
            {
                name: 'Graduate',
                value: 'Graduate',
            },
        ];
    }

    render() {
        return (
            <View style={aboutStyles.aboutContainer}>
                <View>
                    <Text>Change Profile Picture</Text>
                </View>
                <View>
                    <Text style={aboutStyles.textInputHeadingText}>
                        Full Name
                    </Text>
                    <TextInput
                        style={aboutStyles.inputBox}
                        value={this.state.name}
                        placeholderTextColor={primaryColor}
                        onChangeText={(name) => this.setState({ name })}
                        placeholder='Tommy Trojan'
                    />
                </View>
                <View>
                    <SearchableDropdown
                        items={this.majors}
                        getSelectedItem={(item) => {
                            this.setState({
                                major: { name: item.name, code: item.code },
                            });
                        }}
                        modalHeaderText='Please select your major'
                        intitalValue='Computer Science'
                        dropdownTitle='Major'
                    />
                </View>
                <View></View>
                <View>
                    <Text>Bio</Text>
                </View>
                <View>
                    <Text>Year</Text>
                </View>
                <View>
                    <Text>Classes</Text>
                </View>
            </View>
        );
    }
}

const aboutStyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'stretch',
    },
    headerText: {
        fontSize: 30,
        marginTop: 10,
    },
    sectionText: {
        fontSize: 14,
        margin: 15,
    },
    xStyle: {
        position: 'absolute',
        left: 15,
        top: 15,
    },
});
