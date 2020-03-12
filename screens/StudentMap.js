import React, { Component, useState } from 'react';
import { View, FlatList,StyleSheet, ImageBackground, Dimensions, ActivityIndicator, Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';

//import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';
import firebase from '../firebase'

const map = require("../images/USC_Map.png"); 
const width = Dimensions.get("window").width;



function Location({ name, filter, style }) {
    return (
        <View style={style}>
            <Icon  name='location-on' type='MaterialIcons' onPress={() => filter(name)}/>
        </View>
    );
  }
  

class StudentMap extends Component {
    constructor() {
        super();
        this.ref = firebase.firestore().collection('tutors');
        this.unsubscribe = null;
        this.state = {
          uid: "",
          isLoading: true,
          data: [],
          location: 'All Locations',
          numActive: 0,
        };
      }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.row} onPress = {() => this.props.navigation.navigate('TutorPreview', {tutorId: item.id, uid:this.state.uid})}>
                <Text>{item.name}</Text>
                <View style={styles.tutorInfo}>
                    <Text>{item.rating}/5</Text>
                    <Text>{item.major}</Text>
                    <Text>{item.year}</Text>
                </View>
            </TouchableOpacity>
        )
        }
        
      componentDidMount() {
        this.state.uid =  this.props.navigation.getParam('uid', "");
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }

      onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const { 
            name, 
            major,
            rating,
            year,  } = doc.data();
          data.push({
            name,
            major,
            rating,
            year,
            id: doc.id,
          });
        });
        this.setState({
          data,
          isLoading: false,
          numActive: data.length
       });
      }

  toProfile = () => {
      this.props.navigation.navigate('Profile', {uid: this.state.uid})
  }
  clearLocations = () => {
    this.ref.onSnapshot(this.onCollectionUpdate);
    this.state.location = "All Locations";
  }
  
  filter = (name) => {
      this.ref.where("locations", "array-contains", name).onSnapshot(this.onCollectionUpdate);
      this.state.location = name;
  }

render(){
    if(this.state.isLoading){
        return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
        )
      }
      console.log(this.state.data);
  return(
    <View style={styles.container}>
    <View>
        <View style={ styles.profileIcon}>
            <Icon  name='person' onPress={this.toProfile}/>
        </View>
        <TouchableWithoutFeedback onPress={this.clearLocations}>
        <ImageBackground source={map} style={styles.map}>
                <Location name={'Leavey Library'} style={styles.leavy} filter={this.filter}></Location>
                <Location name={'Cafe 84'} style={styles.cafe84} filter={this.filter}></Location>
                <Location name={'USC Village Tables'} style={styles.village} filter={this.filter}></Location>
        </ImageBackground>
        </TouchableWithoutFeedback>
        <View style={styles.locationsHeader}>
            <Text>{this.state.location}    Tutors: {this.state.numActive}</Text>
            <Icon  name='settings-input-component' type='Octicons' color='black'/>
        </View>
    </View>
    <FlatList data = {this.state.data}
        renderItem={this.renderItem}
    />
    </View>
  )
}
}
 
const styles = StyleSheet.create({
    tutorInfo: {
        color: 'white'
    },
    locationsHeader: {
        marginBottom: 10,
        marginTop: 10,
    },
    village:{
        width:20,
        left: 209,
        top: -136
    },
    cafe84:{
        width:20,
        left: 20,
        top: 70
    },
    leavy:{
        width:20,
        left: 290,
        top: 70
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
        color: 'red'
      },
    profileIcon:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 40,
    },
    map: {
        alignItems: 'stretch',
        justifyContent: 'center',
        height: 450,
        width: width-40,
        marginTop: 40,
        marginLeft: 20,
      },
  container: {
    flex: 1,
    paddingTop: 40
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
 
export default StudentMap;