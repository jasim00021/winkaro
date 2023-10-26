import {
   TextInput, BackHandler,
   StyleSheet, Text, Image,
   View, ScrollView, TouchableOpacity
} from 'react-native'
import React from 'react'
import icons from '../../../assets/icons/icons'
import { colors } from '../../../styles/colors'
import styles from '../../login/styles'
import ButtonFull from '../../../components/ButtonFull'
import CustomModal from '../../../components/CustomModal'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import images from '../../../assets/images/images'
import { fonts } from '../../../styles/fonts'
import { API_URL } from '../../../appData'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProfile = ({ route, navigation }: any) => {
   const [name, setName] = React.useState(route.params.name || '')
   const [email, setEmail] = React.useState(route.params.email || '')
   const [profilePic, setProfilePic] = React.useState(route.params.profile_pic || '')
   const [isUploading, setIsUploading] = React.useState(false)
   const [isImageSelected, setIsImageSelected] = React.useState(false)
   const [modals, setModals] = React.useState<any>([])
   const [uploading, setUploading] = React.useState(false)
   const [buttonText, setButtonText] = React.useState('Save')
   // Disable back button
   React.useEffect(() => {
      const backAction = () => {
         // navigation.goBack()
         setModals([{
            title: "Are you sure?", description: "Are you sure you want to cancel edit profile?", active: true,
            buttons: [{ text: "No" },
            { text: "Yes", positive: true, onPress: async () => { navigation.goBack() }, },]
         }])
         return true
      }
      const backHandler = BackHandler.addEventListener(
         "hardwareBackPress",
         backAction
      )

      console.log(profilePic)

      return () => backHandler.remove()

   }, [])

   async function uploadPic() {
      if (!profilePic && !name && !email) {
         setModals([{ title: "Error", description: "Please select a profile picture or enter name or email", active: true, buttons: [{ text: "Ok", positive: true, onPress: async () => { }, },] }])
         return
      }
      setButtonText('Saving...')
      setIsUploading(true)
      const auth = await AsyncStorage.getItem('token')
      const formData = new FormData()
      profilePic && formData.append('profile_pic', { uri: profilePic, name: 'image.jpg', type: 'image/jpg' })
      name && formData.append('name', name)
      email && formData.append('email', email)

      const res = await fetch(API_URL.update_profile, {
         body: formData,
         method: 'POST',
         headers: {
            'secret': 'hellothisisocdexindia',
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `Bearer ${auth}`
         }
      })
      const data = await res.json()
      console.log(data)

      if (data.status == 'true' || data.status == true) {
         setButtonText('Saved')
         setModals([{
            title: "Success", description: "Profile updated successfully", active: true,
            buttons: [{ text: "Ok", positive: true, onPress: async () => { navigation.goBack() }, },]
         }])

      } else {
         setModals([{
            title: "Error", description: data.message, active: true,
            buttons: [{ text: "Ok", positive: true, onPress: async () => { }, },]
         }])
         setButtonText('Save')
      }
      setIsUploading(false)
   }

   async function selectPic() {
      console.log('selectPic')
      try {
         const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, })
         if (res.didCancel || res.errorMessage) return
         setIsImageSelected(true)
         const uri: any = res?.assets[0]?.uri as string
         setProfilePic(uri)
      } catch (e) {
         console.log(e)
      }
   }


   return (
      <View className='flex-1 bg-white justify-between'>
         <CustomModal modals={modals} updater={setModals} />
         <View>
            <TouchableOpacity className='ml-auto mr-auto pb-10' activeOpacity={0.8} onPress={() => { selectPic() }}>
               <Image source={profilePic ? { uri: profilePic } : icons.user_icon}
                  style={{ width: 150, height: 150, borderRadius: 500, resizeMode: 'contain' }}
               />
               <View className='bg-white p-3 rounded-full' style={{
                  position: 'absolute', left: 100, top: 100, zIndex: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5
               }}>
                  <Image source={icons.pencil} style={{
                     width: 20, height: 20, tintColor: colors.accent,
                  }} />
               </View>
            </TouchableOpacity>
            <Text style={{ color: colors.text, fontSize: 20, textAlign: 'center', fontFamily: fonts.semiBold }}>
               Profile Picture
            </Text>
         </View>



         <View className='p-5 gap-4'>
            <View>
               <Text style={styles.label} className='mb-3'>Your Name</Text>
               <View style={styles.singleInputContainer}>
                  <Image source={icons.profile} style={[styles.inputImage, { width: 23, height: 23 }]} />
                  <TextInput
                     value={name}
                     onChangeText={(text) => setName(text)}
                     placeholderTextColor={colors.textLighter}
                     style={styles.input}
                     placeholder="eg. Jhon Doe"
                  />
               </View>
            </View>
            <View>
               <Text style={styles.label} className='mb-3'>Your Email</Text>
               <View style={styles.singleInputContainer}>
                  <Image source={icons.at} style={[styles.inputImage, { width: 23, height: 23 }]} />
                  <TextInput
                     value={email}
                     onChangeText={(text) => setEmail(text)}
                     placeholderTextColor={colors.textLighter}
                     style={styles.input}
                     placeholder="eg. example@gmail.com"
                  />
               </View>
            </View>
         </View>

         <View></View>
         <View className='p-5'>
            {/* <Text style={{
               fontFamily: fonts.regular, color: colors.textLighter, backgroundColor: '#fafafa', padding: 20,
               borderRadius: 20, borderWidth: 0.5, borderColor: '#e5e5e5'
            }}>
               By using the name and profile picture you provide, you agree to our Terms and Conditions and Privacy Policy. You also agree to receive product-related emails from us.
            </Text> */}
         </View>

         <View className='p-5'>
            <ButtonFull title={buttonText} onPress={() => uploadPic()} disabled={isUploading} />
         </View>
      </View>
   )
}

export default EditProfile
