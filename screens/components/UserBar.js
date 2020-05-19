/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { Rating } from './profile';
import AsyncImage from './AsyncImage';

export class UserBar extends Component {
    static props = {
        containerStyle: PropTypes.any,
        textStyle: PropTypes.any,
        imageStyle: PropTypes.any,
        user: PropTypes.any,
        onPressFunc: PropTypes.any,
        rate: PropTypes.any,
        userId: PropTypes.any,
    };

    render() {
        const { user, userId } = this.props;
        let classList = '';
        for (let i = 0; i < user.classesArray.length; i++) {
            classList += `${user.classesArray[i]}, `;
        }
        classList = classList.substring(0, classList.length - 2);
        return (
            <TouchableOpacity
                style={[
                    this.props.containerStyle,
                    {
                        backgroundColor: secondaryColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        borderWidth: 1,
                        borderColor: primaryColor,
                    },
                ]}
                onPress={this.props.onPressFunc}
            >
                <View>
                    <AsyncImage
                        style={[
                            this.props.imageStyle,
                            {
                                height: 70,
                                width: 70,
                                borderRadius: 63,
                                borderWidth: 2.5,
                                borderColor: primaryColor,
                                margin: 20,
                            },
                        ]}
                        image={`demoImages/${userId}.jpg`}
                    />
                </View>
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
                        {user.name}
                    </Text>
                    <Rating rating={user.rating} />
                    <Text adjustsFontSizeToFit={true} numberOfLines={2}>
                        {user.major.code} / {user.year}
                    </Text>
                    {this.props.rate ? (
                        <Text>${user.hourlyRate}/hour</Text>
                    ) : null}
                </View>
                <View
                    style={{
                        flex: 1,
                        alignSelf: 'center',
                        justifyContent: 'center',
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
                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Icon
                        name="keyboard-arrow-right"
                        size={40}
                        color={primaryColor}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
