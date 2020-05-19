/* eslint-disable no-undef */
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { Button } from './buttons';
import AsyncImage from './AsyncImage';

export class ProfileIcon extends Component {
    static props = {
        containerStyle: PropTypes.any,
        textStyle: PropTypes.any,
        imageStyle: PropTypes.any,
        name: PropTypes.any,
        image: PropTypes.any,
        uid: PropTypes.any,
    };

    render() {
        console.log(this.props.image);
        return (
            <View
                style={[
                    this.props.containerStyle,
                    {
                        flex: 1,
                        flexDirection: 'coloumn',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <AsyncImage
                    style={[
                        this.props.imageStyle,
                        { width: 50, height: 50, borderRadius: 25 },
                    ]}
                    image={this.props.image}
                />
                <View
                    style={[
                        this.props.containerStyle,
                        {
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Text
                        style={[
                            this.props.textStyle,
                            {
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {this.props.name}
                    </Text>
                </View>
            </View>
        );
    }
}

export class Rating extends Component {
    static props = {
        containerStyle: PropTypes.any,
        rating: PropTypes.any,
        style: PropTypes.any,
        size: PropTypes.any,
        color: PropTypes.any,
    };

    render() {
        return (
            <Text style={this.props.style}>
                {Math.round(this.props.rating * 10) / 10}/5
                <Icon name="star" type="Entypo" color="#F0CE49" size={20} />
            </Text>
        );
    }
}

export class ProfileHeadingInfo extends Component {
    static props = {
        rating: PropTypes.any,
        containerStyle: PropTypes.any,
        avatarStyle: PropTypes.any,
        major: PropTypes.any,
        bio: PropTypes.any,
        name: PropTypes.any,
        image: PropTypes.any,
        year: PropTypes.any,
    };

    render() {
        return (
            <View style={this.props.containerStyle || styles.container}>
                <AsyncImage
                    style={[this.props.avatarStyle, { resizeMode: 'stretch' }]}
                    image={this.props.image}
                />
                <View style={styles.basicText}>
                    <Text adjustsFontSizeToFit style={styles.profileNameText}>
                        {this.props.name}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.profileInfoText}>
                        {this.props.year} / {this.props.major}
                    </Text>
                    {this.props.gpa ? (
                        <Text style={styles.profileInfoText}>
                            GPA: {this.props.gpa}
                        </Text>
                    ) : null}
                    <Rating
                        style={styles.profileInfoText}
                        rating={this.props.rating}
                    />
                    <Text adjustsFontSizeToFit style={styles.bio}>
                        <Text
                            style={{ fontWeight: 'bold', color: primaryColor }}
                        >
                            {' '}
                            Bio:{' '}
                        </Text>
                        {this.props.bio}
                    </Text>
                </View>
            </View>
        );
    }
}

export class ProfileTopBar extends Component {
    static props = {
        containerStyle: PropTypes.any,
        editFunc: PropTypes.any,
        name: PropTypes.any,
        switchAccountFunc: PropTypes.Func,
        switchText: PropTypes.any,
    };

    render() {
        return (
            <View style={this.props.containerStyle || styles.header}>
                <Button
                    type="secondary"
                    buttonStyle={{ width: '20%', height: '40%' }}
                    text="Logout"
                    onPress={this.props.logoutFunction}
                />
                {this.props.switchAccountFunc ? (
                    <Button
                        type="primary"
                        buttonStyle={{ width: '50%', height: '45%' }}
                        text={this.props.switchText}
                        onPress={this.props.switchAccountFunc}
                    />
                ) : null}

                <Icon
                    name="account-edit"
                    size={35}
                    color={primaryColor}
                    onPress={this.props.editFunc}
                />
            </View>
        );
    }
}

export class ProfilePreviousSessions extends Component {
    static props = {
        containerStyle: PropTypes.any,
        items: PropTypes.any,
        renderFunc: PropTypes.Func,
    };

    renderItem = ({ item }) => {
        let text;
        if (this.props.renderItemTextFunc) {
            text = this.props.renderItemTextFunc(item);
        } else {
            text = `${item.class.date} ${item.class.name}${' '(
                Math.round(item.sessionTime / 60000)
            )}min $${item.sessionCost}`;
        }
        return (
            <View style={styles.sessionRow}>
                <Text style={styles.sessionText}>{text}</Text>
            </View>
        );
    };

    render() {
        const { items } = this.props;
        return (
            <View style={this.props.containerStyle}>
                <Text style={styles.classesHeader}>Classes</Text>
                <FlatList
                    data={items}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.toString()}
                />
            </View>
        );
    }
}

export class ProfileClasses extends Component {
    static props = {
        containerStyle: PropTypes.any,
        items: PropTypes.any,
        renderFunc: PropTypes.Func,
    };

    renderItem = ({ item }) => {
        return (
            <View style={styles.classRow}>
                <Text style={styles.classText}>
                    {item.department}: {item.code}
                </Text>
                <Text style={styles.classNameText}>{item.name}</Text>
            </View>
        );
    };

    render() {
        const { items, renderFunc, containerStyle } = this.props;
        return (
            <View style={containerStyle || styles.classes}>
                <Text style={styles.classesHeader}>Classes</Text>
                <FlatList
                    data={items}
                    renderItem={renderFunc || this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // ProfileHeaderInfo Styles
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    basicText: {
        marginTop: 10,
        flex: 5,
        alignItems: 'center',
    },
    profileInfoText: {
        fontSize: 20,
        color: primaryColor,
    },
    profileNameText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: primaryColor,
    },
    selfInfo: {
        flex: 3,
        backgroundColor: 'skyblue',
        flexDirection: 'column',
    },
    bioContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'blue',
    },
    bio: {
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center',
    },
    // ProfileTopBar Styles
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F8F8FF',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '2%',
    },
    logoutButton: {
        alignSelf: 'flex-start',
        borderRadius: 15,
        borderColor: primaryColor,
        borderWidth: 1,
        width: '20%',
        height: '75%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        marginLeft: 5,
    },
    logoutButtonText: {
        color: primaryColor,
        fontSize: 20,
    },
    profileText: {
        fontSize: 50,
    },
    editProfile: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    // ProfileClasses Styles
    classesHeader: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: primaryColor,
    },
    classes: {
        flex: 6,
        backgroundColor: '#F8F8FF',
        alignItems: 'stretch',
    },
    classRow: {
        height: 50,
        marginBottom: 7,
        marginHorizontal: 10,
        backgroundColor: primaryColor,
        borderRadius: 5,
    },
    classText: {
        fontSize: 20,
        color: secondaryColor,
        fontWeight: 'bold',
        marginLeft: '2%',
    },
    classNameText: {
        marginLeft: '2%',
        fontWeight: 'bold',
        color: secondaryColor,
    },
});
