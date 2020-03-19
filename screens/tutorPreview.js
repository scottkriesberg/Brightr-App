import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';
import firebase from '../firebase'

export default class TutorPreview extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            tutor: {},
            isLoading: true,
            uid: "",
        };
      }

      componentDidMount() {
        const tutorId =  this.props.navigation.getParam('tutorId', "");
        this.state.uid =  this.props.navigation.getParam('uid', "")
        const ref = firebase.firestore().collection('tutors').doc(tutorId);
        ref.get().then((doc) => {
          if (doc.exists) {
            this.setState({
              tutor: doc.data(),
              key: doc.id,
              isLoading: false
            });
          } else {
            console.log("No such document!");
          }
        });
      }

  toStudentMap = () => {this.props.navigation.navigate('StudentMap', {uid:this.state.uid})}
  render() {
    if(this.state.isLoading){
        return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )
      }
    return (
      <View style={styles.container}>
          <View style={styles.header}>
          <Button
          style={styles.backButton}
          color="#6A7BD6"
            icon={
                <Icon
                name="arrow-left"
                size={15}
                color="white"
                />
            }
            iconLeft
            title="Back"
            onPress={this.toStudentMap}
            />
          </View>
          <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
          <View style={styles.body}>
            <Text style={styles.name}>{this.state.tutor.name}</Text>
            <Text style={styles.info}>{this.state.tutor.year} / {this.state.tutor.major}</Text>
            <Text style={styles.description}>{this.state.tutor.bio}</Text>
            <View style={styles.rating}>
                <Stars
                        style = {styles.rating}
                        default={Number(this.state.tutor.rating)}
                        count={5}
                        starSize={200}
                        fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                        emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                        halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]}/>}
                />
            </View>
            <View style={styles.bodyContent}>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    backButton:{
        marginTop: 50,
    },
    rating: {
        paddingTop: 10,
    },
    myStarStyle: {
        color: 'yellow',
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
      },
      myEmptyStarStyle: {
        color: 'white',
      },
  header:{
    backgroundColor: "#6A7BD6",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    margin: "auto",
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:10,
    alignItems: 'center',
    padding:60,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:60,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});