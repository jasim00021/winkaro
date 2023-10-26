import {
  StyleSheet, Text, View,
  Image, Linking,
  StatusBar, Dimensions,
} from 'react-native'
import React from 'react'
import images from '../assets/images/images'
import { fonts } from '../styles/fonts'
import ButtonFull from '../components/ButtonFull'

const { width, height } = Dimensions.get('window')

const Update = ({ navigation, route }: any) => {

  const [app_link, setAppLink] = React.useState(route.params.app_link)


  return (
    <View className='flex-1 bg-white justify-center items-center p-4'>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <View className='flex-1 justify-center items-center'>
        <View className='w-[100%] justify-center items-center'>
          <Image source={images.update_available_2} className='bg-[lime]' style={{
            resizeMode: 'contain', width: width - 20, height: width * 4 / 5,
          }} />
          <Text className='mt-5' style={{ fontSize: 30, fontFamily: fonts.bold, color: 'black' }}>We're Better than ever</Text>
        </View>
        <View className='mt-16 justify-center items-center'>
          <Text className='text-center text-xl mt-2' style={{ fontFamily: fonts.bold, color: 'black' }}>Update Available!</Text>
          <Text className='text-center text-base mt-2' style={{ fontFamily: fonts.regular, color: 'black' }}>
            We added lots of new features and fixed some bugs to make your experience better!
          </Text>
          <Text className='text-center text-base mt-2' style={{ fontFamily: fonts.regular, color: 'black' }}>
            Please update the app to enjoy the new features!
          </Text>
        </View>
      </View>
      <View className='w-full'>
        <ButtonFull title='Update Now' onPress={
          () => {
            Linking.openURL(app_link)
          }
        } />
      </View>
    </View >
  )
}

export default Update

const styles = StyleSheet.create({})