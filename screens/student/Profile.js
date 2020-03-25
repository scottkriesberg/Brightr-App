import React, { Component } from "react";
import { Button } from "react-native-elements";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../../firebase";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import ContainerStyles from "../../styles/container.js";
import TextStyles from "../../styles/text.js";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      user: {},
      isLoading: true
    };
  }

  componentDidMount() {
    this.state.uid = this.props.navigation.getParam("uid", "");
    const ref = firebase
      .firestore()
      .collection("students")
      .doc(this.state.uid);
    ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          user: doc.data(),
          key: doc.id,
          isLoading: false
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
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <View style={ContainerStyles.container}>
        <View style={ContainerStyles.profileHeaderContainer}>
          <Image
            style={ContainerStyles.avatarContainer}
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar6.png"
            }}
          />
        </View>
        <View style={ContainerStyles.profileContainer}>
          <Text style={TextStyles.name}>{this.state.user.name}</Text>
          <Text style={styles.info}>Senior / CSCI</Text>
          <Text style={styles.description}>
            I love developing apps in my free time. I interned at Google last
            summer. I hope can help you.
          </Text>
          <View style={styles.rating}>
            <Stars
              style={styles.rating}
              default={4.5}
              count={5}
              starSize={200}
              fullStar={<Icon name={"star"} style={[styles.myStarStyle]} />}
              emptyStar={
                <Icon
                  name={"star-o"}
                  style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                />
              }
              //   halfStar={
              //     <Icon name={"star-half"} style={[styles.myStarStyle]} />
              //   }
            />
          </View>
          <View style={styles.bodyContent} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 30
  },
  rating: {
    paddingTop: 10
  },
  myStarStyle: {
    color: "yellow",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: "white"
  },
  body: {
    marginTop: 10,
    alignItems: "center",
    padding: 60
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 60,
    backgroundColor: "white"
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  }
});
