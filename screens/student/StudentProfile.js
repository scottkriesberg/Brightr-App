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
            <Icon name="close" size={25} color="#6A7BD6" />
          </TouchableOpacity>
        </View>
        <ProfileHeadingInfo
          rating={this.state.user.rating}
          year={this.state.user.year}
          major={this.state.user.major}
          name={this.state.user.name}
          containerStyle={styles.basicInfoContainer}
          avatarStyle={styles.avatar}
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
    backgroundColor: "#F8F8FF",
  },
  container: {
    flex: 1,
    backgroundColor: "#6A7BD6",
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
    borderColor: "#6A7BD6",
    alignSelf: "center",
    aspectRatio: 1,
  },
});
