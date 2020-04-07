import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PropTypes from "prop-types";

export class Rating extends Component {
  static props = {
    rating: PropTypes.any,
    style: PropTypes.any,
    size: PropTypes.any,
    color: PropTypes.any,
  };
  render() {
    return (
      <Text style={this.props.style}>
        {Math.round(this.props.rating * 10) / 10}/5
        <Icon name="star" type="Entypo" color="#F0CE49" size={20} />
      </Text>
    );
  }
}

export class ProfileHeadingInfo extends Component {
  static props = {
    rating: PropTypes.any,
    containerStyle: PropTypes.any,
    major: PropTypes.any,
    bio: PropTypes.any,
    name: PropTypes.any,
    image: PropTypes.any,
    year: PropTypes.any,
    bio: PropTypes.any,
  };
  render() {
    return (
      <View style={this.props.containerStyle || styles.container}>
        <Image
          resizeMode="cover"
          style={styles.avatar}
          source={this.props.image}
        />
        <View style={styles.basicText}>
          <Text adjustsFontSizeToFit style={styles.profileNameText}>
            {this.props.name}
          </Text>
          <Text adjustsFontSizeToFit style={styles.profileInfoText}>
            {this.props.year} / {this.props.major}
          </Text>
          <Text style={styles.profileInfoText}>GPA: {this.props.gpa}</Text>
          <Rating style={styles.profileInfoText} rating={this.props.rating} />
          <Text adjustsFontSizeToFit style={styles.bio}>
            <Text style={{ fontWeight: "bold", color: "#6A7BD6" }}> Bio: </Text>
            {this.props.bio}
          </Text>
        </View>
      </View>
    );
  }
}

export class ProfileTopBar extends Component {
  static props = {
    containerStyle: PropTypes.any,
    editPageFunction: PropTypes.any,
    logoutFunction: PropTypes.any,
    name: PropTypes.any,
  };
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={this.props.logoutFunction}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <Icon
          style={styles.editProfile}
          name="account-edit"
          type="MaterialCommunityIcons"
          color="black"
          size={40}
          // onPress={this.props.editPageFunction}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //ProfileHeaderInfo Styles
  container: {
    flex: 1,
    flexDirection: "column",
  },
  avatar: {
    position: "absolute",
    zIndex: 1,
    top: -110,
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "white",
    flex: 2,
    alignSelf: "center",
    aspectRatio: 1,
  },
  basicText: {
    marginTop: 60,
    flex: 5,
    alignItems: "center",
  },
  profileInfoText: {
    fontSize: 20,
    color: "#6A7BD6",
  },
  profileNameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6A7BD6",
  },
  selfInfo: {
    flex: 3,
    backgroundColor: "skyblue",
    flexDirection: "column",
    backgroundColor: "black",
  },
  bioContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "blue",
  },
  bio: {
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: "center",
  },
  //ProfileTopBar Styles
  header: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#6A7BD6",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    alignSelf: "flex-start",
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
    width: "20%",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    marginLeft: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 20,
  },
  profileText: {
    fontSize: 50,
  },
  editProfile: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});
