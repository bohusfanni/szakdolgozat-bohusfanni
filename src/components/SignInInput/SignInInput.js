import { View, TextInput, StyleSheet} from 'react-native'
import React from 'react'
import { ReactNativeFirebase } from '@react-native-firebase/app';

const SignInInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput 
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '120%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal : 5,
    marginVertical: 5,
  },
  input: {
    fontSize: 20
  }

});

export default SignInInput;