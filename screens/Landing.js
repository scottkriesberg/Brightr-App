import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Image
} from "react-native";
import firebase from "../firebase";
import ButtonStyles from "../styles/button.js";
import ContainerStyles from "../styles/container.js";
import ImageStyles from "../styles/image.js";
import TextStyles from "../styles/text.js";

const logo = require("../assets/logo-09.png");

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={ContainerStyles.landingContainer}>
        <Image style={ImageStyles.logoImage} source={logo} />
        <Text h1 style={TextStyles.title}>
          Brightr
        </Text>
        {/* Button container */}
        <View style={ContainerStyles.inputContainer}>
          <TouchableOpacity
            style={ButtonStyles.normalButton}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={ButtonStyles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ButtonStyles.normalButton}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={ButtonStyles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Landing;
