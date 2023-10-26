import { StyleSheet, Text, View, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { API_URL } from '../../appData'
import { getDefaultHeader } from '../methods'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomModal from '../../components/CustomModal'
const DailyLimit = ({ navigation, route }: any) => {
   const [modals, setModals] = useState<any>([])
   const earnedCoins = route.params.earnedCoins
   const checkFor = route.params.checkFor || 'watch'
   let [modalAlert, setModalAlert] = useState<any>([])

   // Disable Back Button
   useEffect(() => {
      const backAction = () => { return true; };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
   }, []);


   useEffect(() => {
      setTimeout(() => {
         changeNavigationBarColor('#ffffff', true);
         setTimeout(async () => {
            const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
            const dailyLimit = await fetch(API_URL.get_reward_video_daily_limit, {
               method: 'POST',
               headers: headers
            })
            const dailyLimitRes = await dailyLimit.json()

            console.log(dailyLimitRes)
            if (dailyLimitRes.status === false || dailyLimitRes.status === 'false') {
               setModalAlert([{
                  title: "Error", description: dailyLimitRes.message, active: true,
                  buttons: [
                     { text: "Go Back", positive: true, onPress: async () => { navigation.goBack() }, },
                  ]
               }])
            } else {
               navigation.replace('RewardAd', { earnedCoins: earnedCoins, from: checkFor })
            }
         }, 0);
      }, 0);
   }, [])

   return (
      <View style={{
         flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff',
      }}>
         <CustomModal modals={modalAlert} updater={setModalAlert} />

         <Loading />
         <Text>Checking Daily Limit</Text>
      </View>
   )
}

export default DailyLimit

const styles = StyleSheet.create({})