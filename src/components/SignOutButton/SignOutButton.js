import {Button, StyleSheet, View} from 'react-native'
import React from 'react'

const SignOutButton = ({title ="Kijelentkezés", onPress}) => {
  return (
    <View style={style.container}> 
      <Button 
        style={style.text}
        title={title}
        onPress={onPress}
        color="#d9534f"
      />
    </View>
  )
}


const style = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderRadius: 5,
        borderRadius:  10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    text: {fontWeight: "700",}
})

export default SignOutButton;