import React from 'react';
import { StyleSheet, View, Text, Button, FlatList } from 'react-native';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

// const firebase = require('firebase');
// require('firebase/firestore');
// require('firebase/auth')



// Careful, this is just an example, you need to implement the same ideas here in Chat.js then import Chat component to App.js and use it there.
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyA9BlybtbAeWWYmZLV6zagLf1ydaNyhiX4",
        authDomain: "test-e4daa.firebaseapp.com",
        projectId: "test-e4daa",
        storageBucket: "test-e4daa.appspot.com",
        messagingSenderId: "772187148804",
        appId: "1:772187148804:web:6a61d892ad4ea8c8fa1b51",
        measurementId: "G-2QTL1F2KBS"
      })
    }

  }

  componentDidMount() {
    this.referenceShoppingLists = firebase.firestore().collection("shoppinglists")

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
    });

    // create a reference to the active user's documents (shopping lists)
    this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);

    // listen for collection changes for current user
    this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
  }



  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  addList() {
    // add a new list to the collection
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
            <Text style={styles.item}>{item.name}: {item.items}</Text>}
        />

        <Button
          onPress={() => {
            this.addList();
          }}
          title="Add something"
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});

export default App;