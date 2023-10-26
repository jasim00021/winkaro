// Styles of input elements

import { StyleSheet } from "react-native"
import { colors } from "./colors"
import { fonts } from "./fonts"

const input = StyleSheet.create({
    textInput: {
        backgroundColor: colors.inputBg,
        borderRadius: 10,
        padding: 15,
        width: 'auto',
        flex: 0.9,
        color: colors.text,
        fontFamily:fonts.medium
    },
    singleInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.inputBg,
        paddingLeft: 10,
        borderRadius: 10,
        width: 'auto',
    }, inputImage: {
        width: 17,
        height: 17,
        resizeMode: 'contain', flex: 0.1, opacity: 0.5
    },
})
export default input