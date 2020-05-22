import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Button } from '../components/buttons';
import { Dropdown } from '../components/dropdown';

export default class Report extends Component {
    constructor() {
        super();
        this.state = {
            reportType: '',
            reportDescription: '',
        };
        this.reportTypes = ['User', 'Bug', 'Payment'];
    }

    submitReport = () => {
        if (
            this.state.reportType === '' ||
            this.state.reportDescription === ''
        ) {
            Alert.alert(
                'Incomplete Report',
                'Please fill out all of the sections before submitting a report',
                [
                    {
                        text: 'OK',
                    },
                ],
                {
                    cancelable: false,
                },
            );
        }
        console.log(this.state);
    };

    render() {
        return (
            <View style={reportSyles.aboutContainer}>
                <View style={reportSyles.descripitionContainer}>
                    <Dropdown
                        items={this.reportTypes}
                        getSelectedItem={(i) => {
                            this.setState({ reportType: i });
                        }}
                        modalHeaderText='Please select the report type'
                        intitalValue='Report Type'
                        dropdownTitle='Report Type'
                        titleStyle={{ color: 'black' }}
                        touchableStyle={{
                            borderColor: 'black',
                            borderWidth: 1,
                            height: 50,
                        }}
                    />
                </View>
                <View style={reportSyles.descripitionContainer}>
                    <Text style={reportSyles.SectionText}>Description</Text>
                    <TextInput
                        style={reportSyles.problemInput}
                        multiline
                        placeholder='Description'
                        onChangeText={(d) =>
                            this.setState({ reportDescription: d })
                        }
                        value={this.state.reportDescription}
                    />
                </View>
                <Button text='Submit' onPress={this.submitReport} />
            </View>
        );
    }
}

const reportSyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    descripitionContainer: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
    },
    headerText: {
        fontSize: 30,
        marginTop: 10,
    },
    sectionText: {
        fontSize: 14,
        margin: 15,
    },
    problemInput: {
        borderWidth: 1,
        borderColor: 'black',
        width: '75%',
        height: '30%',
    },
});
