import {
	StyleSheet, Text, View,
	ScrollView, useWindowDimensions, Image, TouchableOpacity, Linking,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import { colors } from '../../../styles/colors';
import images from '../../../assets/images/images';
import { Touchable } from 'react-native';
import Loading from '../../../components/Loading';
import { API_URL } from '../../../appData';
import { getDefaultHeader } from '../../methods';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const scrollImages = [
// 	'https://source.unsplash.com/random/500x300',
// 	'https://source.unsplash.com/random/500x300',
// 	'https://source.unsplash.com/random/500x300',
// ];


const Slider = () => {
	const dimensions = useWindowDimensions()
	const width = dimensions.width - 30
	const height = (width - 30) * 0.6
	const [activeSlideIndex, setActiveSlideIndex] = useState(0)
	const scrollSlider = useRef<ScrollView>(null)
	const [banners, setBanners] = useState<any>(null)
	async function loadBanners() {
		try {
			const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
			const res = await fetch(API_URL.banners, { headers, method: 'POST' })
			const data = await res.json()
			// setBanners(data)
			console.log(banners)
			console.log(data)
			if (data.status === 'true' || data.status === true) {
				setBanners(data.data)
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		loadBanners()
	}, [])

	if (!banners) return <View style={{ height: height, }}><Loading /></View>
	if (banners.length === 0) return null



	return (
		<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15, paddingBottom: 20 }}>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={scrollingImages}
				scrollEventThrottle={100}
				style={{ width: dimensions.width, height, }}
				bounces={false}
				ref={scrollSlider}
				onTouchStart={scrollToCurrentIndex}
			>
				{
					banners.map((banner: any, index: number) => {
						return <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {
							Linking.openURL(banner.action_link)
						}}>
							<Image source={{
								uri: banner.source_link
							}} style={[styles.bannerImage, { width: width, height, marginHorizontal: 15, backgroundColor: colors.inputBg }]} />
						</TouchableOpacity>
					})
				}
			</ScrollView>
			<View style={{ flexDirection: 'row', marginTop: 10, gap: 8 }}>
				{
					banners.map((banner: any, index: number) => {
						return <Dot key={index} active={index === activeSlideIndex} />
					})
				}
			</View>
		</View>
	)

	function scrollingImages({ nativeEvent }: any) {
		const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
		setActiveSlideIndex(slide)

	}
	function scrollToCurrentIndex() {

	}
	function autoScroll() {
		let offset = 0;

	}
}

function Dot({ active }: any) {
	return <View style={{
		// backgroundColor: active ? 'black' : 'gray',
		backgroundColor: 'black',
		opacity: active ? 0.5 : 0.2,
		height: 7.5, borderRadius: 10,
		aspectRatio: active ? 1.7 : 1,
	}}></View>
}



export default Slider

const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: 'white',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bannerImage: {
		resizeMode: 'contain',
		borderRadius: 20
	}
})