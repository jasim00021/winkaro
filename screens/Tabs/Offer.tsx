import {
  StyleSheet, Text, View, Image,
  TextInput,
  TouchableOpacity, Linking, Modal, Dimensions, Alert
} from 'react-native'
import React, { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { colors } from '../../styles/colors'
import { fonts } from '../../styles/fonts'
import images from '../../assets/images/images'
import icons from '../../assets/icons/icons'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'
import { API, API_URL } from '../../appData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDefaultHeader } from '../methods'
import { Link, useIsFocused } from '@react-navigation/native'
import CustomModal from '../../components/CustomModal'

type OfferData = {
  id: number,
  title: string,
  claimed: boolean,
  action?: () => void,
  name: string,
  status?: string,
  link?: {
    link: string,
    linkIcon: any,
    linkText: string,
  }
}

const { width, height } = Dimensions.get('window')


const Offer = ({ navigation }: any) => {

  const [uerNameModal, setUserNameModal] = React.useState(false)
  const [pleaseWaitModal, setPleaseWaitModal] = React.useState<{ visible: boolean, text?: string }>({ visible: false, text: "" })
  const [congratulationModal, setCongratulationModal] = React.useState({ visible: false, coins: 0, text: '' })
  const focused = useIsFocused()

  const offersData: OfferData[] = [
    {
      id: 1,
      title: 'Claim 1000 Coins after completing 10 YouTube valid tasks continuously without any one task gap.',
      claimed: true,
      name: 'yt_task_milestone',
      status: 'claim',
      action: ytTaskMilestone,
    },
    {
      id: 2,
      title: 'Join a Telegram Channel to claim 100 coins.',
      claimed: false,
      name: 'telegram_task',
      action: () => {
        setUserNameModal(true)
      },
      status: 'claim',
      link: {
        link: 'https://telegram.me/Win_karo',
        linkIcon: icons.telegram,
        linkText: 'Telegram Channel Link'
      }
    },
    // {
    //   id: 3,
    //   // title: 'Subscribe on YouTube ( Claim 100 coins )',
    //   title: 'Claim 100 coins after subscribing to a YouTube channel.',
    //   claimed: true,
    // },
    {
      id: 4,
      title: 'Install an app and complete a task to claim 200 coins.',
      claimed: true,
      name: 'app_install_task',
      status: 'claim',
      action: () => {
        // Redirect to app install task
        setAppInstallModal(true);
        console.log(appRedirectLink);
        function redirect() {
          Linking.openURL(appRedirectLink)
        }
        setTimeout(redirect, 100)
      },
      link: {
        link: '',
        linkIcon: icons.youtube_icon,
        linkText: 'Demo Video'
      }
    }
  ]

  const [loadTaskData, setLoadTaskData] = React.useState(false)
  const [offersStatus, setOffersStatus] = React.useState(offersData)
  const [modals, setModals] = React.useState<any>([])
  const [appInstallModal, setAppInstallModal] = React.useState(false)
  const [telegramUserName, setTelegramUserName] = React.useState('')
  const [appInstallLink, setAppInstallLink] = React.useState('')
  // const [appRedirectLink, setAppRedirectLink] = React.useState('')
  let appRedirectLink = ''

  async function getOfferStatus() {
    const token = await AsyncStorage.getItem('token')
    const headers = getDefaultHeader(token)

    try {
      const response = await fetch(API_URL.offer_status, {
        method: 'POST',
        headers: headers,
      })
      const data = await response.json()
      console.log(data)

      // Set offers status
      if (data.status === 'true' || data.status === true) {
        const status = data.data
        const offersStatus = [...offersData]
        status.forEach((item: any) => {
          const index = offersStatus.findIndex((offer) => offer.name === item.name)
          if (index !== -1) {
            offersStatus[index].status = item.status
          }
        })
        setOffersStatus(offersStatus)
        return fetch(API_URL.app_install_task, { method: 'POST', headers: headers, }).then(data => data.json()).then(data => {
          const response = data
          console.log(data)
          if (response.status === true || response.status === 'true') {
            offersData[2].link = { link: response.data.video_link, linkIcon: icons.youtube_icon, linkText: 'Demo Video' }
            setOffersStatus([...offersData])
            // setAppRedirectLink(() => response.data.app_link)
            appRedirectLink = response.data.app_link
          } else {
            Alert.alert('There is some error while fetching app install link. Please check your internet connection. And try again later.')
          }
          setLoadTaskData(true)
        })
      }
    } catch (err) {
      Alert.alert('There is some error while fetching offers status. Please check your internet connection. And try again later.')
    }
  }

  useEffect(() => {
    if (focused) {
      setLoadTaskData(false)
      getOfferStatus()
    }
  }, [focused])



  const claimTelegramOffer = async (userName: string | null) => {
    userName = userName?.trim() || ''
    if (!userName) return Alert.alert('Warning', 'Please enter your telegram username to claim this offer.')

    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))

    setUserNameModal(false)
    setPleaseWaitModal({ visible: true, text: "Please wait..." })

    offersData[1].status = 'processing'

    try {
      const data = await fetch(API_URL.telegram_task, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          telegram_username: userName
        })
      })

      const response = await data.json()
      console.log(response)

      setPleaseWaitModal({ visible: false })

      if (response.status === 'true' || response.status === true) {
        offersData[1].status = 'processing'
        setModals([{ title: 'Please Wait', description: 'This offer will take some time to be checked. Please kindly wait for some time. The credit will be added to your account soon.', }])
      } else {
        offersData[1].status = 'complete'
        setModals([{ title: 'Already Claimed', description: response.message, }])
      }
      setOffersStatus([...offersData])
    } catch (err) {
      setModals([{ title: 'There is some error while claiming coins.', description: 'Please check your internet connection. And try again later.', }])
    }
  }
  async function submitAppInstallLink(link: string | null) {
    link = link?.trim() || ''
    if (!link) return Alert.alert('Warning', 'Please enter the app install link to claim this offer.')

    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))

    setAppInstallModal(false)
    setPleaseWaitModal({ visible: true, text: "Please wait..." })

    offersData[2].status = 'processing'

    try {
      const data = await fetch(API_URL.app_install_task_claim, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          reward_link: link
        })
      })

      const response = await data.json()
      console.log(response)

      setPleaseWaitModal({ visible: false })

      if (response.status === 'true' || response.status === true) {
        offersData[2].status = 'processing'
        setModals([{ title: 'Please Wait', description: 'This offer will take some time to be checked. Please kindly wait for some time. The credit will be added to your account soon.', }])
      }
      else {
        offersData[2].status = 'complete'
        setModals([{ title: 'Already Claimed', description: response.message, }])
      }
      setOffersStatus([...offersData])
      // Refresh offers
      setLoadTaskData(false)
      getOfferStatus()
    } catch (err) {
      setModals([{ title: 'There is some error while claiming coins.', description: 'Please check your internet connection. And try again later.', }])
    }
  }

  async function ytTaskMilestone() {
    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))

    setPleaseWaitModal({
      visible: true,
      text: "Please wait..."
    })

    try {
      const data = await fetch(API_URL.yt_task_milestone, {
        method: 'POST',
        headers: headers,
      })
      const response = await data.json()
      console.log(response)

      setPleaseWaitModal({ visible: false, text: "" })
      if (response.status === 'true' || response.status === true) {
        setCongratulationModal(
          {
            visible: true,
            coins: response.reward_coins,
            text: `You have successfully claimed ${response.reward_coins} coins.`
          }
        )
      } else {
        setModals([
          {
            title: response.message,
            description: 'Maybe you did noy complete 10 YouTube tasks continuously without any one task gap. Try again.',
          }
        ])
      }

    } catch (err) {
      setModals([
        {
          title: 'There is some error while claiming coins.',
          description: 'Please check your internet connection. And try again later.',
        }
      ])
    }
  }


  return (
    <ScrollView style={{
      backgroundColor: 'white',
    }}>
      <CustomModal modals={modals} updater={setModals} />
      <View>
        <View style={styles.top}>
          <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15, paddingVertical: 5 }}>
            <Text style={{ fontSize: 20, color: colors.text, fontFamily: fonts.bold }}>Offers</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' }}>
          <Image source={images.offers} style={{
            width: '100%',
            padding: 20,
            height: 250,
            resizeMode: 'contain'
          }} />
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={uerNameModal}>
        <View className='flex-1 bg-[#00000033] justify-center items-center'>
          <View className='w-[90%] bg-white p-7 rounded-2xl'>
            <Text className='text-center text-[#000] text-lg' style={{ fontFamily: fonts.medium }}>
              Enter your telegram username
            </Text>
            <View className='justify-between items-center mt-7'>
              <TextInput
                placeholder='Enter your telegram username'
                style={{
                  borderWidth: 1,
                  fontFamily: fonts.medium,
                  color: colors.text,
                }}
                className='w-[100%] p-3 rounded-xl border-[#ccc] pl-4 text-base'
                value={telegramUserName}
                onChangeText={(text) => { setTelegramUserName(text) }}
              />
              <View className='w-[105%] flex-row justify-between items-center gap-[4%] mt-2'>
                <View className='w-[47%]'>
                  <ButtonFull styles={{ backgroundColor: '#ddd' }} textStyles={{ color: colors.text }} title="Cancel" onPress={() => { setUserNameModal(false) }} />
                </View>
                <View className='w-[47%]'>
                  <ButtonFull title="Claim" onPress={() => { claimTelegramOffer(telegramUserName) }} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={appInstallModal}>
        <View className='flex-1 bg-[#00000033] justify-center items-center'>
          <View className='w-[90%] bg-white p-7 rounded-2xl'>
            <Text className='text-center text-[#000] text-lg' style={{ fontFamily: fonts.medium }}>
              Paste the Application Link here
            </Text>
            <View className='justify-between items-center mt-7'>
              <TextInput
                placeholder='Paste the Application Link here'
                style={{
                  borderWidth: 1,
                  fontFamily: fonts.medium,
                  color: colors.text,
                }}
                className='w-[100%] p-3 rounded-xl border-[#ccc] pl-4 text-base'
                value={appInstallLink}
                onChangeText={(text) => { setAppInstallLink(text) }}
              />
              <View className='w-[105%] flex-row justify-between items-center gap-[4%] mt-2'>
                <View className='w-[47%]'>
                  <ButtonFull styles={{ backgroundColor: '#ddd' }} textStyles={{ color: colors.text }} title="Cancel" onPress={() => { setAppInstallModal(false) }} />
                </View>
                <View className='w-[47%]'>
                  <ButtonFull title="Claim" onPress={() => { submitAppInstallLink(appInstallLink) }} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/*Please Wait Modal */}
      <Modal animationType="fade" transparent={true} visible={pleaseWaitModal.visible}>
        <View className='flex-1 bg-[#00000033] justify-center items-center'>
          <View className='w-[90%] bg-white p-7 rounded-2xl'>
            <Text className='text-center text-[#000] text-lg' style={{ fontFamily: fonts.medium }}>
              Please Wait
            </Text>
            <View className='mt-5'>
              <Image source={icons.loading}
                style={{ resizeMode: 'contain', }}
                className='w-20 h-20 rounded-full opacity-70 mx-auto'
              />
            </View>
            <Text className='text-center text-[#000] text-lg mt-5' style={{ fontFamily: fonts.medium }}>
              {pleaseWaitModal.text}
            </Text>
          </View>
        </View>
      </Modal>

      {/*Congratulation Modal */}
      <Modal animationType="fade" transparent={true} visible={congratulationModal.visible}>
        <View className='flex-1 bg-[#00000044] justify-center items-center'>
          <View className='bg-white rounded-2xl overflow-hidden' style={{ width: width * 0.85 }}>
            <Image source={images.congrats}
              style={{ resizeMode: 'contain', width: '100%', height: 561 / 1000 * width * 0.85 }}
              className=' mx-auto'
            />
            <View className='flex-row justify-center items-center mt-5'>
              <View className='bg-[#00000010] flex-row justify-center items-center rounded-xl p-3 px-4'>
                <Image source={icons.coin}
                  style={{ resizeMode: 'contain', width: 30, height: 30, }}
                />
                <Text className='text-center text-[#000] text-3xl ml-3' style={{ fontFamily: fonts.bold }}>
                  {congratulationModal.coins || ''}
                </Text>
              </View>
            </View>

            <View className='p-10'>
              <Text className='text-center text-[#000] text-base mb-5' style={{ fontFamily: fonts.medium }}>
                {congratulationModal.text}
              </Text>
              <ButtonFull title="Ok" onPress={() => {
                setCongratulationModal({
                  visible: false,
                  coins: 0,
                  text: 'You have successfully claimed 100 coins.'
                })
              }} />
            </View>
          </View>
        </View>
      </Modal>


      <View style={{ marginTop: 30 }}>
        {/* <Text style={{ fontSize: 18, fontFamily: fonts.semiBold, textAlign: 'center', color: colors.text }}>Offers to Claim</Text> */}
        {/* <View style={{ padding: 20, gap: 10 }}> */}
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, backgroundColor: colors.accent, padding: 15, borderRadius: 20, }}>
            <View><Image source={icons.offer} style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: "white" }}></Image></View>
            <View><Text style={{ fontSize: 16, fontFamily: fonts.regular, color: 'white', marginRight: 35 }}>
              <Text>
                Claim 1000  Coins after completing 10 YouTube valid tasks continuously without any one task gap.
              </Text>
            </Text>
              <TouchableOpacity>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 10 }}>
                  <Image source={icons.youtube_icon} style={{ width: 20, aspectRatio: 1, resizeMode: 'contain', }} />
                  <Text style={{ fontSize: 15, fontFamily: fonts.semiBold, color: 'white' }}>Demo Video</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, backgroundColor: colors.accent, padding: 15, borderRadius: 20, }}>
            <View><Image source={icons.offer} style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: "white" }}></Image></View>
            <View><Text style={{ fontSize: 16, fontFamily: fonts.regular, color: 'white', marginRight: 35 }}>
              Join a Telegram Channel to claim 100 coins.
            </Text>
            </View>
          </View> */}

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15, backgroundColor: colors.accent, padding: 15, borderRadius: 20, }}> */}
        {/* <View><Image source={icons.offer} style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: "white" }}></Image></View> */}
        {/* <View><Text style={{ fontSize: 16, fontFamily: fonts.regular, color: 'white', marginRight: 35 }}> */}
        {/* Install task ( 200 coins ) YouTube png ( clickable ) ( demo video yt link  )  claim button ( link redirect ) Text submit button . */}
        {/* Install an app and complete a task to claim 200 coins. */}
        {/* </Text> */}
        {/* </View> */}
        {/* </View> */}

        {/* </View> */}

        {/* <Text style={{ fontSize: 18, fontFamily: fonts.semiBold, textAlign: 'center', color: colors.text }}>Completed Tasks</Text> */}


        <View className='p-5 gap-3'>
          {/* <View className='flex-row bg-[#eeeeee] p-4 rounded-2xl justify-between'>
            <Text className='text-[#000] w-[75%]' style={{
              fontFamily: fonts.medium,
            }}>Claim 1000  Coins after completing 10 YouTube valid tasks continuously without any one task gap.</Text>
            <TouchableOpacity activeOpacity={1}>
              <View className='p-3 px-5 w-20% rounded-xl opacity-70' style={{
                backgroundColor: colors.accent,
              }}>
                <Text className='text-white'>Claimed</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View> */}
          {
            loadTaskData ?
              offersStatus.map((item: OfferData, index: number) => {
                const isActiveBtnClaim = isActiveClaimButton(item.status!)

                return <View className='bg-[#eeeeee] p-4 rounded-2xl ' key={index}>
                  <View className='flex-row justify-between'>
                    <Text className='text-[#000] w-[70%]' style={{ fontFamily: fonts.medium, }}>{item.title}</Text>
                    <TouchableOpacity activeOpacity={!isActiveBtnClaim ? 1 : 0.7} onPress={item.action} disabled={!isActiveBtnClaim}>
                      <View className='p-3 px-4 rounded-xl' style={{ backgroundColor: colors.accent, opacity: !isActiveBtnClaim ? 0.7 : 1 }}>
                        <Text className='text-white'>{
                          getTaskStatusButtonText(item.status!)
                        }</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {
                    item.link &&
                    <View className=''>
                      <TouchableOpacity onPress={() => { Linking.openURL(item.link?.link as string) }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginTop: 5 }}>
                          <Image source={item.link.linkIcon} style={{ width: 20, aspectRatio: 1, resizeMode: 'contain', }} />
                          <Text style={{ fontSize: 15, fontFamily: fonts.semiBold, color: colors.accent }}>{item.link.linkText}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
              }) :
              <View className='pt-20'>
                <Loading />
                <Text className='text-center text-[#000] text-lg mt-5'>
                  Loading...
                </Text>
              </View>
          }
        </View>
      </View>
    </ScrollView>
  )
}

function getTaskStatusButtonText(status: string) {
  if (status === 'complete') return 'Claimed'
  if (status === 'processing') return 'Processing'
  if (status === 'reject') return 'Rejected'
  if (status === 'claim') return 'Claim'
}

function isActiveClaimButton(status: string) {
  if (status === 'claim') return true
  if (status === 'complete') return false
  if (status === 'processing') return false
  if (status === 'reject') return false
  return true
}


export default Offer

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
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
})