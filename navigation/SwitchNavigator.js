import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Profile from '../screens/student/Profile';
import StudentMap from '../screens/student/StudentMap';
import TutorPreview from '../screens/student/tutorPreview';
import RequestWaiting from '../screens/student/RequestWaiting';
import StudentChat from '../screens/student/StudentChat'
import StudentInProgress from '../screens/student/StudentInProgress'
import TutorHome from '../screens/tutor/TutorHome';
import TutorWorkSetUp from '../screens/tutor/TutorWorkSetUp';
import TutorIncomingRequests from '../screens/tutor/TutorIncomingRequests';
import TutorChat from '../screens/tutor/TutorChat';
import TutorInProgresss from '../screens/tutor/TutorInProgress'


const SwitchNavigator = createSwitchNavigator(
	{
		Login: {
			screen: Login
		},
		Signup: {
			screen: Signup
		},
		Profile: {
			screen: Profile
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
		TutorHome: {
			screen: TutorHome
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
		TutorInProgresss: {
			screen: TutorInProgresss
		},
		StudentChat: {
			screen: StudentChat
		},
		StudentInProgress: {
			screen: StudentInProgress
		},

	},
	{
		initialRouteName: 'Login'
	}
);

export default createAppContainer(SwitchNavigator);
