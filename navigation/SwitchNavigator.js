import {
    createSwitchNavigator,createAppContainer
  } from 'react-navigation';
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import Profile from '../screens/Profile'
import StudentMap from '../screens/StudentMap'
import TutorPreview from '../screens/tutorPreview'
import RequestWaiting from '../screens/RequestWaiting'
import TutorHome from '../screens/TutorHome'
import TutorWorkSetUp from '../screens/TutorWorkSetUp'

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
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator)