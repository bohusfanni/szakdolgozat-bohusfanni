import * as React from 'react';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-ico-material-design';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import LandingPage from './src/screens/LandingPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FIREBASE_APP, FIREBASE_AUTH } from './src/config/firebase';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  
  //Handle user state changes
  React.useEffect(() => {
   onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
    });
}, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        {user ? <Stack.Screen name="LandingPage" component={LandingPage}/> : <Stack.Screen name="SignIn" component={SignIn} /> }
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );


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
