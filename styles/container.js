import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A7BD6",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  profileHeaderContainer: {
    backgroundColor: "#A8BBFF",
    height: "25%",
    width: "100%"
  },
  inputContainer: {
    width: "85%",
    alignItems: "center"
  },
  profileContainer: {
    padding: 40,
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    flex: 1,
    zIndex: -1
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    position: "absolute",
    alignSelf: "center",
    marginTop: 100
  }
});
