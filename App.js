import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-ico-material-design';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import LandingPage from './src/screens/LandingPage';

export default class App extends React.Component{
  
  render(){
    return (
      <View style={styles.container}>
          <View>
             <SignIn/>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC'
  },
});
