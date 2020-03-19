import React, { Component } from 'react';
import { Button,Slider } from 'react-native-elements';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';
import firebase from '../firebase';
import Fire from 'firebase';
import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';

export default class TutorPreview extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('tutors');
        this.state = {
            id: "",
            tutor: {},
            isLoading: true,
            uid: "",
            requestInfo: {},
        };
      }

      componentDidMount() {
        const tutorId =  this.props.navigation.getParam('tutorId', "");
        this.state.uid =  this.props.navigation.getParam('uid', "");
        this.state.requestInfo = this.props.navigation.getParam('requestInfo', {});
        this.ref = this.ref.doc(tutorId);
        this.ref.get().then((doc) => {
          if (doc.exists) {
            this.setState({
              tutor: doc.data(),
              id: doc.id,
              isLoading: false,
            });
          } else {
            console.log("No such document!");
          }
        });
      }

   cancelRequest = () => {
      console.log(this.state.requestInfo)
      this.ref.update({
        requests: Fire.firestore.FieldValue.arrayRemove({studentUid: this.state.uid, timestamp: this.state.requestInfo.timestamp, location: this.state.requestInfo.location, estTime: this.state.requestInfo.estTime, class: this.state.requestInfo.class})
      }).then((docRef) => {
        this.props.navigation.navigate('StudentMap', {uid:this.state.uid});
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false,
        });
      })
    }
  
  render() {
    if(this.state.isLoading){
        return(

            <View style={styles.container}>
          <Button
          style={styles.backButton}
            icon={
                <Icon
                name="arrow-left"
                size={20}
                color="white"
                />
            }
            iconLeft
            title="Cancel"
            onPress={this.cancelRequest}
            />
            <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
      </View>
          
        )
      }
    return (
         <View style={styles.container}>
         <View  style={styles.backButton}>
          <Button
         
            icon={
                <Icon
                name="arrow-left"
                size={20}
                color="white"
                />
            }
            iconLeft
            title="Cancel"
            onPress={this.cancelRequest}
            />
            </View>
            <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      flexDirection: 'column',
      paddingTop: 40,
    },
  backButton: {
    flex: 1,
  },
  activity:{
      flex:1,
  }
});