import {
  StyleSheet, Text, View
  , SafeAreaView, ScrollView, Image,
  TouchableOpacity, BackHandler,
  Clipboard, Share
} from 'react-native'
import React from 'react'
import { colors } from '../../../styles/colors'
import icons from '../../../assets/icons/icons'
import images from '../../../assets/images/images'
import { useWindowDimensions } from 'react-native'
import ButtonFull from '../../../components/ButtonFull'
import { Alert } from 'react-native'
import vars from '../../../styles/var'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserData } from '../../types'
import { playStoreLink } from '../../../appData'
import { fonts } from '../../../styles/fonts'


const ReferEarn = ({ navigation }: any) => {
  const { width } = useWindowDimensions()
  const [isCopied, setIsCopied] = React.useState(false)
  const [referCode, setReferCode] = React.useState('')
  const [refer_pending_count, setReferPendingCount] = React.useState('')
  const [refer_success_count, setReferSuccessCount] = React.useState('')

  React.useEffect(() => {
    setTimeout(async () => {
      const data: UserData = JSON.parse(await AsyncStorage.getItem('userData') as string)
      setReferCode(data.refer_code)
      setReferPendingCount(data.refer_pending_count)
      setReferSuccessCount(data.refer_success_count)
      console.log(data)
    }, 0);
  }, [])

  return (
    <ScrollView style={{
      backgroundColor: 'white',
    }}>
      <View style={styles.top}>
        <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15, paddingVertical: 5 }}>
          <Text style={{ fontSize: 20, color: colors.text, fontFamily: fonts.bold }}>Refer and Earn</Text>
        </View>
        <View style={[styles.flexRow, { gap: 20 }]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => { navigation.navigate('ReferHistory') }}>
            <View>
              <Image source={icons.time_circle} style={[styles.topImage, { width: 20, height: 20, opacity: 0.9 }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.flexRow, styles.balanceContainer]} className='mt-3'>
        <View style={[styles.balanceBox]}>
          <View style={[styles.flexRow, { gap: 7 }]}>
            <Image source={icons.refer_done} style={styles.balanceImage} />
            <Text style={[styles.balance]}>{refer_success_count}</Text>
          </View>
          <Text style={[styles.balanceType]}>Successful</Text>
        </View>
        <View style={[styles.balanceBox]}>
          <View style={[styles.flexRow, { gap: 7 }]}>
            <Image source={icons.exchange} style={styles.balanceImage} />
            <Text style={[styles.balance]}>{refer_pending_count}</Text>
          </View>
          <Text style={[styles.balanceType]}>Pending</Text>
        </View>
      </View>

      <View style={{ padding: 20, paddingTop: 5, gap: 20 }}>
        <View style={[referStyles.lightCard, { gap: 10, }]}>
          <View style={{
            borderRadius: 10,
            justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'
          }}>
            <TouchableOpacity onPress={() => {
              copyToClipboard(referCode)
            }}>
              <View style={{
                flexDirection: 'row', gap: 15, backgroundColor: 'white', padding: 13, borderRadius: 10,
                borderStyle: 'dashed', borderWidth: 1, borderColor: colors.text
              }}>
                <Text style={{ fontSize: 15, color: colors.text, fontFamily: fonts.medium }}>{referCode}</Text>
                <Image source={isCopied ? icons.check : icons.copy} style={{ width: 15, height: 15, tintColor: isCopied ? 'limegreen' : colors.text, }} />
              </View>
            </TouchableOpacity>
            <View></View>
          </View>
          <ButtonFull title="Refer a Friend Now" onPress={() => {
            shareText(`Check out Win Karo App on the Google Play Store using this link: ${playStoreLink}. Use my referral code ${referCode} for a special bonus when you sign up. Enjoy!`)
          }} />
        </View>

        <View style={[referStyles.lightCard, referStyles.referCard, { paddingLeft: 20 }]}>
          <View style={{ width: '52%', flexDirection: 'row', gap: 15 }}>
            <View>
              <View style={[referStyles.roundedNumber]}>
                <Text style={{ color: 'white' }}>1</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, color: colors.text, fontFamily: fonts.medium, width: '80%' }}>Invite friends using referral code</Text>
          </View>
          <View style={{ width: '45%', }}>
            <Image source={images.man_phone} style={{ width: '100%', height: 150, resizeMode: 'contain', marginVertical: 10 }} />
          </View>
        </View>

        <View style={[referStyles.lightCard, referStyles.referCard, { paddingLeft: 0 }]}>
          <View style={{ width: '45%', }}>
            <Image source={images.girl} style={{ width: '100%', height: 150, resizeMode: 'contain' }} />
          </View>
          <View style={{ width: '54%', flexDirection: 'row', gap: 15 }}>
            <View>
              <View style={[referStyles.roundedNumber]}>
                <Text style={{ color: 'white' }}>2</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, color: colors.text, fontFamily: fonts.medium, width: '80%' }}>If they complete 10 YouTube task continuously.</Text>
          </View>
        </View>

        <View style={[referStyles.lightCard, referStyles.referCard, { paddingLeft: 20 }]}>
          <View style={{ width: '52%', flexDirection: 'row', gap: 15 }}>
            <View>
              <View style={[referStyles.roundedNumber]}>
                <Text style={{ color: 'white' }}>3</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, color: colors.text, fontFamily: fonts.medium, width: '80%' }}>You will get	200 coins per refer.</Text>
          </View>
          <View style={{ width: '45%', }}>
            <Image source={images.girl_2} style={{ width: '100%', height: 150, resizeMode: 'contain', }} />
          </View>
        </View>


      </View>
    </ScrollView >
    // <View style={{ height: '100%', backgroundColor: 'lime' }}>
    //   <View style={styles.top}>
    //     <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15, paddingVertical: 5 }}>
    //       <Text style={{ fontSize: 20, color: colors.text, fontFamily: fonts.bold }}>Refer and Earn</Text>
    //     </View>
    //     <View style={[styles.flexRow, { gap: 20 }]}>
    //       <TouchableOpacity activeOpacity={0.8} onPress={() => { navigation.navigate('ReferHistory') }}>
    //         <View>
    //           <Image source={icons.time_circle} style={[styles.topImage, { width: 20, height: 20, opacity: 0.9 }]} />
    //         </View>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    //   <View style={styles.body}>

    //     <View>
    //       <View style={[styles.flexRow]}>
    //         <Image source={images.refer} style={[styles.illustration, { height: width * 0.5, }]} />
    //       </View>
    //       <View style={styles.counters}>
    //         <View style={styles.counter}>
    //           <Text style={styles.counterValue}>200</Text>
    //           <Text style={styles.counterName}>Earned Coins</Text>
    //         </View>
    //         <View style={styles.counter}>
    //           <Text style={styles.counterValue}>16</Text>
    //           <Text style={styles.counterName}>Total Referred</Text>
    //         </View>
    //         <View style={styles.counter}>
    //           <Text style={styles.counterValue}>9</Text>
    //           <Text style={styles.counterName}>Pending</Text>
    //         </View>
    //       </View>
    //     </View>
    //     <View style={{ paddingHorizontal: 20 }}>
    //       <Text style={{ color: colors.text, fontSize: 16, fontFamily: fonts.semiBold, textAlign: 'center' }}>Get	200 coins per refer when your friend completes 10 YouTube task continuously.</Text>
    //     </View>


    //     <View style={{ width: '100%' }}>
    //       <TouchableOpacity activeOpacity={0.8} onPress={() => { copyToClipboard(referCode) }}>
    //         <View style={styles.clickToCopy}>
    //           <Text style={{ color: colors.accent, fontSize: 16, fontFamily: fonts.medium, }}>Refer code : {referCode}</Text>
    //           <Text style={{ color: colors.accent, fontSize: 16, fontFamily: fonts.medium }}>{copiedText}</Text>
    //         </View>
    //       </TouchableOpacity>
    //       <ButtonFull title="Refer a Friend" onPress={() => {
    //         shareText(
    //           `Check out Win Karo App on the Google Play Store using this link: ${playStoreLink}. Use my referral code ${referCode} for a special bonus when you sign up. Enjoy!`
    //         )
    //       }} />
    //     </View>

    //   </View>
    // </View>
  )

  function copyToClipboard(text: string) {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 10000);
    Clipboard.setString(text);
  }
}

export default ReferEarn

const styles = StyleSheet.create({
  balanceContainer: {
    padding: 20,
    paddingTop: 10,
    width: '100%',
    gap: 15,
  },
  balanceBox: {
    backgroundColor: colors.accentLight,
    padding: 20,
    paddingVertical: 20,
    flex: 1,
    // gap: 5,
    borderRadius: 20,
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 23,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  balanceImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  balanceType: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginTop: 5,
    fontFamily: fonts.regular
  },
  counters: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  counter: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingVertical: 20,
    backgroundColor: colors.accentLight,
    borderRadius: vars.borderRadius,
  },
  counterValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  counterName: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.8,
    fontFamily: fonts.regular,
  },
  clickToCopy: {
    width: '100%', marginBottom: 10,
    backgroundColor: colors.accentLight,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 20,
    borderRadius: vars.borderRadius,
  },
  illustration: {
    width: '100%',
    resizeMode: 'contain'
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  top: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  topImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
})

const referStyles = StyleSheet.create({
  lightCard: {
    backgroundColor: '#fafafa', borderColor: "#e5e5e5", padding: 20, borderWidth: 0.5,
    borderRadius: 15,
  },
  roundedNumber: {
    width: 25, aspectRatio: 1, borderRadius: 20, backgroundColor: '#111',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  referCard: {
    padding: 10, paddingVertical: 0, backgroundColor: 'white',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10,
    borderWidth: 1,
  }
})

async function shareText(text: string) {
  try {
    const result = await Share.share({
      message:
        text,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {// shared with activity type of result.activityType
      } else {// shared
      }
    }
    else if (result.action === Share.dismissedAction) {// dismissed
    }
  } catch (error: any) {
    Alert.alert('Error!', error.message);
  }
};