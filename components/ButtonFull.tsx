import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import buttons from '../styles/buttons'
import { fonts } from '../styles/fonts'

const ButtonFull = ({ title, onPress, styles, disabled, textStyles }: any) => {
    if (!styles) styles = {}
    if (!textStyles) textStyles = {}
    return (
        <TouchableOpacity style={[buttons.full, styles]} onPress={onPress} activeOpacity={0.8} disabled={disabled}>
            <Text style={[{ textAlign: 'center', fontSize: 16, color: 'white', fontFamily: fonts.medium }, textStyles]}>{title || 'Sample Button'}</Text>
        </TouchableOpacity>
    )
}

export default ButtonFull

const styles = StyleSheet.create({})