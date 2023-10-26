import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Easing, StatusBar, Text, View } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { API_URL, APP_VERSION_NAME } from '../appData';
import CustomModal from '../components/CustomModal';
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';
import { getDefaultHeader, storeUserData } from './methods';

// import { AsyncStorage } from 'react-native';


async function unexpectedLoggedOut(navigation: any, setModals: Function) {
  setModals([{ title: 'Error', description: 'Unexpectedly logged out from the app. Please login again.' }])
  await AsyncStorage.removeItem('isLoggedIn')
  navigation.replace('LogIn')
}

const Splash = ({ navigation }: any) => {
  async function mainProcess() {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
    const isOnboarding = await AsyncStorage.getItem('onboarding')


    const updateFetch = await fetch(API_URL.get_update, { method: 'POST', headers: getDefaultHeader(false) })
    const updateRes = await updateFetch.json()
    console.log(updateRes)


    // Check if there is any update available
    if (APP_VERSION_NAME != updateRes.version_code) {
      // Redirect to update screen
      console.log('Update available')
      navigation.replace('Update', {
        app_link: updateRes.app_link
      })
      await changeNavigationBarColor('white', true);
    } else
      if (isLoggedIn === 'true') {
        const token = await AsyncStorage.getItem('token')
        const headers = getDefaultHeader(token as string)
        try {
          const fetched = await fetch(API_URL.get_user, { method: 'POST', headers })
          const res = await fetched.json()

          // console.log(res)

          if (res.status === true || res.status === 'true') {
            await storeUserData(res)
            navigation.replace('Home')
            // Set navigation bar color to white
            await changeNavigationBarColor('white', true);
          }
          else {
            // Show error message
            await unexpectedLoggedOut(navigation, setModals)
          }
        }
        catch (err) {
          setModals([{ title: 'Network Error', message: 'Please check your internet connection and try again' }])
          // Retry after 5 seconds
          setTimeout(() => {
            mainProcess()
          }, 5000)
        }
      }
      else if (isOnboarding === 'true') {
        // Set navigation bar color to white
        await changeNavigationBarColor('white', true);
        navigation.replace('LogIn')
      }
      else {
        // Set navigation bar color to white
        await changeNavigationBarColor('white', true);
        navigation.replace('Onboarding')
      }
  }
  useEffect(() => {
    async function checkRefresh() {
      const isRefresh = await AsyncStorage.getItem('refresh')
      if (isRefresh === 'true') {
        // console.log('Refreshing')
        await AsyncStorage.removeItem('refresh')
        await AsyncStorage.removeItem('refresh')
        // Set navigation bar color to white
        await changeNavigationBarColor('white', true);
        navigation.replace('Home')
      }
      else {

        startAnimation()
        setTimeout(async () => {
          mainProcess()
        }, 3000)

      }
    }
    checkRefresh()
  }, []);
  const [modals, setModals] = React.useState<any>([])


  function startAnimation() {
    topAnimation()

    setTimeout(() => {
      sizeAnimation()
      Animated.timing(top, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 1500);

    setTimeout(() => {
      Animated.timing(borderRadius, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 1600);

    setTimeout(async () => {
      setIsActive(true)
      setStatusBarColor(colors.accent)
      await changeNavigationBarColor(colors.accent, true);
    }, 2000);
  }

  useEffect(() => {
    // startAnimation()
  }, [])

  // return (
  //   <View style={styles.main}>
  //     <StatusBar backgroundColor="white" barStyle="dark-content" />
  //     <CustomModal modals={modals} updater={setModals} />
  //     <View style={styles.center}>
  //       <View style={{
  //         // display: 'flex', justifyContent: 'center', alignItems: 'center',
  //         // width: 50, height: 50, overflow: 'hidden', borderRadius: 50
  //       }}>
  //         <Image source={icons.logo} style={styles.logo} />
  //       </View>
  //       {/* <Text style={{
  //         color: colors.gray, marginTop: 15
  //       }}>Connecting...</Text> */}
  //     </View>
  //   </View>
  // )
  // Animation takes total 4 seconds
  const [size] = useState(new Animated.ValueXY({ x: 15, y: 15 }));
  const [top] = useState(new Animated.Value(0));
  const [borderRadius] = useState(new Animated.Value(1000));
  const [isActive, setIsActive] = useState(false);
  const { height, width } = Dimensions.get('window');
  const [statusBarColor, setStatusBarColor] = useState('white')


  function topAnimation() {
    Animated.timing(top, {
      toValue: height / 2,
      duration: 1500,
      useNativeDriver: false,
      // Add bouncing effect
      easing: Easing.bounce,
    }).start();
  }
  function sizeAnimation() {
    Animated.timing(size, {
      toValue: { x: height, y: height },
      duration: 700,
      useNativeDriver: false,
    }).start();
  }
  return (
    <View style={{
      backgroundColor: 'white', flex: 1, justifyContent: "flex-start", alignItems: "center"
    }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarColor === colors.accent ? "light-content" : "dark-content"} />
      <CustomModal modals={modals} updater={setModals} />

      <Animated.View style={{}}>
        <Animated.View style={{
          height: size.x, width: size.y, backgroundColor: colors.accent, borderRadius: borderRadius,
          top: top, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
        >

          <View style={{
            opacity: isActive ? 1 : 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 100, fontFamily: fonts.semiBold, }}>WK</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export default Splash