import * as React from 'react';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-ico-material-design';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import LandingPage from './src/screens/LandingPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  /*const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  //Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if(initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; //unsubscribe on unmount
  }, []);

  if(initializing) return null;

  if(!user) {*/
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  //}


  /*return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="LandingPage" component={LandingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );*/
}
   /* return (
      <View style={styles.container}>
          <View>
             <SignIn/>
          </View>
      </View>
    );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC'
  },
});*/
