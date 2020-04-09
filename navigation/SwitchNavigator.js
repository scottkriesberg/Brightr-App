import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../screens/Login';
import Landing from '../screens/Landing';
import SignUpChoice from '../screens/SignupChoice';
import SignUpBasicInfo from '../screens/SignUpBasicInfo';
import SignUpBioClasses from '../screens/SignUpBioClasses';
import StudentProfile from '../screens/student/StudentProfile';
import StudentMap from '../screens/student/StudentMap';
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

const SignUpStackNavigator = createStackNavigator(
	{
		Login: { screen: Login },
		SignUpBasicInfo: { screen: SignUpBasicInfo },
		SignUpBioClasses: { screen: SignUpBioClasses }
	},
	{
		initialRouteName: 'Login'
	}
);

const SwitchNavigator = createSwitchNavigator(
	{
		Landing: {
			screen: Landing
		},
		Login: {
			screen: Login
		},
		StudentProfile: {
			screen: StudentProfile
		},
		StudentMap: {
			screen: StudentMap
		},
		TutorPreview: {
			screen: TutorPreview
		},
		RequestWaiting: {
			screen: RequestWaiting
		},
		TutorProfile: {
			screen: TutorProfile
		},
		TutorWorkSetUp: {
			screen: TutorWorkSetUp
		},
		TutorIncomingRequests: {
			screen: TutorIncomingRequests
		},
		TutorChat: {
			screen: TutorChat
		},
		TutorInProgress: {
			screen: TutorInProgress
		},
		StudentChat: {
			screen: StudentChat
		},
		StudentInProgress: {
			screen: StudentInProgress
		},
		TutorEditProfile: {
			screen: TutorEditProfile
		},
		TutorRequestPreview: {
			screen: TutorRequestPreview
		},
		SignUpStackNavigator: SignUpStackNavigator
	},
	{
		initialRouteName: 'SignUpStackNavigator'
	}
);

export default createAppContainer(SwitchNavigator);
