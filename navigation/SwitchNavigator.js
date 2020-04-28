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
import StudentConnections from '../screens/student/StudentConnections';
import TutorConnections from '../screens/tutor/TutorConnections';
import StudentConnectionPreview from '../screens/tutor/StudentConnectionPreview';
import ConnectionRequestPreview from '../screens/student/ConnectionRequestPreview';
import TutorPendingConnections from '../screens/tutor/TutorPendingConnections';
import TutorPendingConnectionPreview from '../screens/tutor/TutorPendingConnectionPreview';
import TutorConnectedPreview from '../screens/student/TutorConnectedPreview';
import AddConnectionPreview from '../screens/student/AddConnectionPreview';
import AddConnections from '../screens/student/AddConnections';
import PendingConnections from '../screens/student/PendingConnections';
import PendingConnectionPreview from '../screens/student/PendingConnectionPreview';
import TutorPreview from '../screens/student/tutorPreview';
import TutorRequestRespond from '../screens/tutor/TutorRequestRespond';
import StudentRequestRespond from '../screens/student/StudentRequestRespond';
import RequestWaiting from '../screens/student/RequestWaiting';
import TutorRequestWaiting from '../screens/tutor/TutorRequestWaiting';
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
import { View, Text } from 'react-native';

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
		},
		StudentRequestRespond: {
			screen: StudentRequestRespond
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

const StudentConnectionsNavigator = createStackNavigator(
	{
		StudentConnections: {
			screen: StudentConnections
		},
		TutorConnectedPreview: {
			screen: TutorConnectedPreview
		},
		AddConnections: {
			screen: AddConnections
		},
		AddConnectionPreview: {
			screen: AddConnectionPreview
		},
		PendingConnections: {
			screen: PendingConnections
		},
		PendingConnectionPreview: {
			screen: PendingConnectionPreview
		},
		ConnectionRequestPreview: {
			screen: ConnectionRequestPreview
		}
	},
	{
		initialRouteName: 'StudentConnections'
	}
);

const StudentTabNavigator = createBottomTabNavigator(
	{
		StudentProfile: {
			screen: StudentProfile,
			navigationOptions: {
				tabBarLabel: 'Profile',
				tabBarIcon: ({ tintColor }) => <Icon name="user" type="font-awesome" color={tintColor} />,
				lazy: false
			}
		},
		StudentLiveNavigator: {
			screen: StudentLiveNavigator,
			navigationOptions: {
				tabBarLabel: 'Live',
				tabBarIcon: ({ tintColor }) => <Icon name="place" color={tintColor} />,
				lazy: false
			}
		},
		StudentRequestNavigator: {
			screen: StudentRequestNavigator,
			navigationOptions: {
				tabBarLabel: 'Requests',
				// tabBarIcon: ({ tintColor }) => <Icon name="lightbulb-o" type="font-awesome" color={tintColor} />,
				tabBarIcon: ({ tintColor }) => {
					return (
						<View style={{ width: 24, height: 24, margin: 5 }}>
							<Icon name="lightbulb-o" type="font-awesome" color={tintColor} />
							{requestNum > 0 && (
								<View
									style={{
										// On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
										position: 'absolute',
										right: -6,
										top: -3,
										backgroundColor: 'red',
										borderRadius: 6,
										width: 12,
										height: 12,
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
										{requestNum}
									</Text>
								</View>
							)}
						</View>
					);
				},
				lazy: false
			}
		},
		StudentConnectionsNavigator: {
			screen: StudentConnectionsNavigator,
			navigationOptions: {
				tabBarLabel: 'Connections',
				tabBarIcon: ({ tintColor }) => <Icon name="users" type="font-awesome" color={tintColor} />,
				lazy: false
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
		},
		TutorRequestRespond: {
			screen: TutorRequestRespond
		},
		TutorRequestWaiting: {
			screen: TutorRequestWaiting
		}
	},
	{
		initialRouteName: 'TutorIncomingRequests'
	}
);

const TutorProfiletNavigator = createStackNavigator(
	{
		TutorProfile: {
			screen: TutorProfile
		},
		TutorEditProfile: {
			screen: TutorEditProfile
		}
	},
	{
		initialRouteName: 'TutorProfile'
	}
);

const TutorConnectionsNavigator = createStackNavigator(
	{
		TutorConnections: {
			screen: TutorConnections
		},
		StudentConnectionPreview: {
			screen: StudentConnectionPreview
		},
		// TutorAddConnections: {
		// 	screen: TutorAddConnections
		// },
		TutorPendingConnections: {
			screen: TutorPendingConnections
		},
		TutorPendingConnectionPreview: {
			screen: TutorPendingConnectionPreview
		}
		// PendingConnectionPreview: {
		// 	screen: PendingConnectionPreview
		// }
	},
	{
		initialRouteName: 'TutorConnections'
	}
);

const TutorTabNavigator = createBottomTabNavigator(
	{
		TutorProfiletNavigator: {
			screen: TutorProfiletNavigator,
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
		},
		TutorConnectionsNavigator: {
			screen: TutorConnectionsNavigator,
			navigationOptions: {
				tabBarLabel: 'Connections',
				tabBarIcon: ({ tintColor }) => <Icon name="users" type="font-awesome" color={tintColor} />,
				lazy: false
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
