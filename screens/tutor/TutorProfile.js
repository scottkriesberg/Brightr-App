import React, { Component } from "react";
import firebase from "../../firebase";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import {
  ProfileTopBar,
  ProfileHeadingInfo,
  ProfileClasses,
} from "../components/profile";
import Loading from "../components/utils.js";
import { Button } from "../components/buttons";
import { clearUser } from "../../redux/actions/userAction";
import { setUser } from "../../redux/actions/userAction";
import store from "../../redux/store";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => dispatch(clearUser()),
    setUser: (userData) => dispatch(setUser(userData)),
  };
};

class TutorHome extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      user: {},
      isLoading: true,
      isStudent: false,
    };
  }

  static navigationOptions = {
    headerShown: false,
    title: "",
  };

  componentDidMount() {
    console.log(store.getState());
    const userCreds = store.getState().user;
    this.setState({
      uid: userCreds.uid,
    });
    const ref = firebase.firestore().collection("tutors").doc(userCreds.uid);
    ref.get().then((doc) => {
      if (doc.exists) {
        firebase
          .firestore()
          .collection("students")
          .doc(this.state.uid)
          .get()
          .then((tutorDoc) => {
            if (tutorDoc.exists) {
              this.setState({
                user: doc.data(),
                key: doc.id,
                isLoading: false,
                isStudent: true,
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

  renderItem = ({ item }) => {
    return (
      <View style={styles.classRow}>
        <Text style={styles.classText}>
          {this.state.user.classes[item].department}:{" "}
          {this.state.user.classes[item].code}
        </Text>
        <Text style={styles.classNameText}>
          {this.state.user.classes[item].name}
        </Text>
      </View>
    );
  };

  logout = () => {
    this.props.clearUser();
    this.props.navigation.navigate("Login");
  };

  toWorkPage = () => {
    this.props.navigation.navigate("TutorWorkSetUp", { uid: this.state.uid });
  };

  toEditPage = () => {
    this.props.navigation.navigate("TutorEditProfile", { uid: this.state.uid });
  };

  studentSwitch = () => {
    const userCreds = store.getState().user;
    //TODO: Add error checking although this shoudln't fail
    firebase
      .firestore()
      .collection("students")
      .doc(userCreds.uid)
      .get()
      .then((doc) => {
        const reduxData = {
          email: userCreds.email,
          type: "student",
          uid: userCreds.uid,
          userData: doc.data(),
        };
        this.props.setUser(reduxData);
      });
  };

  toStudentAccount = () => {
    Alert.alert(
      "Cancel All Active Requests",
      "Switching to student account will cancel all your active requests",
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Switch",
          onPress: () => {
            //TODO: Set up redux flow to change into student account
            this.studentSwitch();
            this.cancelAll();
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  cancelAll = () => {
    firebase
      .firestore()
      .collection("tutors")
      .doc(this.state.uid)
      .update({ isLive: false, hourlyRate: 0, locations: [] })
      .then(() => {
        firebase
          .firestore()
          .collection("requests")
          .where("tutorUid", "==", this.state.uid)
          .where("status", "==", "pending")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              firebase
                .firestore()
                .collection("requests")
                .doc(doc.id)
                .update({ status: "declined" })
                .then((docRef) => {})
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            });
            this.props.navigation.navigate("StudentNavigator", {
              uid: this.state.uid,
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      });
  };

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        {this.state.isStudent ? (
          <ProfileTopBar
            containerStyle={styles.profileHeaderContainer}
            logoutFunction={this.logout}
            switchAccountFunc={this.toStudentAccount}
            switchText={"Switch to Student"}
            // editFunc={this.toEditPage}
          />
        ) : (
          <ProfileTopBar
            containerStyle={styles.profileHeaderContainer}
            logoutFunction={this.logout}
            editFunc={this.toEditPage}
          />
        )}
        <ProfileHeadingInfo
          rating={this.state.user.rating}
          year={this.state.user.year}
          major={this.state.user.major.code}
          gpa={this.state.user.gpa}
          name={this.state.user.name}
          containerStyle={styles.basicInfoContainer}
          avatarStyle={styles.avatar}
          image={{
            uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
          }}
          bio={this.state.user.bio}
        />
        <View style={styles.stats}>
          <Text style={styles.statsHeader}>Stats</Text>
          <Text style={styles.statsText}>
            Total Sessions: {this.state.user.numRatings}
          </Text>
          <Text style={styles.statsText}>
            Total Time: {this.state.user.timeWorked} minutes
          </Text>
          <Text style={styles.statsText}>
            Total Revenue: ${Math.round(this.state.user.moneyMade * 100) / 100}
          </Text>
          <Text style={styles.statsText}>
            Top Hourly Rate: ${this.state.user.topHourlyRate}/hr
          </Text>
          {this.state.user.numRatings != 0 ? (
            <Text style={styles.statsText}>
              Average Hourly Rate: $
              {Math.round(
                (this.state.user.moneyMade / this.state.user.timeWorked) *
                  60 *
                  100
              ) / 100}
              /hr
            </Text>
          ) : null}
        </View>
        <ProfileClasses items={this.state.user.classes} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: "#F8F8FF",
  },
  profileHeaderContainer: {
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: "#F8F8FF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  basicInfoContainer: {
    flex: 5,
    flexDirection: "row",
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5%",
  },
  avatar: {
    flex: 3,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: primaryColor,
    alignSelf: "center",
    aspectRatio: 1,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
  },
  bioContainer: {
    flex: 2,
    justifyContent: "center",
  },
  bio: {
    alignSelf: "center",
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "center",
  },
  stats: {
    flex: 5,
    backgroundColor: "#F8F8FF",
    justifyContent: "space-between",
  },
  statsHeader: {
    color: primaryColor,
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  statsText: {
    fontSize: 15,
    marginLeft: "4%",
  },
  classesHeader: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: primaryColor,
  },
  classes: {
    flex: 6,
    backgroundColor: "#F8F8FF",
    alignItems: "stretch",
  },
  classRow: {
    height: 50,
    marginBottom: 7,
    marginHorizontal: 10,
    backgroundColor: primaryColor,
    borderRadius: 5,
  },
  classText: {
    fontSize: 20,
    color: "#F8F8FF",
    fontWeight: "bold",
    marginLeft: "2%",
  },
  classNameText: {
    marginLeft: "2%",
    fontWeight: "bold",
    color: "lightgrey",
  },
  live: {
    marginTop: 5,
    flex: 1.5,
    alignItems: "center",
  },
});

export default connect(null, mapDispatchToProps)(TutorHome);
