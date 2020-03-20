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

    classSelected = (selectedItem) => {
      this.state.classRequest = selectedItem[0]
    }
    locationSelected = (selectedItem) => {
      this.state.locationRequest = selectedItem[0]
    }
  
    rowItem = (item) => (
      <View
        style={{
          flex: 1,
          borderBottomWidth: 0.5,
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingVertical: 20,
          borderBottomColor: '##dfdfdf'
        }}
      >
        <Text>{item}</Text>
      </View>
    )

    constructor() {
        super();
        this.ref = firebase.firestore().collection('tutors');
        this.state = {
            id: "",
            tutor: {},
            isLoading: true,
            uid: "",
            classRequest: "",
            locationRequest: "",
            value: 15,
        };
      }

      componentDidMount() {
        const tutorId =  this.props.navigation.getParam('tutorId', "");
        this.state.uid =  this.props.navigation.getParam('uid', "")
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

  toStudentMap = () => {this.props.navigation.navigate('StudentMap', {uid:this.state.uid})}
  requestTutor = () =>  {
    console.log(this.state.uid);
    const time = Date.now(); 
    this.ref.update({
      requests: Fire.firestore.FieldValue.arrayUnion({studentUid: this.state.uid, timestamp: time, location: this.state.locationRequest, estTime: this.state.value, class: this.state.classRequest})
    }).then((docRef) => {
      this.props.navigation.navigate('RequestWaiting', {tutorId: this.state.id, uid:this.state.uid,
        requestInfo: {studentUid: this.state.uid, timestamp: time, location: this.state.locationRequest, estTime: this.state.value, class: this.state.classRequest}
      })
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
            icon={
                <Icon
                name="arrow-left"
                size={20}
                color="white"
                />
            }
            iconLeft
            title="Back"
            onPress={this.toStudentMap}
            />
         
          </View>
          <View style={styles.tutorInfo}>
            <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
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
        </View>
        <View style={styles.slider}>
          <Slider
            value={this.state.value}
            maximumValue={90}
            minimumValue={15}
            step={15}
            onValueChange={value => this.setState({ value })}
          />
          <Text>Estimated Session Time: {this.state.value} minutes</Text>
        </View>

        <View style={styles.locationList}>
          <SelectableFlatlist
            data={this.state.tutor.locations}
            state={STATE.EDIT}
            multiSelect={false}
            itemsSelected={(selectedItem) => { this.locationSelected(selectedItem); }}
            initialSelectedIndex={[0]}
            cellItemComponent={(item, otherProps) => this.rowItem(item)}
          />
        </View>

        <View style={styles.classList}>
        <SelectableFlatlist
          data={this.state.tutor.classes}
          state={STATE.EDIT}
          multiSelect={false}
          itemsSelected={(selectedItem) => { this.classSelected(selectedItem); }}
          initialSelectedIndex={[0]}
          cellItemComponent={(item, otherProps) => this.rowItem(item)}
        />
    </View>

    

    <View style={styles.button}>
        <Button
          style={styles.requestButton}
          color="#6A7BD6"
            title="Request Tutor"
            onPress={this.requestTutor}
            />
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
    classList:{
      flex: 4,
    },
    locationList:{
      flex: 4,
    },
    slider:{
      flex:2,
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
    flex: 2,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    alignSelf:'center',
    position: 'absolute',
    marginTop:-70
  },
  name:{
    margin: "auto",
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  tutorInfo:{
    marginTop:10,
    alignItems: 'center',
    padding:60,
    flex: 5,
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
  backButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  requestButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#6A7BD6",
  },
});