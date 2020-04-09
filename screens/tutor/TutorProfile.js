import React, { Component } from "react";
import { Button } from "react-native-elements";
import firebase from "../../firebase";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ProfileTopBar, ProfileHeadingInfo } from "../components/profile";
import Loading from "../components/utils.js";
import ButtonStyles from "../../styles/button";

class TutorHome extends Component {
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
    const ref = firebase.firestore().collection("tutors").doc(this.state.uid);
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
    this.props.navigation.navigate("Login");
  };

  toWorkPage = () => {
    this.props.navigation.navigate("TutorWorkSetUp", { uid: this.state.uid });
  };

  toEditPage = () => {
    this.props.navigation.navigate("TutorEditProfile", { uid: this.state.uid });
  };

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <ProfileTopBar
            logoutFunction={this.logout}
            editPageFunction={this.toEditPage}
          />
          <ProfileHeadingInfo
            rating={this.state.user.rating}
            year={this.state.user.year}
            major={this.state.user.major}
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
              People Helped: {this.state.user.numRatings}
            </Text>
            <Text style={styles.statsText}>
              Time Worked: {this.state.user.timeWorked} minutes
            </Text>
            <Text style={styles.statsText}>
              Money Made: ${this.state.user.moneyMade}
            </Text>
            <Text style={styles.statsText}>
              Top Hourly Rate: ${this.state.user.topHourlyRate}/hr
            </Text>
            <Text style={styles.statsText}>
              Average Hourly Rate: $
              {Math.round(
                (this.state.user.moneyMade / this.state.user.timeWorked) *
                  60 *
                  100
              ) / 100}
              /hr
            </Text>
          </View>

          <View style={styles.classes}>
            <Text style={styles.classesHeader}>Classes</Text>
            <FlatList
              data={Object.keys(this.state.user.classes)}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View style={styles.live}>
            <TouchableOpacity
              style={styles.liveButton}
              onPress={this.toWorkPage}
            >
              <Text style={styles.liveButtonText}>Set Up Live</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  basicInfoContainer: {
    flex: 10,
    backgroundColor: "#F8F8FF",
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
    flex: 4,
    backgroundColor: "#F8F8FF",
    justifyContent: "space-between",
  },
  statsHeader: {
    color: "#6A7BD6",
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  statsText: {
    fontSize: 20,
    marginLeft: "4%",
  },
  classesHeader: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#6A7BD6",
  },
  classes: {
    flex: 5,
    backgroundColor: "#F8F8FF",
    alignItems: "stretch",
  },
  classRow: {
    height: 60,
    marginBottom: 7,
    marginHorizontal: 10,
    backgroundColor: "#6A7BD6",
    borderRadius: 5,
  },
  classText: {
    fontSize: 30,
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
    flex: 1,
    alignItems: "center",
  },
  liveButton: {
    backgroundColor: "#6A7BD6",
    height: "100%",
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  liveButtonText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#F8F8FF",
  },
});

export default TutorHome;
