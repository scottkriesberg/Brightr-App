import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../screens/Login';
import Landing from '../screens/Landing';
import SignUpBasicInfo from '../screens/SignUpBasicInfo';
import SignUpBioClasses from '../screens/SignUpBioClasses';
import StudentNavigator from './StudentNavigation';
import TutorNavigator from './TutorNavigation';

const SignUpStackNavigator = createStackNavigator(
    {
        Landing: {
            screen: Landing,
        },
        Login: { screen: Login },
        SignUpBasicInfo: { screen: SignUpBasicInfo },
        SignUpBioClasses: { screen: SignUpBioClasses },
    },
    {
        initialRouteName: 'Login',
    }
);

const MainNavigator = createSwitchNavigator(
    {
        SignUpStackNavigator,
        StudentNavigator,
        TutorNavigator,
    },
    {
        initialRouteName: 'SignUpStackNavigator',
    }
);

export default createAppContainer(MainNavigator);
