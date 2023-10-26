import {
   TouchableOpacity, Linking, Text, Image,
   Dimensions, View, Alert, Clipboard, Animated
} from 'react-native'
import buttons from '../../styles/buttons'
import { fonts } from '../../styles/fonts'
import { colors } from '../../styles/colors'
import { useState, useEffect } from 'react'
import icons from '../../assets/icons/icons'
import ButtonFull from '../../components/ButtonFull'



const { width } = Dimensions.get('window')
function addZero(num: number) {
   return num < 10 ? '0' + num : num
}


export function TaskAmount({ coins, endTime }: { coins: number, endTime: string }) {
   const [countdown, setCountdown] = useState<any>('')
   const now = new Date()
   const end = new Date(endTime)
   // Make a countdown timer
   useEffect(() => {
      function countdownTimer() {
         const now = new Date()
         const end = new Date(endTime)
         // Increment the time +24 hours
         // const diff = end.getTime() - now.getTime() 
         const diff = end.getTime() - now.getTime()
         const hours = Math.floor(diff / (1000 * 60 * 60))
         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
         const seconds = Math.floor((diff % (1000 * 60)) / 1000)
         setCountdown(addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds))
      }
      if (now.getTime() < end.getTime()) {
         // if (true) {
         countdownTimer()
         const interval = setInterval(() => {
            countdownTimer()
         }, 1000)
         return () => clearInterval(interval)
      } else {
         setCountdown(<Text style={{ color: 'red' }}>Expired</Text>)
      }
   }, [])


   return <View style={{ width: '100%', paddingHorizontal: 20, gap: 15, }}>
      <View style={{ backgroundColor: '#fafafa', borderRadius: 15, borderWidth: 0.5, borderColor: '#e5e5e5', flexDirection: 'row', justifyContent: 'space-between', }}>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 15, padding: 10, paddingHorizontal: 20 }}>
            <Image source={icons.coins} style={{ width: 30, height: 30, alignSelf: 'center', resizeMode: 'contain', }} />
            <Text style={{ fontSize: 20, fontFamily: fonts.medium, color: colors.text, textAlign: 'center', }}>
               {coins}
            </Text>
         </View>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 15, padding: 10, paddingHorizontal: 20, }}>
            <Image source={icons.countdown} style={{ width: 25, height: 25, alignSelf: 'center', resizeMode: 'contain', }} />
            <Text style={{ fontSize: 20, fontFamily: fonts.medium, color: colors.text, textAlign: 'center', }}>
               {countdown}
            </Text>
         </View>
      </View>
   </View>
}


export function GoBtn({ url }: { url: string }) {
   return <TouchableOpacity style={[buttons.full, { backgroundColor: 'limegreen', width: width / 3 - 25 }]} activeOpacity={0.8}
      onPress={() => {
         if (!url)
            return
         Linking.openURL(url)
      }}
   >
      <Text style={[{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium },]}>Go</Text>
   </TouchableOpacity>
}

export function copyToClipboard(text: string) {
   Clipboard.setString(text);
}

export function getTaskStatus(status: string) {
   if (status === 'complete')
      return 'Task Completed Successfully'
   else if (status === 'processing')
      return 'Uploaded, Task Processing'
}

export function getTaskStatusColor(status: string) {
   if (status === 'complete')
      return 'limegreen'
   else if (status === 'processing')
      return 'orange'
}


export function TaskStatusUI({ status }: { status: string }) {
   return <View>
      <Text style={{
         fontSize: 20, fontFamily: fonts.medium,
         color: getTaskStatusColor(status),
         textAlign: 'center',
      }}>{getTaskStatus(status)}</Text>
   </View>
}

export function TaskRejectedUI({ reason, retry }: { reason: string, retry: Function }) {
   return <View style={{ gap: 5, paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: 'red' }}>This task was rejected once.</Text>
      <TouchableOpacity onPress={() => Alert.alert('Reason for Rejection', reason)}>
         <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: colors.accent }}>See Why?</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: colors.text, }}>But you can retry again by clicking the 'Start Recording' button bellow</Text>
   </View>
}



export function WatchTutorial({ navigation, tutorialType }: { navigation: any, tutorialType: string }) {
   return <TouchableOpacity activeOpacity={0.7} onPress={() => {
      navigation.navigate('TaskTutorial', { isFromHome: false, taskType: tutorialType })
   }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, }}>
         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: colors.accentLight, padding: 15, borderRadius: 15, width: 'auto', paddingHorizontal: 20 }}>
            <Image source={icons.video} style={{
               width: 22, height: 22, alignSelf: 'center', resizeMode: 'contain',
            }}></Image>
            <Text style={{
               color: colors.accent, fontFamily: fonts.medium, fontSize: 14,
            }}>Watch Tutorial</Text>
         </View>
      </View>
   </TouchableOpacity>
}

export function SwipeUp({ bottomSwipeIcon, topSwipeIcon, isVisible }: any) {
   return <View style={{
      opacity: isVisible ? 1 : 0,
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: isVisible ? 50 : 20,
   }}>
      <Animated.View style={{ marginBottom: bottomSwipeIcon, marginTop: topSwipeIcon, gap: 2 }}>
         <Image source={icons.back} style={{
            width: 20, height: 20, alignSelf: 'center',
            transform: [{ rotate: '-90deg' }], tintColor: colors.gray,
         }}></Image>
         <Text style={{ color: colors.gray, fontFamily: fonts.medium, fontSize: 12 }}>Next Task</Text>
      </Animated.View>
   </View>
}

function isNaNInfinity(num: number) {
   return num === Infinity || isNaN(num) || num === undefined || num === null
}

function getTimeInHoursMinutesSeconds(time: number) {
   const hours = Math.floor(time / 3600)
   const minutes = Math.floor((time % 3600) / 60)
   const seconds = Math.floor((time % 3600) % 60)

   if (isNaNInfinity(hours) || isNaNInfinity(minutes) || isNaNInfinity(seconds))
      return '--:--:--'

   if (hours) {
      return addZero(hours) + 'h ' + addZero(minutes) + 'm ' + addZero(seconds) + 's '
   } else if (minutes) {
      return addZero(minutes) + 'm ' + addZero(seconds) + 's '
   } else {
      return addZero(seconds) + 's '
   }
}



export function Uploading({ progress, cancel, isError, startTime }: { progress: number, cancel: Function, isError: boolean, startTime: number }) {
   const [remainingTime, setRemainingTime] = useState<any>('00:00:00')

   // set 2 digits after decimal
   progress = Math.floor(progress * 100) / 100

   function calculateRemainingTime() {
      const now = new Date()
      const diff = now.getTime() - startTime
      const timePerPercent = diff / progress
      const remainingTime = timePerPercent * (100 - progress)
      const time = getTimeInHoursMinutesSeconds(remainingTime / 1000)
      setRemainingTime(time)
      // console.log(time)
   }

   useEffect(() => {
      calculateRemainingTime()
      const interval = setInterval(() => {
         calculateRemainingTime()
      }, 1000)
      return () => clearInterval(interval)
   }, [])



   return <View>

      {
         isError ? <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: 'red' }}>Network is busy, waiting for network connection.</Text> :
            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: colors.text }}>Uploading {progress}%  -  {remainingTime} left</Text>
      }
      <View style={{ width: width - 40, height: 5, backgroundColor: '#e5e5e5', borderRadius: 5, marginTop: 10, }}>
         <View style={{ width: progress + '%', height: 5, backgroundColor: colors.accent, borderRadius: 5, }}></View>
      </View>

      <ButtonFull styles={{
         width: width - 40, backgroundColor: 'red', marginTop: 20,
      }}
         title={"Cancel Uploading"} onPress={() => {
            cancel()
         }} />
   </View>
}



export function WatchHelp({ navigation, taskType }: { navigation: any, taskType: string }) {
   return <View style={{ padding: 20, gap: 5, backgroundColor: '#fafafa', borderColor: '#e5e5e5', borderWidth: 0.5, borderRadius: 20, width: width - 40, alignSelf: 'center', marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontFamily: fonts.medium, color: colors.text, }}>
         Don't Know how to complete this process?
      </Text>
      <Text style={{ fontSize: 14, fontFamily: fonts.regular, color: colors.text, }}>
         Click on the button bellow to learn how to complete this task. Don't worry we will explain everything in detail.
      </Text>
      <View>
         <WatchTutorial navigation={navigation} tutorialType={taskType} />
      </View>
   </View>
}
