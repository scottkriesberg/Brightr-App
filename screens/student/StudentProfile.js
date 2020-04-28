import React, { Component } from "react";
import firebase from "../../firebase";
import { StyleSheet, View, Button, SafeAreaView } from "react-native";
import {
  ProfileTopBar,
  ProfileHeadingInfo,
  ProfileClasses,
} from "../components/profile";
import Loading from "../components/utils";
import { clearUser } from "../../redux/actions/userAction";
import { setUser } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import store from "../../redux/store";

//This allows us to dispatch the action through props in component
const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => dispatch(clearUser()),
    setUser: (userData) => dispatch(setUser(userData)),
  };
};
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      user: {},
      isLoading: true,
      isTutor: false,
    };
  }

  componentDidMount() {
    //Get UID from redux
    const userCreds = store.getState().user;
    const ref = firebase.firestore().collection("students").doc(userCreds.uid);
    ref.get().then((doc) => {
      if (doc.exists) {
        firebase
          .firestore()
          .collection("tutors")
          .doc(userCreds.uid)
          .get()
          .then((tutorDoc) => {
            if (tutorDoc.exists) {
              this.setState({
                user: doc.data(),
                key: doc.id,
                isLoading: false,
                isTutor: true,
              });
            } else {
              this.setState({
                user: doc.data(),
                key: doc.id,
                isLoading: false,
              });
            }
          });
      } else {
        console.log("No such document!");
      }
    });
  }

  logout = () => {
    this.props.clearUser();
    this.props.navigation.navigate("Login");
  };

  toStudentMap = () => {
    this.props.navigation.navigate("StudentMap", { uid: this.state.uid });
  };

  tutorSwitch = () => {
    //Get userid from store
    const userCreds = store.getState().user;
    //Get tutor info
    firebase
      .firestore()
      .collection("tutors")
      .doc(userCreds.uid)
      .get()
      .then((doc) => {
        const reduxData = {
          email: userCreds.email,
          type: "tutor",
          uid: userCreds.uid,
          userData: doc.data(),
        };
        this.props.setUser(reduxData);
      });
  };

  toTutorAccount = () => {
    //TODO: Need to set up switching to tutor profile on redux
    this.tutorSwitch();
    this.props.navigation.navigate("TutorNavigator", { uid: this.state.uid });
  };

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isTutor ? (
          <ProfileTopBar
            containerStyle={styles.profileHeaderContainer}
            logoutFunction={this.logout}
            switchAccountFunc={this.toTutorAccount}
            switchText={"Switch to Tutor"}
            closeFunc={this.toStudentMap}
          />
        ) : (
          <ProfileTopBar
            containerStyle={styles.profileHeaderContainer}
            logoutFunction={this.logout}
            closeFunc={this.toStudentMap}
          />
        )}

        <ProfileHeadingInfo
          rating={this.state.user.rating}
          year={this.state.user.year}
          major={this.state.user.major.code}
          name={this.state.user.name}
          containerStyle={styles.basicInfoContainer}
          avatarStyle={styles.avatar}
          image={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
          bio={this.state.user.bio}
        />
        <ProfileClasses items={this.state.user.classes} />
      </SafeAreaView>
    );
  }
}

export default connect(null, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  basicInfoContainer: {
    flex: 5,
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    flexDirection: "row",
    alignSelf: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
    justifyContent: "space-evenly",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
  },
  clearButton: {
    marginTop: 40,
    marginRight: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: primaryColor,
    alignSelf: "center",
    aspectRatio: 1,
  },
});
