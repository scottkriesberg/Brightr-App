import React, { Component } from 'react';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import firebase from '../firebase';
import Fire from 'firebase';

export default class TutorPreview extends Component {

    constructor() {
        super();
        this.ref = firebase.firestore().collection('tutors');
        this.studentRef = firebase.firestore().collection('students');
        this.requestStatus = 0;
        this.state = {
            id: "",
            tutor: {},
            isLoading: true,
            uid: "",
            requestInfo: {},
            timer: 10,
        };
      }
      componentDidMount() {
        const tutorId =  this.props.navigation.getParam('tutorId', "");
        this.state.uid =  this.props.navigation.getParam('uid', "");
        this.state.requestInfo = this.props.navigation.getParam('requestInfo', {});
        this.ref = this.ref.doc(tutorId);
        this.studentRef = this.studentRef.doc(this.state.uid);
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
        // this.onCollectionUpdate();
        this.interval = setInterval(
            () => {
                this.setState((prevState)=> ({ timer: prevState.timer - 1 }));
                // console.log("we here",this.requestStatus)
        },
            1000
          );
      }

    //   onCollectionUpdate = () => {
    //       var test = 0;
    //     this.studentRef.onSnapshot(function(doc) {
    //         const data = doc.data();
    //         if(data != undefined){
    //             test = data.requestStatus;
    //             this.requestStatus = test;
    //             console.log(this.requestStatus)
    //             if(this.requestStatus == 1){ 
    //                 clearInterval(this.interval);
    //                 this.cancelRequest()
                    
    //               }
    //         }
    //     });
    //   }

      componentDidUpdate(){
        if(this.state.timer === 0){ 
          clearInterval(this.interval);
          this.cancelRequest()
        }
      }
      
      componentWillUnmount(){
       clearInterval(this.interval);
      }

      cancelRequest = () => {
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
            <Text> {this.state.timer} </Text>
          </View>
         
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 40,
    },
  backButton: {
    flex: 1,
  },
  activity:{
      flex:1,
  }
});