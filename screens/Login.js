/* eslint-disable no-undef */
import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Image,
    SafeAreaView,
} from "react-native";
import { Button } from "./components/buttons";
import { connect } from "react-redux";
import { setUser } from "../redux/actions/userAction";
import store from "../redux/store";
import axios from "axios";
const logo = require("../assets/logo-09.png");
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//This allows us to dispatch the action through props in component
const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (userData) => {
            dispatch(setUser(userData));
        },
    };
};
class Login extends React.Component {
    handleSignIn = () => {
        if (!this.validate()) {
            return;
        }

        const { email, password } = this.state;
        const creds = {
            email: email,
            password: password,
        };

        //Calling login endpoint with user creds
        axios
            .get("/login", {
                params: {
                    email: email,
                    password: password,
                },
            })
            .then((res) => {
                //Login works successfull
                const userData = res.data;
                //Setting state in redux
                console.log("Got a response");
                this.props.setUser(userData);
                //Navigation
                //TODO: Remove userId from history
                console.log("Updated redux state");
                if (userData.type == "student") {
                    this.props.navigation.navigate("StudentNavigator");
                } else {
                    console.log("Made it here");
                    this.props.navigation.navigate("TutorNavigator");
                }
            })
            .catch((error) => {
                //This will contain the auth/wrong-password, etc.
                const errorCode = error.response.data;
                if (errorCode == "auth/invalid-email") {
                    this.setState({
                        loginError: "Please check your email format",
                    });
                } else if (errorCode == "auth/user-not-found") {
                    this.setState({
                        loginError: "No account found with that email",
                    });
                } else if (errorCode == "auth/wrong-password") {
                    this.setState({
                        loginError: "Wrong Password",
                    });
                }
            });
    };

    state = {
        email: "",
        password: "",
        loginError: "",
    };

    componentDidMount() {
        console.log(store.getState());
    }

    static navigationOptions = {
        headerShown: false,
    };

    validate() {
        var valid = true;
        this.setState({
            loginError: "",
        });
        if (this.state.email == "") {
            this.setState({ loginError: "Please enter an email" });
            valid = false;
        }
        if (this.state.password == "") {
            this.setState({ classesError: "Please enter an email" });
            valid = false;
        }
        return valid;
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <KeyboardAwareScrollView
                    style={{ backgroundColor: '#4c69a5' }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.screenContainer}
                    scrollEnabled={true}
                >
                    <SafeAreaView style={styles.screenContainer}>
                        {/* <Button
            text={"to student"}
            onPress={() => {
              userUid = "ocyNQp4r0vfcC13YE56iAzckTke2";
              this.props.navigation.navigate("StudentNavigator", {
                uid: "ocyNQp4r0vfcC13YE56iAzckTke2",
              });
            }}
          />
          <Button
            text={"to tutor"}
            onPress={() => {
              userUid = "XrwNEbLvWgPVXd1AuKq5sjFtBBB3";
              this.props.navigation.navigate("TutorNavigator", {
                uid: "XrwNEbLvWgPVXd1AuKq5sjFtBBB3",
              });
            }}
          /> */}
                        <View style={styles.titleContainer}>
                            <Image style={styles.logoImage} source={logo} />
                            <Text h1 style={styles.title}>
                                Brightr
                            </Text>
                        </View>
                        <View style={styles.loginInputContainer}>
                            <TextInput
                                style={styles.loginInput}
                                label='Email'
                                value={this.state.email}
                                onChangeText={(email) =>
                                    this.setState({ email })
                                }
                                placeholder='Email'
                                placeholderTextColor='white'
                                autoCapitalize='none'
                            />
                            <TextInput
                                style={styles.loginInput}
                                value={this.state.password}
                                onChangeText={(password) =>
                                    this.setState({ password })
                                }
                                placeholder='Password'
                                placeholderTextColor='white'
                                secureTextEntry={true}
                            />
                            <Text
                                style={styles.errorText}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                {this.state.loginError}
                            </Text>
                        </View>
                        <View style={styles.loginButtonContainer}>
                            <Button
                                type='secondary'
                                buttonStyle={styles.loginButton}
                                textStyle={styles.loginButtonText}
                                text='Login'
                                onPress={() => this.handleSignIn()}
                            />
                        </View>
                        <View style={styles.signUpButtonContainer}>
                            <Button
                                type='primary'
                                text="Don't have an account yet? Sign up"
                                buttonStyle={styles.signUpButton}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'SignUpBasicInfo',
                                    )
                                }
                            />
                        </View>
                    </SafeAreaView>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        );
    }
}

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: primaryColor,
        alignItems: 'stretch',
    },
    titleContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    logoImage: {
        height: '35%',
        width: '35%',
        resizeMode: 'contain',
    },
    title: {
        color: '#FFFFFF',
        fontStyle: 'italic',
        fontWeight: '900',
        fontSize: 60,
        alignSelf: 'center',
        margin: '10%',
    },
    loginInputContainer: {
        flex: 1,
        justifyContent: 'space-around',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    loginInput: {
        width: '90%%',
        padding: '3%',
        fontSize: 16,
        borderColor: secondaryColor,
        borderRadius: 15,
        borderWidth: 2,
        textAlign: 'left',
        color: secondaryColor,
    },
    loginButtonContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    loginButton: {
        height: '30%',
        justifyContent: 'center',
        padding: 1,
    },
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    signUpButton: {
        padding: '2%',
    },
    errorText: {
        color: 'red',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: '5%',
    },
});
