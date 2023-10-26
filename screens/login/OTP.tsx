import {
  StyleSheet, Text, View,
  SafeAreaView, StatusBar,
  ScrollView, Image, TextInput,
  Alert, TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import images from '../../assets/images/images'
import { colors } from '../../styles/colors'
import ButtonFull from '../../components/ButtonFull'
import buttons from '../../styles/buttons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../appData'
import DeviceInfo from 'react-native-device-info'
import { fonts } from '../../styles/fonts'
import CustomModal from '../../components/CustomModal'
import { getDefaultHeader } from '../methods'


const OTP = ({ route, navigation }: any) => {
  const { phone, signUp } = route.params
  let [deviceName, setDeviceName] = React.useState<string>('')
  const [otp, setOtp] = React.useState<string>('')
  const [isValidOtp, setIsValidOtp] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [buttonText, setButtonText] = React.useState<string>('Verify OTP')
  const [modals, setModals] = React.useState<any>([])
  let [deviceId, setDeviceId] = useState('')


  useEffect(() => {
    setIsValidOtp(otp.length === 6)
  }, [otp])

  useEffect(() => {
    DeviceInfo.getDeviceName().then(name => { setDeviceName(name) });
    DeviceInfo.getUniqueId().then(id => {
      setDeviceId(id)
    })
  }, [])

  return (
    <SafeAreaView style={styles.main}>
      <CustomModal modals={modals} updater={setModals} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.top} >
          <Image source={images.two_step_verify} style={styles.topImage} />
        </View>
        <Text style={styles.title}>OTP Verification</Text>
        <TextInput
          style={styles.otpInput}
          placeholderTextColor={colors.textLighter}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={handelOtpInput}
          maxLength={6}
        // autoFocus={true}
        />

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>OTP sent to {phone}.</Text>
          {!signUp &&
            <TouchableOpacity onPress={() => { navigation.replace('LogIn') }}><Text style={{ color: colors.accent, fontFamily: fonts.medium }}> Edit Number?</Text></TouchableOpacity>
          }
        </View>

        <View style={styles.buttonsContainer} >
          <TouchableOpacity
            style={[buttons.full,
            { opacity: isValidOtp ? 1 : 0.5, }]}
            onPress={handelOtpSubmit} activeOpacity={0.8}
            disabled={isValidOtp && !isSubmitting ? false : true}
          >
            <Text style={{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium }}>{buttonText}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>Didn't receive OTP?</Text>
            <TouchableOpacity onPress={() => { }}><Text style={{ color: colors.accent, fontFamily: fonts.medium }}> Resend OTP</Text></TouchableOpacity>
          </View>
        </View>

        {/* <Text style={{ textAlign: 'center', color: colors.text, marginTop: 20 }}>
          By continuing, you agree to our <Text style={{ color: colors.accent }}>Terms of Service</Text> and <Text style={{ color: colors.accent }}>Privacy Policy</Text>
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  )
  function handelOtpSubmit() {
    submit()
  }
  function handelOtpInput(text: string) {
    setOtp(text)
    if (text.length === 6) {
      submit(text)
    }
  }

  async function submit(lastOtp = otp) {
    setButtonText('Verifying...')
    setIsSubmitting(true)
    // Create a form data
    const formData = new FormData()
    formData.append('phone', phone)
    formData.append('otp', lastOtp)
    formData.append('device_name', deviceName)
    formData.append('device_id', deviceId)
    console.log(lastOtp, phone)

    fetch(API_URL.verify_otp, {
      method: 'POST',
      body: formData,
      headers: getDefaultHeader(false)
    }).then(res => res.json()).then(async res => {
      console.log(res)
      if (res.status === true || res.status === 'true') {
        // Store the auth token in async storage and navigate to home screen
        await AsyncStorage.setItem('token', res.token)
        await AsyncStorage.setItem('isLoggedIn', 'true')
        navigation.replace('Splash')
        console.log('Navigate to Splash Screen to load necessary data')
      }
      else {
        setButtonText('Verify OTP')
        setIsSubmitting(false)
        setModals([{ title: 'Wrong OTP', description: res.message }])
      }
    }).catch(err => {
      console.log(err)
      setButtonText('Verify OTP')
      setIsSubmitting(false)
      setModals([{ title: 'Network Error', description: 'Something went wrong. Please Check your internet connection and try again.' }])
    })
  }
}



export default OTP

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  top: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    height: 300,
    // maxHeight: 300,
    // minHeight: 100,
    width: '100%', resizeMode: 'contain',
    // marginTop: 10
    // backgroundColor : 'red'
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginTop: 30,
  }
  ,
  otpInput: {
    backgroundColor: colors.inputBg,
    color: colors.text,
    fontFamily: fonts.medium,
    padding: 15,
    textAlign: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    borderRadius: 14,
    fontSize: 18,
  },
  buttonsContainer: {
    display: 'flex',
    gap: 20,
    marginTop: 50,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
})