import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Loading from '../components/Loading'
import { getDefaultHeader } from './methods'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../appData'
import images from '../assets/images/images'
import { fonts } from '../styles/fonts'
import { colors } from '../styles/colors'
import icons from '../assets/icons/icons'
import CustomModal from '../components/CustomModal'


const { width, height } = Dimensions.get('window')


function showNotificationInModal(setModals: Function, title: string, subtitle: string) {
  setModals([{ title, description: subtitle }])
}


const Notifications = () => {
  const [notifications, setNotifications] = React.useState<any>(null)
  const [modals, setModals] = React.useState([])



  async function fetchNotifications() {
    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
    const res = await fetch(API_URL.get_notification, { method: 'POST', headers })
    const data = await res.json()
    console.log(data)
    if (data.status === 'true' || data.status === true) {
      setNotifications(data.data.notifications || [])
      console.log(notifications)
      // console.log(notifications)
      // setNotifications([
      //   {
      //     "id": "1875a3a0-9d48-41fe-9f38-f451e553c613",
      //     "subtitle": "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      //     "title": "Hello Here Is Demo Title"
      //   }
      // ])
      // Make the notifications array containing 4 notifications
    }
    else {
      setNotifications([])
    }
  }


  async function markAsRead() {
    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
    const res = await fetch(API_URL.notifications_mark_read, { method: 'POST', headers })
    const data = await res.json()
    console.log(data)
  }
  useEffect(() => {
    fetchNotifications()
    // Mark as read
    markAsRead()
  }, [])

  useEffect(() => {
    // fetch notifications each 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000);
    return () => clearInterval(interval);
  }, [])


  if (notifications == null)
    return <Loading />
  if (notifications.length === 0) {
    return <View className='flex-1 bg-[#ffffff] justify-center items-center gap-10' >
      <Image source={images.bell} style={{ width: '100%', height: 150, alignSelf: 'center', marginTop: 20, resizeMode: 'contain' }} />
      <Text style={{ fontFamily: fonts.medium, color: colors.gray }}>No Notification</Text>
    </View>
  }
  return (
    <View className='bg-[#ffffff] flex-1'>
      <CustomModal modals={modals} updater={setModals} />
      <ScrollView style={{
        borderBottomColor: '#e0e0e0', borderBottomWidth: 1
      }}>
        {
          notifications.map((noti: any) => {
            return (
              <TouchableOpacity activeOpacity={0.8} onPress={() => showNotificationInModal(setModals, noti.title, noti.subtitle)} key={noti.id}>
                <View style={{
                  width: width, borderWidth: 0.5,
                  borderTopWidth: 1, borderBottomWidth: 0, borderLeftWidth: 0, borderColor: '#e0e0e0', borderRadius: 10,
                }}
                  className='p-3 pt-4 pb-4 justify-center flex-row '>
                  <View style={{ width: 50, height: 50 }} className='justify-center items-center'>
                    <Image source={icons.bell} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                  </View>
                  <View style={{ width: width - 50 - 30, marginLeft: 6 }} className=''>
                    <Text style={{ fontFamily: fonts.medium, color: colors.text }} className='text-base'>{noti.title}</Text>
                    <Text numberOfLines={3} style={{ fontFamily: fonts.regular, color: colors.text }}>{noti.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({})