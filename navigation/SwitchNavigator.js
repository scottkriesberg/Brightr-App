import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Login from '../screens/Login';
import Landing from '../screens/Landing';
import SignUpBasicInfo from '../screens/SignUpBasicInfo';
import SignUpBioClasses from '../screens/SignUpBioClasses';
import StudentProfile from '../screens/student/StudentProfile';
import StudentMap from '../screens/student/StudentMap';
import StudentActiveRequests from '../screens/student/StudentActiveRequests';
import TutorPreview from '../screens/student/tutorPreview';
import RequestWaiting from '../screens/student/RequestWaiting';
import StudentChat from '../screens/student/StudentChat';
import StudentInProgress from '../screens/student/StudentInProgress';
import TutorProfile from '../screens/tutor/TutorProfile';
import TutorWorkSetUp from '../screens/tutor/TutorWorkSetUp';
import TutorIncomingRequests from '../screens/tutor/TutorIncomingRequests';
import TutorChat from '../screens/tutor/TutorChat';
import TutorInProgress from '../screens/tutor/TutorInProgress';
import TutorEditProfile from '../screens/tutor/TutorEditProfile';
import TutorRequestPreview from '../screens/tutor/TutorRequestPreview';
import { Icon } from 'react-native-elements';

const SignUpStackNavigator = createStackNavigator(
	{
		Landing: {
			screen: Landing
		},
		Login: { screen: Login },
		SignUpBasicInfo: { screen: SignUpBasicInfo },
		SignUpBioClasses: { screen: SignUpBioClasses }
	},
	{
		initialRouteName: 'Login'
	}
);

const StudentRequestNavigator = createStackNavigator(
	{
		StudentActiveRequests: {
			screen: StudentActiveRequests
		},
		RequestWaiting: {
			screen: RequestWaiting
		},
		StudentChat: {
			screen: StudentChat
		}
	},
	{
		initialRouteName: 'StudentActiveRequests'
	}
);

const StudentLiveNavigator = createStackNavigator(
	{
		StudentMap: {
			screen: StudentMap
		},
		TutorPreview: {
			screen: TutorPreview
		}
	},
	{
		initialRouteName: 'StudentMap'
	}
);

const StudentTabNavigator = createBottomTabNavigator(
	{
		StudentProfile: {
			screen: StudentProfile,
			navigationOptions: {
				tabBarLabel: 'Profile',
				tabBarIcon: ({ tintColor }) => <Icon name="user" type="font-awesome" color={tintColor} />
			}
		},
		StudentLiveNavigator: {
			screen: StudentLiveNavigator,
			navigationOptions: {
				tabBarLabel: 'Live',
				tabBarIcon: ({ tintColor }) => <Icon name="place" color={tintColor} />
			}
		},
		StudentRequestNavigator: {
			screen: StudentRequestNavigator,
			navigationOptions: {
				tabBarLabel: 'Requests',
				tabBarIcon: ({ tintColor }) => <Icon name="lightbulb-o" type="font-awesome" color={tintColor} />
			}
		}
	},
	{
		initialRouteName: 'StudentLiveNavigator'
	}
);

const StudentNavigator = createSwitchNavigator(
	{
		StudentTabNavigator: StudentTabNavigator,

		StudentInProgress: {
			screen: StudentInProgress
		}
	},
	{
		initialRouteName: 'StudentTabNavigator'
	}
);

const TutorRequestNavigator = createStackNavigator(
	{
		TutorIncomingRequests: {
			screen: TutorIncomingRequests
		},
		TutorRequestPreview: {
			screen: TutorRequestPreview
		},
		TutorChat: {
			screen: TutorChat
		}
	},
	{
		initialRouteName: 'TutorIncomingRequests'
	}
);

const TutorTabNavigator = createBottomTabNavigator(
	{
		TutorProfile: {
			screen: TutorProfile,
			navigationOptions: {
				tabBarLabel: 'Profile',
				tabBarIcon: ({ tintColor }) => <Icon name="user" type="font-awesome" color={tintColor} />
			}
		},
		TutorWorkSetUp: {
			screen: TutorWorkSetUp,
			navigationOptions: {
				tabBarLabel: 'Live',
				tabBarIcon: ({ tintColor }) => <Icon name="place" color={tintColor} />
			}
		},
		TutorRequestNavigator: {
			screen: TutorRequestNavigator,
			navigationOptions: {
				tabBarLabel: 'Requests',
				tabBarIcon: ({ tintColor }) => <Icon name="lightbulb-o" type="font-awesome" color={tintColor} />
			}
		}
	},
	{
		initialRouteName: 'TutorWorkSetUp'
	}
);

const TutorNavigator = createSwitchNavigator(
	{
		TutorTabNavigator: TutorTabNavigator,

		TutorIncomingRequests: {
			screen: TutorIncomingRequests
		},

		TutorInProgress: {
			screen: TutorInProgress
		},
		TutorEditProfile: {
			screen: TutorEditProfile
		}
	},
	{
		initialRouteName: 'TutorTabNavigator'
	}
);

const SwitchNavigator = createSwitchNavigator(
	{
		SignUpStackNavigator: SignUpStackNavigator,
		StudentNavigator: StudentNavigator,
		TutorNavigator: TutorNavigator
	},
	{
		initialRouteName: 'SignUpStackNavigator'
	}
);

export default createAppContainer(SwitchNavigator);
