import { View, Button, StyleSheet } from 'react-native'
import React from 'react'

const CustomButton = ({title}) => {
  return (
    <View style={style.container}> 
      <Button 
        style={style.text}
        title={title}
      />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    text: {}
})

export default CustomButton