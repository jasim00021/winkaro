import {
  SafeAreaView,
  StyleSheet, ScrollView,
  Text, View, Image, Button,
  StatusBar, TextInput,
  TouchableOpacity, Modal, Linking,
} from 'react-native'
import React, { useEffect, useState } from 'react'

// import { TextInput } from 'react-native/Libraries/Components/TextInput/TextInput'
import icons from '../../assets/icons/icons'
import images from '../../assets/images/images'
import { colors } from '../../styles/colors'
import ButtonFull from '../../components/ButtonFull'
import { Alert } from 'react-native'
import buttons from '../../styles/buttons'
import styles from './styles'
import { API_URL, t_and_c_link } from '../../appData'
import { fonts } from '../../styles/fonts'
import CustomModal from '../../components/CustomModal'
import { getDefaultHeader } from '../methods'
import DeviceInfo from 'react-native-device-info'
import { Link } from '@react-navigation/native'


// import { StatusBar } from 'react-native/Libraries/Components/StatusBar/StatusBar'

const Login = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false)
  const [isSendingOTPText, setIsSendingOTPText] = useState<string>('Send OTP')
  const [modals, setModals] = useState<any>([])
  let [deviceId, setDeviceId] = useState('')

  useEffect(() => {
    DeviceInfo.getUniqueId().then(id => {
      setDeviceId(id)
    })
  }, [])

  return (
    <SafeAreaView style={styles.main}>
      <CustomModal modals={modals} updater={setModals} />
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topContainer}>
          <Image source={images.log_in} style={styles.topImage} />
          <Text style={styles.title}>Log In to Win Karo</Text>
          <Text style={styles.description}>Log In to Win Karo to watch and win</Text>
        </View>

        <View style={styles.inputContainer}>


          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.mobile_solid} style={[styles.inputImage, { width: 23, height: 23 }]} />
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholderTextColor={colors.textLighter}
              style={styles.input}
              placeholder="eg. 9876543210"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* <Text style={styles.label}>Your Password</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.lock_solid} style={[styles.inputImage,]} />
            <TextInput
              placeholderTextColor={colors.textLighter}
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View> */}



          <View style={{ marginTop: 20 }}>
            <ButtonFull title={isSendingOTPText} onPress={handleLogin} disabled={isSendingOTP} />
          </View>

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
              <Text style={{ color: colors.accent, fontFamily: fonts.medium }}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <View>
            <TouchableOpacity onPress={() => navigation.replace('SignUp')} activeOpacity={0.9}>
            <Text style={buttons.button}>Sign Up?</Text>
            </TouchableOpacity>
            </View>
          </View> */}
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>By Logging in you accept out </Text>
            <TouchableOpacity onPress={() => Linking.openURL(t_and_c_link)}>
              <Text style={{ color: colors.accent, fontFamily: fonts.medium }}>terms and conditions</Text>
            </TouchableOpacity>
          </View>

        </View>


      </ScrollView>
    </SafeAreaView>
  )
  function openModal() {

  }

  function handleLogin() {
    // If phone number length is not 10 then show error
    // Check if phone number is valid
    if (phoneNumber.length === 0) {
      setModals([{ title: 'Enter Phone Number', description: 'Please enter a phone number which you have used to sign up.' }])
      return
    }

    if (phoneNumber.length !== 10) {
      setModals([{ title: 'Error', description: 'Please enter a 10 digit phone number.' }])
      return
    }

    if (isNaN(phoneNumber as any)) {
      setModals([{ title: 'Error', description: 'Please enter a valid phone number' }])
      return
    }

    // Send OTP
    setIsSendingOTP(true)
    setIsSendingOTPText('Sending OTP...')
    // Send OTP to phone number
    // create a form data object
    const formData = new FormData()
    formData.append('phone', phoneNumber)
    formData.append('device_id', deviceId)
    // Send OTP
    fetch(API_URL.login, {
      method: 'POST',
      body: formData,
      headers: getDefaultHeader(false)
    }).then((res) => res.json()).then((res) => {
      console.log(res)
      if (res.status === true || res.status === 'true') {
        navigation.replace('OTP', { phone: phoneNumber })
      } else {
        setModals([{ title: 'Error', description: res.message }])
        setIsSendingOTP(false)
        setIsSendingOTPText('Send OTP')
        return
      }
    }).catch((err) => {
      console.log(err)
      setIsSendingOTP(false)
      setIsSendingOTPText('Send OTP')
      setModals([{ title: 'Network Error', description: 'Something went wrong. Please Check your internet connection and try again.' }])
    })
  }
}

export default Login

