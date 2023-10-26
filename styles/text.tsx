import { StyleSheet } from 'react-native';
import { colors } from './colors';
// Styles of texts

export const txt = StyleSheet.create({
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    color: {
        color: colors.accent
    },
    text: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        margin: 10,
    },
    textInput: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
    },
    textInputError: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        margin: 10,
        borderWidth: 1,

        borderColor: '#f00',
        borderRadius: 5,
        padding: 10,
    },
    textInputSuccess: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: '#0f0',
        borderRadius: 5,
        padding: 10,
    },
});

export default txt;