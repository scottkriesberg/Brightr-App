import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A7BD6",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  landingContainer: {
    flex: 1,
    backgroundColor: "#6A7BD6",
    alignItems: "center",
    justifyContent: "center"
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
  },
  previewImage: {
    height: 70,
    width: 70,
    borderRadius: 63,
    borderWidth: 2.5,
    borderColor: "#6A7BD6",
    margin: 20
  },
  tutorPreviewContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#6A7BD6"
  }
});
