import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useRef } from 'react'
import {
  Animated, FlatList, Image, SafeAreaView, StatusBar, StyleSheet,
  Text, TouchableOpacity, useWindowDimensions, View, Linking
} from 'react-native'
import icons from '../../assets/icons/icons'
import buttons from '../../styles/buttons'
import { colors } from '../../styles/colors'
import { fonts } from '../../styles/fonts'
import txt from '../../styles/text'
import data from './onboardingData'
import Paginator from './Paginator'
import { t_and_c_link } from '../../appData'

const Onboarding = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<any>(null)
  const [buttonText, setButtonText] = React.useState('Next')


  async function scrollTo() {
    console.log(currentIndex)
    if (currentIndex < data.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
      if (currentIndex === data.length - 2) {
        setButtonText('Get Started')
      }
      setCurrentIndex(currentIndex + 1)
    } else {
      // setButtonText('Get Started')
      // Go to login screen
      navigation.replace('LogIn')
      await AsyncStorage.setItem('onboarding', 'true')
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <FlatList
        data={data} renderItem={({ item }) => <BoardingItem item={item} key={item.key} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(key: any) => key.key}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } }, }], { useNativeDriver: false })}
        scrollEventThrottle={32}
        ref={slidesRef}
        scrollEnabled={false}
      />
      <Paginator data={data} scrollX={scrollX} setIndex={setCurrentIndex} />

      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 25,
        marginTop: 20,
      }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          if (currentIndex > 0) {
            slidesRef.current.scrollToIndex({ index: currentIndex - 1 })
            setCurrentIndex(currentIndex - 1)
            setButtonText('Next')
          }
        }}>
          <View style={{
            backgroundColor: colors.accentLight, padding: 13, paddingHorizontal: 25, borderRadius: 100, opacity: currentIndex === 0 ? 0 : 1
          }}>
            <Text style={{
              fontFamily: fonts.medium, color: colors.accent, fontSize: 16
            }}>Go Back</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={scrollTo} activeOpacity={0.8}>
          <View style={{
            backgroundColor: colors.accent, padding: 15, borderRadius: 100, paddingHorizontal: 25, paddingRight: 20, gap: 10,
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <Text style={{
              color: 'white',
              fontFamily: fonts.medium, fontSize: 16
            }}>{buttonText}</Text>
            <Image source={icons.back_bold} style={{
              width: 16, height: 16, resizeMode: 'contain', tintColor: 'white', marginLeft: 5
            }} />
          </View>
        </TouchableOpacity>

      </View>


      <View style={[styles.bottom, { width: '100%' }]}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
          <Text style={[styles.bottomText, { color: colors.gray, fontFamily: fonts.regular }]}>Read </Text>
          <TouchableOpacity onPress={() => Linking.openURL(t_and_c_link)}><Text style={[txt.color, styles.bottomText, { fontFamily: fonts.medium }]}>Terms and Conditions</Text></TouchableOpacity>
          <Text style={[styles.bottomText, { color: colors.gray, fontFamily: fonts.regular }]}> before using the app.</Text>
        </View>
      </View>
    </SafeAreaView >
  )
}

function BoardingItem({ item }: { item: any }) {
  const { width } = useWindowDimensions()

  return (
    <View style={[{ width, }, styles.boardingItem,]}>
      <Text></Text>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 0.3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.title, { fontFamily: fonts.semiBold, textAlign: 'center', marginBottom: 10 }]}>{item.title}</Text>
        <Text style={[styles.description, { fontFamily: fonts.regular }]}>{item.description}</Text>
      </View>
    </View>
  )
}


export default Onboarding

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  container: {
    flex: 3,
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    flex: 0.5,
    resizeMode: 'contain',
  },
  boardingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  title: {
    fontSize: 35,
    color: colors.text,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 20,
    // color: 'g',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  }, bottomText: {
    marginTop: 20, fontSize: 13
  }
})