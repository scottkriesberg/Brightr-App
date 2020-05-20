import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import TutorConnections from '../screens/tutor/TutorConnections';
import StudentConnectionPreview from '../screens/tutor/StudentConnectionPreview';
import TutorPendingConnections from '../screens/tutor/TutorPendingConnections';
import TutorPendingConnectionPreview from '../screens/tutor/TutorPendingConnectionPreview';
import TutorRequestRespond from '../screens/tutor/TutorRequestRespond';
import TutorRequestWaiting from '../screens/tutor/TutorRequestWaiting';
import TutorProfile from '../screens/tutor/TutorProfile';
import TutorWorkSetUp from '../screens/tutor/TutorWorkSetUp';
import TutorIncomingRequests from '../screens/tutor/TutorIncomingRequests';
import TutorChat from '../screens/tutor/TutorChat';
import TutorInProgress from '../screens/tutor/TutorInProgress';
import TutorEditProfile from '../screens/tutor/TutorEditProfile';
import TutorRequestPreview from '../screens/tutor/TutorRequestPreview';

const TutorRequestNavigator = createStackNavigator(
    {
        TutorIncomingRequests: {
            screen: TutorIncomingRequests,
        },
        TutorRequestPreview: {
            screen: TutorRequestPreview,
        },
        TutorChat: {
            screen: TutorChat,
        },
        TutorRequestRespond: {
            screen: TutorRequestRespond,
        },
        TutorRequestWaiting: {
            screen: TutorRequestWaiting,
        },
    },
    {
        initialRouteName: 'TutorIncomingRequests',
    },
);

const TutorProfiletNavigator = createStackNavigator(
    {
        TutorProfile: {
            screen: TutorProfile,
        },
        TutorEditProfile: {
            screen: TutorEditProfile,
        },
    },
    {
        initialRouteName: 'TutorProfile',
    },
);

const TutorConnectionsNavigator = createStackNavigator(
    {
        TutorConnections: {
            screen: TutorConnections,
        },
        StudentConnectionPreview: {
            screen: StudentConnectionPreview,
        },
        TutorPendingConnections: {
            screen: TutorPendingConnections,
        },
        TutorPendingConnectionPreview: {
            screen: TutorPendingConnectionPreview,
        },
    },
    {
        initialRouteName: 'TutorConnections',
    },
);

const TutorTabNavigator = createBottomTabNavigator(
    {
        TutorProfiletNavigator: {
            screen: TutorProfiletNavigator,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='user' type='font-awesome' color={tintColor} />
                ),
            },
        },
        TutorWorkSetUp: {
            screen: TutorWorkSetUp,
            navigationOptions: {
                tabBarLabel: 'Live',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='place' color={tintColor} />
                ),
            },
        },
        TutorRequestNavigator: {
            screen: TutorRequestNavigator,
            navigationOptions: {
                tabBarLabel: 'Requests',
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name='lightbulb-o'
                        type='font-awesome'
                        color={tintColor}
                    />
                ),
            },
        },
        TutorConnectionsNavigator: {
            screen: TutorConnectionsNavigator,
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
        initialRouteName: 'TutorWorkSetUp',
    },
);

const TutorNavigator = createSwitchNavigator(
    {
        TutorTabNavigator,
        TutorIncomingRequests: {
            screen: TutorIncomingRequests,
        },

        TutorInProgress: {
            screen: TutorInProgress,
        },
        TutorEditProfile: {
            screen: TutorEditProfile,
        },
    },
    {
        initialRouteName: 'TutorTabNavigator',
    },
);

export default createAppContainer(TutorNavigator);
