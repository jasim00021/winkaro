import React, { useEffect } from 'react'
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native'


const Paginator = ({ data, scrollX, setIndex }: any) => {
	useEffect(() => {
		// setIndex(Math.floor(scrollX / width))
	})

	const { width } = useWindowDimensions()


	return (
		<View style={styles.container}>
			{
				data.map((_: any, i: number) => {
					const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
					const dotWidth = scrollX.interpolate({
						inputRange,
						outputRange: [10, 17, 10],
						extrapolate: 'clamp'
					})
					const bgColor = scrollX.interpolate({
						inputRange,
						outputRange: ['#ccc', '#555', '#ccc'],
						extrapolate: 'clamp'
					})
					return <Animated.View key={i} style={[styles.dot, { width: dotWidth, backgroundColor: bgColor }]} />
				})
			}
		</View>
	)
}

export default Paginator

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 20,
		// backgroundColor : '#f0f'
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 5,
		backgroundColor: '#ccc',
		marginHorizontal: 6
	}
})
