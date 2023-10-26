import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { colors } from '../../styles/colors'
import images from '../../assets/images/images'
import icons from '../../assets/icons/icons'
import input from '../../styles/input'
import ButtonFull from '../../components/ButtonFull'
import WithdrawHistory from './WithdrawHistory'
import { fonts } from '../../styles/fonts'
import { getDefaultHeader } from '../methods'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, INR_TO_COINS, coins_to_inr, inr_to_coins } from '../../appData'
import CustomModal from '../../components/CustomModal'

const data = [
  {
    name: 'Paytm Wallet',
    key: 'paytm',
  },
  {
    name: 'UPI ID',
    key: 'upi',
  },
]

function Radio({ data, updater, selectedValue, disabled }: any) {

  return (
    <View style={{
      flexDirection: 'row',
      gap: 15, opacity: disabled ? 0.5 : 1
    }}>
      {
        data.map((item: any, index: any) => {
          return (
            <TouchableOpacity activeOpacity={0.7} key={index}
              onPress={() => {
                if (disabled) return
                updater(item.key)
              }}>
              <View key={index} style={{ display: 'flex', gap: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <View style={[{ height: 21, width: 21, display: 'flex', borderRadius: 20, borderWidth: 1.5, borderColor: '#000', justifyContent: 'center', alignItems: 'center', },]}>
                  {
                    selectedValue === item.key ?
                      <View style={{ height: 14, width: 14, borderRadius: 15, backgroundColor: '#000', }} />
                      : null
                  }
                </View>
                <Text style={{ color: colors.text, fontSize: 16, fontFamily: fonts.medium }}
                >{item.name}</Text>
              </View>
            </TouchableOpacity>
          )
        })
      }</View>
  )
}

function inINR(amount: number) {
  // coins / 1000 but 2 digit after decimal
  return (amount / 1000).toFixed(2)
}

function setSomethingWrong(setModalAlert: Function, navigation: any) {
  setModalAlert([{
    title: "Error",
    description: "Something went wrong. Please try again later.",
    type: "success", active: true,
    buttons: [
      { text: "No" },
      { text: "Yes", positive: true, onPress: () => { navigation.goBack() }, },
    ]
  }])
}
function confirmBind(setModalAlert: Function, callBack: Function) {
  setModalAlert([{
    title: "Bind Account",
    description: "You need to bind your account first. Do you want to bind it now?",
    type: "success", active: true,
    buttons: [
      { text: "No" },
      { text: "Yes", positive: true, onPress: async () => { await callBack() }, },
    ]
  }])
}


const withdrawAmounts = [5, 10, 20, 50, 100]

const Wallet = ({ navigation }: any) => {
  const [accountType, setAccountType] = React.useState("paytm");
  const [coins, setCoins] = React.useState(0);

  const [walletDetails, setWalletDetails] = React.useState<any>(null)
  const [isBound, setIsBound] = React.useState(false);
  let [modalAlert, setModalAlert] = useState<any>([])
  const [accountNumber, setAccountNumber] = useState('')
  const [buttonText, setButtonText] = useState('Withdraw')
  const [loading, setLoading] = useState(false)
  const [withdrawCoins, setWithdrawCoins] = useState('')
  const [withdrawHistory, setWithdrawHistory] = useState<any>(null)
  const [selectedAmount, setSelectedAmount] = useState<any>(0)



  useEffect(() => {
    setTimeout(async () => {
      const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
      const data = await fetch(API_URL.get_wallet_account, { method: 'POST', headers: headers })
      const res = await data.json()
      // console.log(res)
      if (res.status === 'true' || res.status === true) {
        setWalletDetails(res)
        setCoins(res.coins)
        if (res.data !== null) {
          setIsBound(true)
          setAccountNumber(res.data[0]?.account_number || res.data.account_number)
          setAccountType(res.data[0]?.type || res.data.type)
        }
      } else {
        setSomethingWrong(setModalAlert, navigation)
      }
    }, 0);
  }, [])

  useEffect(() => {
    getWithdrawHistory()
  }, [])



  async function withdrawAmount() {
    // Check if inputs are valid
    if (accountNumber.toString().length < 10) {
      setModalAlert([{ title: "Invalid Account Number", description: "Please enter a valid account number." }])
      return
    }

    // Confirm Withdraw

    setLoading(true)

    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
    if (!isBound) bindAccount()
    else withdraw()

    async function bindAccount() {
      // bind account
      setButtonText('Binding...')
      const data = await fetch(API_URL.bind_wallet_account, { method: 'POST', headers: headers, body: JSON.stringify({ type: accountType, account_number: accountNumber }) })
      const res = await data.json()
      if (res.status === 'true' || res.status === true) {
        setIsBound(true)
        withdraw()
      } else {
        setButtonText('Withdraw')
        setLoading(false)
        setSomethingWrong(setModalAlert, navigation)
      }
      // console.log(res)
    }

    async function withdraw() {
      setButtonText('Withdrawing...')

      // Check withdraw coins
      const coins_bal = coins
      const wth_coins = parseInt(withdrawCoins)

      if (isNaN(wth_coins) || !wth_coins) {
        setButtonText('Withdraw')
        setLoading(false)
        setModalAlert([{ title: "Invalid Amount", description: "Please select a valid amount." }])
        return
      } else if (wth_coins > coins_bal) {
        setButtonText('Withdraw')
        setLoading(false)
        setModalAlert([{ title: "Insufficient Balance", description: "You don't have enough coins to withdraw." }])
        return
      }



      // const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
      const auth = await AsyncStorage.getItem('token')
      const formData = new FormData()
      formData.append('coin', wth_coins)
      const data = await fetch(API_URL.withdraw_wallet_account, {
        method: 'POST',
        body: formData,
        headers: {
          'secret': 'hellothisisocdexindia',
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
      })
      const res = await data.json()
      // console.log(res)

      if (res.status === 'true' || res.status === true) {
        setModalAlert([{
          title: "Success",
          description: res.message,
          type: "success", active: true,
          buttons: [
            { text: "Ok", onPress: () => { navigation.goBack() }, positive: true },
          ]
        }])
      } else {
        setModalAlert([{
          title: "Failed",
          description: res.message,
          type: "success", active: true,
        }])
        setButtonText('Withdraw')
        setLoading(false)
      }
    }

  }

  async function getWithdrawHistory() {
    console.log('getWithdrawHistory')
    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
    const data = await fetch(API_URL.withdraw_history, { method: 'POST', headers: headers })
    const res = await data.json()
    setWithdrawHistory(res.data)
  }

  // const [accTypePlaceholder, setAccTypePlaceholder] = useState('Your Paytm Wallet Number')
  if (walletDetails) return (
    <ScrollView style={{
      paddingHorizontal: 20, paddingBottom: 100, paddingTop: 0, width: '100%', backgroundColor: 'white',
    }}>
      <CustomModal modals={modalAlert} updater={setModalAlert} />
      {/* <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop : 20, marginBottom : 20 }}>Wallet and Withdraw</Text> */}
      <Text style={{ color: colors.text, fontSize: 16, marginTop: 20, marginBottom: 5, fontFamily: fonts.medium }}>Available Balance</Text>
      <View style={{
        flexDirection: 'row', alignItems: 'center', marginTop: 5,
        justifyContent: 'space-between',
      }}>
        <View style={[styles.moneyBorder]}>
          <Image source={icons.coins} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
          <Text style={{ fontSize: 20, fontFamily: fonts.semiBold, color: colors.text }}>{walletDetails.coins}</Text>
        </View>
        <View style={styles.moneyBorder}>
          <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: 'limegreen' }}>₹</Text>
          <Text style={{
            fontSize: 20, fontFamily: fonts.semiBold, color: colors.text
          }}> {walletDetails.coin_to_inr}</Text>
        </View>


      </View>
      {/* <View style={{ width: '100%', gap: 20 }}>
        <View style={{ width: '100%', }}>
          <Image source={images.wallet} style={{
            width: '100%', height: 250,
            resizeMode: 'contain',
            marginLeft: 'auto', marginRight: 'auto'
          }} />
        </View>
        <Text style={{ marginTop: 20, color: colors.text, fontSize: 13.5, fontFamily: fonts.regular, }}><Text style={{ fontWeight: 'bold', }}>Note : </Text>The UPI or Paytm wallet of your first withdraw will be bounded to this account. You would not be able to bind another UPI to this account.</Text>
      </View> */}

      <View style={{ marginTop: isBound ? 0 : 30 }}>
        {
          !isBound ? <>
            <Text style={[styles.label]}>Select Account Type</Text>
            <Radio data={data} updater={setAccountType} selectedValue={accountType} disabled={isBound} />
          </>
            : null
        }
        <View style={{ marginTop: 15, gap: 15 }}>
          {
            !isBound ?
              <View style={input.singleInputContainer}>
                <Image source={icons.at} style={[input.inputImage, { width: 23, height: 23 }]} />
                <TextInput
                  // value={phoneNumber}
                  // onChangeText={(text) => setPhoneNumber(text)}
                  value={accountNumber}
                  onChangeText={(text) => setAccountNumber(text)}
                  placeholderTextColor={colors.textLighter}
                  style={input.textInput}
                  placeholder={accountType === 'paytm' ? 'Your Paytm Wallet Number' : 'Your UPI ID'}
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!isBound}
                />

              </View>
              : <Text className='text-[#333333] text-base bg-[#eeeeee] p-3 text-center rounded-2xl'>
                Account Bound to {accountNumber}({accountType}) <Text style={{ color: 'limegreen' }}>✓</Text>
              </Text>
          }
          {/* <Text style={[styles.label]}>Enter Amount</Text> */}
          {/* <View style={input.singleInputContainer}> */}
          {/* <Image source={icons.money} style={[input.inputImage, { width: 21, height: 21 }]} /> */}
          {/* <TextInput
              // value={phoneNumber}
              // onChangeText={(text) => setPhoneNumber(text)}
              placeholderTextColor={colors.textLighter}
              style={input.textInput}
              placeholder="Coins to Withdraw"
              keyboardType="phone-pad"
              value={withdrawCoins}
              onChangeText={(text) => setWithdrawCoins(text)}
            /> */}

          {/* </View> */}

          <View>
            <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: colors.text }}>Select Amount to Withdraw</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {
              withdrawAmounts.map((item, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => { setSelectedAmount(item); setWithdrawCoins((item * INR_TO_COINS).toString()) }}>
                    <View className='p-2 pl-3 pr-3' style={{ borderRadius: 30, backgroundColor: selectedAmount === item ? colors.accent : colors.inputBg, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: selectedAmount === item ? 'white' : colors.text, fontFamily: fonts.semiBold }}>₹  {item}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          {
            withdrawCoins ?
              // <Text style={{ fontFamily: fonts.regular, color: colors.text }}> In INR : ₹ {coins_to_inr(+withdrawCoins, coins)} </Text>
              <Text style={{ fontFamily: fonts.regular, color: colors.text }}> {inr_to_coins(+withdrawCoins, coins)} </Text>
              : null
          }
          <ButtonFull title={buttonText} onPress={() => { withdrawAmount() }} disabled={loading} />
        </View>
      </View>

      {

        <View style={{ marginTop: 50, marginBottom: 50 }}>
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: colors.text, marginBottom: 10, fontFamily: fonts.bold }}>Withdraw History</Text>
          </View>
          <WithdrawHistory data={withdrawHistory} />
        </View>
      }
    </ScrollView>
  )
  else
    return (
      <Loading />
    )
}

//   [
//   { amount: 73, status: 'pending', to: '987654321@oksbi', date: '12 Jan 2023\n1:30 PM', ref: '98FT65GF4758' },
//   { amount: 50, status: 'success', to: '987654321@oksbi', date: '12 Jan 2023\n1:30 PM', ref: '98YPO8ME4595' },
//   { amount: 17, status: 'failed', to: '987654321@oksbi', date: '12 Jan 2023\n1:30 PM', ref: '9Y8SD4H26F5G' }
// ]
export default Wallet

const styles = StyleSheet.create({
  label: {
    color: colors.gray,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: fonts.regular
  },
  moneyBorder: {
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15,
    backgroundColor: '#fafafa', borderColor: '#e5e5e5', borderWidth: 1, padding: 20,
    width: '48%'
  }
})