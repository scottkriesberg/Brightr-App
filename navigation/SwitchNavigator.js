import {
    createSwitchNavigator,createAppContainer
  } from 'react-navigation';
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import Profile from '../screens/Profile'
import StudentMap from '../screens/StudentMap'
import TutorPreview from '../screens/tutorPreview'
import RequestWaiting from '../screens/RequestWaiting'

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
        }
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator)