import {Button, StyleSheet, View} from 'react-native'
import React from 'react'

const SignInButton = ({title, onPress}) => {
  return (
    <View style={style.container}> 
      <Button 
        style={style.text}
        title={title}
        onPress={onPress}
      />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderRadius: 5
    },
    text: {}
})

export default SignInButton