import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../../firebase";
import { StyleSheet, View, Button } from "react-native";
import ContainerStyles from "../../styles/container";
import ButtonStyles from "../../styles/button";
import { Rating, ProfileHeadingInfo } from "../components/profile";
import Loading from "../components/utils";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      user: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    this.state.uid = this.props.navigation.getParam("uid", "");
    const ref = firebase.firestore().collection("students").doc(this.state.uid);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          user: doc.data(),
          key: doc.id,
          isLoading: false,
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  toStudentMap = () => {
    this.props.navigation.navigate("StudentMap", { uid: this.state.uid });
  };
  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={this.toStudentMap}
          >
            <Icon name="close" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <ProfileHeadingInfo
          rating={this.state.user.rating}
          year={this.state.user.year}
          major={this.state.user.major}
          name={this.state.user.name}
          containerStyle={styles.basicInfoContainer}
          image={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
          bio={this.state.user.bio}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  basicInfoContainer: {
    flex: 5,
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#6A7BD6",
    alignItems: "stretch",
    justifyContent: "space-evenly",
  },
  buttonContainer: {
    height: 200,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  clearButton: {
    color: "white",
    marginRight: 5,
    marginTop: 30,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#6A7BD6",
    justifyContent: "center",
    alignItems: "center",
  },
});
