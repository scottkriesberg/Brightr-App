import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button
} from "react-native";
import firebase from "../firebase";
import ButtonStyles from "../styles/button.js";
import ContainerStyles from "../styles/container.js";
import InputStyles from "../styles/input.js";
import TextStyles from "../styles/text.js";

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    <View style={ContainerStyles.container}>
      <Text h1 style={TextStyles.title}>
        Brightr
      </Text>
      <TouchableOpacity
        style={ButtonStyles.normalButton}
        onPress={() => this.props.navigation.navigate("Login")}
      >
        <Text style={ButtonStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>;
  }
}

export default Landing;
