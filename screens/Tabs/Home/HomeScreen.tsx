import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Dimensions, BackHandler, ToastAndroid,
	Image, Linking, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet,
	Text, TouchableOpacity, View
} from 'react-native';
import icons from '../../../assets/icons/icons';
import { colors } from '../../../styles/colors';
import { fonts } from '../../../styles/fonts';
import { UserData } from '../../types';
import Slider from './Slider';
import changeNavigationBarColor, { hideNavigationBar } from 'react-native-navigation-bar-color';
import { API, API_URL } from '../../../appData';
import { getDefaultHeader, storeUserData } from '../../methods';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import CustomModal from '../../../components/CustomModal';
import images from '../../../assets/images/images';
import ButtonFull from '../../../components/ButtonFull';

const { width, height } = Dimensions.get('window')



const HomeScreen = ({ navigation }: any) => {
	const [name, setName] = useState('')
	const [balance, setBalance] = useState('')
	const [notificationCount, setNotificationCount] = useState(0)
	const [profile_pic, setProfilePic] = useState<any>(null)
	const focused = useIsFocused()
	const [appAlert, setAppOpenAlert] = useState(false)
	const [statusBarColor, setStatusBarColor] = useState('white')
	const [popupActionUrl, setPopupActionUrl] = useState('')
	const [popupDescription, setPopupDescription] = useState('')
	const [popupImageSrc, setPopupImageSrc] = useState('')




	let backCount = useMemo(() => 0, [])

	async function updateUserData() {
		const headers = await getDefaultHeader(await AsyncStorage.getItem('token') as string)
		const fetched = await fetch(API_URL.get_user, { method: 'POST', headers })
		const res = await fetched.json()
		// console.log(res)
		if (res.status === true || res.status === 'true')
			storeUserData(res)
		else { }
	}

	async function closeAppAlert() {
		setAppOpenAlert(false)
		// setStatusBarColor(colors.accent)
		setStatusBarColor('white')
	}
	useEffect(() => {
		async function setColors() {
			// setStatusBarColor('rgba(0,0,0,0.4)')
			// await changeNavigationBarColor('#999999', true);
		}


		async function loadPopup() {
			// Load alert on app open
			const headers = await getDefaultHeader(await AsyncStorage.getItem('token') as string)
			const data = await fetch(API_URL.popup, { method: 'POST', headers })
			const res = await data.json()

			// console.log(res)

			if (res.data == null || data.status == 0)
				return

			if (res.status == 'true' || res.status == true && res.data.status == '1') {
				setPopupActionUrl(res.data.action_url)
				setPopupDescription(res.data.description)
				setPopupImageSrc(res.data.image_src)
				console.log(res.data.image_src)
				setAppOpenAlert(true)
				setColors()
			}
		}
		// loadPopup()
	}, [])




	useEffect(() => { setTimeout(async () => { await changeNavigationBarColor('#ffffff', true); }, 0); }, [])

	useEffect(() => {
		if (focused)
			setTimeout(async () => {
				await updateUserData()
				// console.log('Focused')
				const userData = await AsyncStorage.getItem('userData')
				let data: UserData = JSON.parse(userData as string)
				setName(data.name.split(' ')[0])
				setBalance(data.balance)
				setNotificationCount(data.unread_alert)
				setProfilePic(data.profile_pic)
				// console.log(notificationCount)
			}, 0);
	}, [focused])


	// Disable hardware back button
	useEffect(() => {
		let bHandler: any;
		const backAction = () => {
			backCount++
			if (backCount > 1) BackHandler.exitApp()
			else ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
			setTimeout(() => { backCount = 0 }, 2000)
			return true;
		};
		if (focused) bHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
		else bHandler && bHandler.remove()
		return () => bHandler && bHandler.remove();
	}, [focused]);


	// update user data each 30 seconds
	useEffect(() => {
		const interval = setInterval(async () => {
			await updateUserData()
		}, 30000);
		return () => clearInterval(interval);
	}, [])


	return (
		<SafeAreaView style={{ paddingBottom: 50, backgroundColor: 'white', flex: 1 }}>
			<Modal visible={appAlert} animationType='fade' transparent={true} className='justify-center items-center'>
				<View className='flex-1'>
					<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
						<View style={{ width: '90%', backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', }}>
							<TouchableOpacity style={{
								position: 'absolute', top: -15, right: -15, zIndex: 1, borderRadius: 50,
								backgroundColor: 'rgba(0,0,0,0.3)', padding: 5
							}} onPress={closeAppAlert}>
								<Image source={icons.cancel} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
							</TouchableOpacity>
							{popupImageSrc &&
								// <TouchableOpacity onPress={() => Linking.openURL(popupActionUrl)} activeOpacity={0.8}>
								<View style={{
									borderRadius: 20, overflow: 'hidden', width: width * 0.9, height: (width * 0.9) * 9 / 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
								}}>
									<Image source={{
										uri: popupImageSrc
									}} style={{
										width: (width * 0.9) * 16 / 9, height: (width * 0.9) * 9 / 16, resizeMode: 'contain',
									}} />
								</View>
								// </TouchableOpacity>
							}
							<View style={{
								paddingHorizontal: 13, paddingVertical: 20
							}}>
								<Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.text }}>{popupDescription}</Text>
								<View className='pt-4' style={{
									width: width * 0.9 - 30,
								}}>
									{
										popupActionUrl === '#' ? null :
											<ButtonFull title='Open' className='mt-2' onPress={() => {
												Linking.openURL(popupActionUrl)
											}} />
									}
								</View>
							</View>
						</View>
					</View>
				</View>
			</Modal>
			<StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
			<View style={styles.top}>
				<TouchableOpacity activeOpacity={0.8}
					onPress={() => navigation.navigate('Profile')}
				>
					<View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15 }}>
						<Image source={profile_pic ? { uri: profile_pic } : icons.user_icon} style={styles.topImage} />
						<Text className='text-[#000] text-lg' style={{
							fontFamily: fonts.semiBold,
						}}>{name}</Text>
					</View>
				</TouchableOpacity>
				<View style={[styles.flexRow, { gap: 20 }]}>
					<TouchableOpacity activeOpacity={0.7}
						onPress={() => navigation.navigate('Wallet')}
					>
						<View style={[styles.flexRow, {
							backgroundColor: colors.inputBg,
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 50
						}]}>
							<Image source={icons.coin_dollar} style={[styles.topImage, { width: 20, height: 20 }]} />
							<Text style={{
								fontSize: 15, fontFamily: fonts.medium,
								color: colors.text,
							}}>{balance}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.8}
						onPress={() => navigation.navigate('Notifications')}
					>
						<View>
							<Image source={icons.notification_icon} style={[styles.topImage, { width: 20, height: 20, opacity: 0.9 }]} />
							<View style={[styles.dot, { opacity: notificationCount > 0 ? 1 : 0 }]}></View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView style={{ backgroundColor: 'white', width: '100%' }}>
				<Slider />
				<Tasks navigation={navigation} />
			</ScrollView>
		</SafeAreaView >
	)
}

function Tasks({ navigation }: any) {
	const [modals, setModals] = useState<any>([])
	useEffect(() => {

	}, [])

	function openTaskPage(taskType: string) {
		AsyncStorage.getItem('dontShowTaskTutorial').then((data) => {
			if (data === 'true') {
				navigation.navigate('YouTubeTask', {
					isFromHome: true,
					taskType
				})
			} else {
				navigation.navigate('TaskTutorial', {
					isFromHome: true,
					taskType
				})
			}
		})
	}


	const tasks = [
		{
			name: 'Youtube Tasks',
			icons: icons.youtube,
			callback: () => openTaskPage('youtube')
		},
		{
			name: 'Yt Short Tasks',
			icons: icons.youtube_shorts,
			callback: () => openTaskPage('yt_shorts')
		},
		{
			name: 'Instagram Tasks',
			icons: icons.insta,
			callback: () => openTaskPage('instagram')
		},
		{
			name: 'App install Tasks',
			icons: icons.download,
			callback: () => setModals([{ title: "Coming Soon", description: "We are working on this feature. It will be available soon. Stay tuned!", }]),
			// callback: () => {
			// navigation.navigate('InstallAndEarn')
			// console.log("Hello Abinash")
			// },
			background: '#fff'
		},
		{
			name: 'Watch and Earn',
			icons: icons.watch_and_earn,
			callback: () => navigation.navigate('DailyLimit', {
				earnedCoins: 0,
				from: 'watch'
			})
		},
		{
			name: 'Spin and \nEarn',
			icons: icons.spin_and_earn,
			callback: () => navigation.navigate('Spin')
		},
	]
	return (
		<View>
			<CustomModal modals={modals} updater={setModals} />
			<Text style={{ paddingLeft: 25, paddingBottom: 10, fontSize: 18, fontFamily: fonts.bold, color: colors.text }}>Explore tasks</Text>
			<View style={taskStyles.container}>
				{
					tasks.map((task, index) => {
						return (
							<View key={index} style={{ width: '30%' }}>
								<TouchableOpacity activeOpacity={0.5} onPress={task.callback}>
									<View style={taskStyles.task}>
										<Image source={task.icons} style={[taskStyles.image, { backgroundColor: task.background ? task.background : '#fff' }]} />
										<Text style={taskStyles.taskName}>{task.name}</Text>
									</View>
								</TouchableOpacity>
							</View>
						)
					})
				}
			</View>
		</View>
	)
}

export default HomeScreen;

const taskStyles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: 20,
		backgroundColor: 'white',
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// alignItems: 'center',
	},
	task: {
		backgroundColor: '#f5f5f5',
		marginTop: 15,
		borderRadius: 20,
		padding: 15,
		// backgroundColor: 'red',
	},
	image: {
		// tintColor: 'red',
		width: 70,
		height: 70,
		marginLeft: 'auto',
		marginRight: 'auto',
		resizeMode: 'contain',
		borderRadius: 15,
		backgroundColor: 'white',
	},
	taskName: {
		textAlign: 'center',
		marginTop: 10, fontFamily: fonts.medium,
		color: colors.text,
		fontSize: 13
	}
})

const styles = StyleSheet.create({
	mainBody: {
		flex: 1,
		width: '100%',
		paddingHorizontal: 20,
		paddingVertical: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 100,
		gap: 20,
		// backgroundColor: 'red',
	},
	main: {
		// flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',

	},
	top: {
		// flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
		paddingBottom: 12,
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#f5f5f5',
		justifyContent: 'space-between',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'white',
	},
	topImage: {
		height: 40,
		width: 40,
		borderRadius: 50,
		resizeMode: 'contain'
	},
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10
	},
	dot: {
		height: 8,
		width: 8,
		borderRadius: 50,
		backgroundColor: colors.accent,
		position: 'absolute',
		marginLeft: 17,
		marginTop: -4
	}
})

// const 