import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import icons from '../../assets/icons/icons'
import { colors } from '../../styles/colors'
import { fonts } from '../../styles/fonts'
import Loading from '../../components/Loading'
import { coins_to_inr } from '../../appData'

const WithdrawHistory = ({ data }: any) => {

  if (!data) {
    return <View className='h-64'>
      <Loading />
    </View>
  }
  else if (data.length === 0) {
    return <View className='h-64 flex justify-center items-center'>
      <Text style={{ fontFamily: fonts.medium, color: colors.gray }}>No withdraw history</Text>
    </View>
  }

  return (
    <View style={{
      gap: 10
    }}>
      {
        data.map((item: any, index: number) => {
          const accountDataParsed = JSON.parse(item.account_data)
          return <View style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafafa', borderColor: "#e5e5e5", padding: 20, borderWidth: 0.5, borderRadius: 20,
          }} key={index}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View><Image source={icons.coins} style={{ height: 40, aspectRatio: 1, resizeMode: 'contain', }} /></View>
              <View>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: colors.text, fontFamily: fonts.semiBold }}>₹ {coin_to_inr(item.coins)}</Text>
                  <Text style={{ textTransform: 'capitalize', fontFamily: fonts.medium, color: getStatusColor(item.status) }}>{item.status}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Text style={{ color: colors.gray, fontSize: 13, fontFamily: fonts.regular }}>to {accountDataParsed.account_number}</Text>
                  <Text style={{ fontSize: 12, color: colors.gray, opacity: 0.8, fontFamily: fonts.regular }}>{item.ref_id || ''}</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={{ color: colors.gray, fontSize: 13, textAlign: 'right', fontFamily: fonts.regular }}>{new Date(item.created_at).toLocaleTimeString()}</Text>
              <Text style={{ color: colors.gray, fontSize: 13, textAlign: 'right', fontFamily: fonts.regular }}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        })
      }
    </View>
  )
}


function getStatusColor(color: string) {
  if (color === 'processing')
    return 'orange'
  else if (color === 'success')
    return 'limegreen'
  else if (color === 'failed')
    return 'red'
}

function coin_to_inr(coin: number) {
  // two decimal places
  const inr = coin / 100
  return inr.toFixed(2)
}
export default WithdrawHistory
