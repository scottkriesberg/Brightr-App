import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import StudentProfile from '../screens/student/StudentProfile';
import StudentMap from '../screens/student/StudentMap';
import StudentActiveRequests from '../screens/student/StudentActiveRequests';
import StudentConnections from '../screens/student/StudentConnections';
import ConnectionRequestPreview from '../screens/student/ConnectionRequestPreview';
import TutorConnectedPreview from '../screens/student/TutorConnectedPreview';
import AddConnectionPreview from '../screens/student/AddConnectionPreview';
import AddConnections from '../screens/student/AddConnections';
import PendingConnections from '../screens/student/PendingConnections';
import PendingConnectionPreview from '../screens/student/PendingConnectionPreview';
import TutorPreview from '../screens/student/tutorPreview';
import StudentRequestRespond from '../screens/student/StudentRequestRespond';
import RequestWaiting from '../screens/student/RequestWaiting';
import StudentChat from '../screens/student/StudentChat';
import StudentInProgress from '../screens/student/StudentInProgress';
import About from '../screens/profile/About';
import Help from '../screens/profile/Help';
import Report from '../screens/profile/Report';
import Payment from '../screens/profile/Payment';
import Sessions from '../screens/profile/Sessions';
import EditProfile from '../screens/profile/EditProfile';

const StudentRequestNavigator = createStackNavigator(
    {
        StudentActiveRequests: {
            screen: StudentActiveRequests,
        },
        RequestWaiting: {
            screen: RequestWaiting,
        },
        StudentChat: {
            screen: StudentChat,
        },
        StudentRequestRespond: {
            screen: StudentRequestRespond,
        },
    },
    {
        initialRouteName: 'StudentActiveRequests',
    },
);

const StudentLiveNavigator = createStackNavigator(
    {
        StudentMap: {
            screen: StudentMap,
        },
        TutorPreview: {
            screen: TutorPreview,
        },
    },
    {
        initialRouteName: 'StudentMap',
    },
);

const StudentConnectionsNavigator = createStackNavigator(
    {
        StudentConnections: {
            screen: StudentConnections,
        },
        TutorConnectedPreview: {
            screen: TutorConnectedPreview,
        },
        AddConnections: {
            screen: AddConnections,
        },
        AddConnectionPreview: {
            screen: AddConnectionPreview,
        },
        PendingConnections: {
            screen: PendingConnections,
        },
        PendingConnectionPreview: {
            screen: PendingConnectionPreview,
        },
        ConnectionRequestPreview: {
            screen: ConnectionRequestPreview,
        },
    },
    {
        initialRouteName: 'StudentConnections',
    },
);

const StudentProfileNavigator = createStackNavigator(
    {
        StudentProfile: {
            screen: StudentProfile,
        },
        About: {
            screen: About,
        },
        Help: {
            screen: Help,
        },
        Report: {
            screen: Report,
        },
        EditProfile: {
            screen: EditProfile,
        },
        Payment: {
            screen: Payment,
        },
        Sessions: {
            screen: Sessions,
        },
    },
    {
        initialRouteName: 'StudentProfile',
    },
);

const StudentTabNavigator = createBottomTabNavigator(
    {
        StudentProfile: {
            screen: StudentProfileNavigator,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='user' type='font-awesome' color={tintColor} />
                ),
                lazy: false,
            },
        },
        StudentLiveNavigator: {
            screen: StudentLiveNavigator,
            navigationOptions: {
                tabBarLabel: 'Live',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='place' color={tintColor} />
                ),
                lazy: false,
            },
        },
        StudentRequestNavigator: {
            screen: StudentRequestNavigator,
            navigationOptions: {
                tabBarLabel: 'Requests',
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <View style={{ width: 24, height: 24, margin: 5 }}>
                            <Icon
                                name='lightbulb-o'
                                type='font-awesome'
                                color={tintColor}
                            />
                        </View>
                    );
                },
                lazy: false,
            },
        },
        StudentConnectionsNavigator: {
            screen: StudentConnectionsNavigator,
            navigationOptions: {
                tabBarLabel: 'Connections',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='users' type='font-awesome' color={tintColor} />
                ),
                lazy: false,
            },
        },
    },
    {
        initialRouteName: 'StudentLiveNavigator',
    },
);

const StudentNavigator = createSwitchNavigator(
    {
        StudentTabNavigator,
        StudentInProgress: {
            screen: StudentInProgress,
        },
    },
    {
        initialRouteName: 'StudentTabNavigator',
    },
);

export default createAppContainer(StudentNavigator);
