import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Easing, StatusBar, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';


// You can then use your `FadeInView` in place of a `View` in your components:
export default ({ navigation }: any) => {
	const [size, setSize] = useState(new Animated.ValueXY({ x: 15, y: 15 }));
	const [bottom, setBottom] = useState(new Animated.Value(0));
	const [isActive, setIsActive] = useState(false);
	const { height } = Dimensions.get('window');

	useEffect(() => {
		setTimeout(() => {
			sizeAnimation()
			Animated.timing(bottom, {
				toValue: (height / 2) - 100,
				duration: 500,
				useNativeDriver: false,
			}).start();
		}, 1500);
		topAnimation()
		setTimeout(() => {
			setIsActive(true)
		}, 2000);
	}, [])

	function topAnimation() {
		Animated.timing(bottom, {
			toValue: height / 2,
			duration: 1500,
			useNativeDriver: false,
			// Add bouncing effect
			easing: Easing.bounce,
		}).start();
	}

	function sizeAnimation() {
		Animated.timing(size, {
			toValue: { x: 200, y: 200 },
			duration: 500,
			useNativeDriver: false,
			// Add bouncing effect
			// easing: Easing.bounce,
		}).start();
	}


	return (
		<View style={{
			backgroundColor: 'white', flex: 1, justifyContent: "flex-start", alignItems: "center"
		}}>
			<StatusBar backgroundColor="white" barStyle="dark-content" />
			<Animated.View style={{}}>
				<Animated.View style={{
					height: size.x, width: size.y, backgroundColor: colors.accent, borderRadius: 100,
					top: bottom, display: 'flex', justifyContent: 'center', alignItems: 'center'
				}}
				>
					<Text style={{
						color: 'white', fontSize: 60, fontFamily: fonts.semiBold, opacity: isActive ? 1 : 0
					}}>WK</Text>
				</Animated.View>
			</Animated.View>
		</View>
	)
};