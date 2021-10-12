import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import firebase from 'firebase'
import { View, Text } from 'react-native'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
import MainScreen from './components/Main'

const store = createStore(rootReducer, applyMiddleware(thunk));
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_I
};


if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}


const Stack = createStackNavigator();


export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state
    if(!loaded){
      return(
        <View style = {{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={ LandingScreen } options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={ RegisterScreen } />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <MainScreen />
      </Provider>
      
      
    )

    
  }
}

export default App
