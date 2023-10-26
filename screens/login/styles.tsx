import { StyleSheet } from 'react-native'
import { colors } from '../../styles/colors'
import { fonts } from '../../styles/fonts'

const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        padding: 20,
        gap: 5,
        width: '100%'
    },
    topImage: {
        height: 300,
        width: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        flex: 0.5,
    },
    title: {
        fontSize: 30,
        color: colors.text,
        fontFamily: fonts.bold
    },
    description: {
        fontSize: 15,
        color: colors.textLight,
        fontFamily: fonts.regular
    },
    main: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        padding: 20,
        width: '100%',
        gap: 5,
    },
    singleInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.inputBg,
        paddingLeft: 10,
        borderRadius: 10,
        width: 'auto',
    },
    inputImage: {
        width: 17,
        height: 17,
        resizeMode: 'contain', flex: 0.1, opacity: 0.5
    },
    input: {
        backgroundColor: colors.inputBg,
        borderRadius: 10,
        fontSize: 15,
        padding: 15,
        width: 'auto',
        flex: 0.9,
        color: colors.text,
        fontFamily: fonts.medium
    },
    label: {
        color: colors.textLight,
        fontSize: 15,
        fontFamily: fonts.regular,
        marginTop: 7
    },
})


export default styles