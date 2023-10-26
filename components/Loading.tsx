import { StyleSheet, Text, View, Animated, TouchableOpacity, Easing, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import icons from '../assets/icons/icons';

const Loading = () => {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <View>
        <View>
          <Image source={icons.loading}
            style={{
              width: 80, height: 80, resizeMode: 'contain',
              borderRadius: 100, opacity: 0.7
            }} />
        </View>
      </View>
    </View>
  )
};

export default Loading;