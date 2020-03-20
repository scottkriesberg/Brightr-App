import React, { Component, useState } from 'react';
import { View, FlatList,StyleSheet, ImageBackground, Dimensions, ActivityIndicator, Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Button, List, ListItem, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
//import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';
import firebase from '../firebase'

const map = require("../images/USC_Map.png"); 
const width = Dimensions.get("window").width;



function Location({ name, locationFilter, style }) {
    return (
        <View style={style}>
            <Icon  name='location-on' type='MaterialIcons' onPress={() => locationFilter(name)}/>
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
          query: {},
          location: 'All Locations',
          numActive: 0,
          isFilterVisable: false,
        };
      }
    toggleFilterWindow = () => {
        this.setState({ isFilterVisable: !this.state.isFilterVisable });
      };
    
      applyFilter = () => {
        // if (this.state.query.hasOwnProperty("rating")) {           
        //     this.state.query["rating"] = {
        //         field: "rating",
        //         op: ">",
        //         val: 3,
        //     };
        // }else{
        //     this.state.query["rating"] = {
        //         field: "rating",
        //         op: ">",
        //         val: 3,
        //     };
        // }
        // this.updateRef();
        // this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        this.toggleFilterWindow();
      };

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
    this.state.query = {};
    this.updateRef();
    this.ref.onSnapshot(this.onCollectionUpdate);
    this.state.location = "All Locations";
  }

  updateRef () {
      var newRef = firebase.firestore().collection('tutors');
      for (var i in this.state.query) {
            newRef = newRef.where(this.state.query[i].field, this.state.query[i].op, this.state.query[i].val); 
        }
         this.ref = newRef;
  }
  
  locationFilter = (name) => {
    if (this.state.query.hasOwnProperty("location")) {           
        this.state.query["location"] = {
            field: "locations",
            op: "array-contains",
            val: name,
        };
    }else{
        this.state.query["location"] = {
            field: "locations",
            op: "array-contains",
            val: name,
        };
    }
    this.updateRef();
    this.ref.onSnapshot(this.onCollectionUpdate);
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
  return(
      <View style={styles.container}>
        <View style={styles.filterModal}>
            <Modal isVisible={this.state.isFilterVisable}>
            <View>
                    <Text>Filter</Text>
                    <Button title="Apply" onPress={this.applyFilter} />
            </View>
            </Modal>
        </View>
    
        <View style={ styles.profileIcon}>
            <Icon  name='person' onPress={this.toProfile}/>
        </View>

        <View style={styles.mapContainer}>
            <TouchableWithoutFeedback onPress={this.clearLocations}>
            <ImageBackground source={map} style={styles.map}>
                    <Location name={'Leavey Library'} style={styles.leavy} locationFilter={this.locationFilter}></Location>
                    <Location name={'Cafe 84'} style={styles.cafe84} locationFilter={this.locationFilter}></Location>
                    <Location name={'USC Village Tables'} style={styles.village} locationFilter={this.locationFilter}></Location>
            </ImageBackground>
            </TouchableWithoutFeedback>
        </View>

        <View style={styles.midbar}>
                <Text style={styles.currentLocationText}> {this.state.location}    Tutors: {this.state.numActive}</Text>
                <Icon style={styles.filterButton} name='settings-input-component' type='Octicons' color='black' onPress={this.toggleFilterWindow}/>
        </View>

        <View style={styles.tutorList}>
            <FlatList data = {this.state.data}
                renderItem={this.renderItem}
            />
        </View>
    </View>
  )
}
}
 
const styles = StyleSheet.create({
    currentLocationText:{
        flex: 1,
    },
    filterButton:{
        flex: 1,
    },
    tutorInfo: {
        color: 'white'
    },
    tutorList: {
        flex: 5,
        backgroundColor: 'yellow',
    },
    mapContainer: {
        flex: 7,
    },
    midbar: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: 'blue',
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
        alignSelf: 'flex-start',
        flex: .5,
        backgroundColor: 'green',
    },
    map: {
        alignItems: 'stretch',
        justifyContent: 'center',
        flexGrow: 1,
      },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 40,
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