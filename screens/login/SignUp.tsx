import React, { useEffect, useState } from 'react'
import {
  Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput,
  TouchableOpacity, View, Linking
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
// import { TextInput } from 'react-native/Libraries/Components/TextInput/TextInput'
import { API_URL, t_and_c_link } from '../../appData'
import icons from '../../assets/icons/icons'
import images from '../../assets/images/images'
import ButtonFull from '../../components/ButtonFull'
import CustomModal from '../../components/CustomModal'
import { colors } from '../../styles/colors'
import { fonts } from '../../styles/fonts'
import styles from './styles'
import { getDefaultHeader } from '../methods'
import { Alert } from 'react-native'



const SignUp = ({ navigation }: any) => {
  let [deviceId, setDeviceId] = useState('')
  let [mobileNumber, setMobileNumber] = useState('')
  let [email, setEmail] = useState('')
  let [name, setName] = useState('')
  let [referCode, setReferCode] = useState('')
  let [isCreatingAccount, setIsCreatingAccount] = useState(false)
  let [buttonText, setButtonText] = useState('Create Account')
  let [modalAlert, setModalAlert] = useState<any>([])

  useEffect(() => {
    DeviceInfo.getUniqueId().then(id => {
      setDeviceId(id)
    })
  }, [])

  function createAccount() {
    // Check if all fields are filled except refer code
    if (!name || name.length < 3)
      return setModalAlert([{ title: 'Warning', description: 'lease enter your name (min 3 characters)', }])
    if (!email)
      return setModalAlert([{ title: 'Warning', description: 'Please enter your email', }])
    if (!mobileNumber)
      return setModalAlert([{ title: 'Warning', description: 'Please enter your mobile number', }])
    if (mobileNumber.length != 10)
      return setModalAlert([{ title: 'Warning', description: 'Please enter a valid mobile number', }])

    setIsCreatingAccount(true)
    setButtonText('Creating Account...')
    // Create account
    // Crate a form data
    let formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', mobileNumber)
    formData.append('device_id', deviceId)
    if (referCode) { formData.append('refer_code', referCode) }

    fetch(API_URL.register, {
      method: 'POST',
      body: formData,
      headers: getDefaultHeader(false)
    }).then(res => res.json()).then(res => {
      console.log(res)
      setIsCreatingAccount(false)
      if (res.status == true || res.status == 'true') {
        // Navigate to Verify OTP screen
        navigation.replace('OTP', {
          phone: mobileNumber,
          signUp: true
        })
      } else {
        setModalAlert([{ title: 'Error', description: res.message, }])
        setIsCreatingAccount(false)
        setButtonText('Create Account')
      }
    }).catch(err => {
      console.log(err)
      setIsCreatingAccount(false)
      setButtonText('Create Account')
      setModalAlert([{ title: 'Network Error', description: 'Something went wrong. Please Check your internet connection and try again.', }])
    })
  }



  return (
    <SafeAreaView style={styles.main}>
      <CustomModal modals={modalAlert} updater={setModalAlert} />
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={[styles.topContainer, { paddingBottom: 10 }]}>
          <Image source={images.sign_up} style={[styles.topImage, { height: 150 }]} />
          <Text style={styles.title}>Sign Up to Win Karo</Text>
          <Text style={styles.description}>Sign Up to Win Karo to watch and win</Text>
        </View>

        <View style={[styles.inputContainer,]}>
          <Text style={styles.label}>Your Name</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.profile} style={styles.inputImage} />
            <TextInput
              placeholderTextColor={colors.textLighter}
              style={styles.input}
              placeholder="eg. John Doe"
              keyboardType="default"
              onChangeText={(text) => setName(text)}
            />
          </View>

          {/* <Text style={styles.label}>Your Username</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.at} style={[styles.inputImage, { width: 23, height: 23 }]} />
            <TextInput
              placeholderTextColor={colors.textLighter}

              style={styles.input}
              placeholder="eg. johnDoe"
              keyboardType="default"
            />
          </View> */}

          <Text style={styles.label}>Your Email</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.message} style={[styles.inputImage]} />
            <TextInput
              placeholderTextColor={colors.textLighter}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="eg. johnDoe@gmail.com"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Your Mobile Number</Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.mobile_solid} style={[styles.inputImage, { width: 20, height: 20 }]} />
            <TextInput
              placeholderTextColor={colors.textLighter}
              maxLength={10}
              style={styles.input}
              placeholder="eg. 987654321"
              keyboardType="phone-pad"
              onChangeText={(text) => setMobileNumber(text)}
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
          <Text style={styles.label}>Refer Code <Text style={{ color: '#aaa' }}>(optional)</Text></Text>
          <View style={styles.singleInputContainer}>
            <Image source={icons.export} style={[styles.inputImage, { width: 20, height: 20 }]} />
            <TextInput
              placeholderTextColor={colors.textLighter}
              onChangeText={(text) => setReferCode(text)}
              style={styles.input}
              placeholder="eg. FD5K24"
              keyboardType="default"
            />
          </View>


          <View style={{ marginTop: 20 }}>
            <ButtonFull title={buttonText} onPress={createAccount} disabled={isCreatingAccount} />
          </View>

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>Already have an account </Text>
            <TouchableOpacity onPress={() => navigation.replace('LogIn')}>
              <Text style={{ color: colors.accent, fontFamily: fonts.medium }}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textLight, fontFamily: fonts.regular }}>By Signing up in you accept our </Text>
            <TouchableOpacity onPress={() => Linking.openURL(t_and_c_link)}>
              <Text style={{ color: colors.accent, fontFamily: fonts.medium }}>terms and conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView >
  )
}

export default SignUp