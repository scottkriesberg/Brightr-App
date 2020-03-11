import React, { Component, useState } from 'react';
import { View, FlatList,StyleSheet, Image, Dimensions, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
//import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';
import firebase from '../firebase'

const map = require("../images/USC_Map.png"); 
const width = Dimensions.get("window").width;


class StudentMap extends Component {
    constructor() {
        super();
        this.ref = firebase.firestore().collection('tutors');
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          data: []
        };
      }

        renderItem = ({ item }) => {
            return (
              <TouchableOpacity style={styles.row} onPress = {() => this.props.navigation.navigate('TutorPreview', {tutor: item})}>
                    <Text>{item.name}</Text>
              </TouchableOpacity>
            )
          }
        
      componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }

      onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const { name  } = doc.data();
          data.push({
            key: doc.id,
            name,
          });
        });
        this.setState({
          data,
          isLoading: false,
       });
      }

  toProfile = () => {this.props.navigation.navigate('Profile')}

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
    <Icon style={styles.profileIcon} name='person' onPress={this.toProfile}/>
        <Image source={map} style={styles.map} />
    </View>
    <FlatList data = {this.state.data}
        renderItem={this.renderItem}
    />
    </View>
  )
}
}
 
const styles = StyleSheet.create({
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
        color: 'red'
      },
    profileIcon:{
        justifyContent: 'flex-end'
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