import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { colors } from '../styles/colors'
import { fonts } from '../styles/fonts'

/*setModalAlert([{
          title: "Log Out", description: "Are you sure you want to log out?", type: "success", active: true,
          buttons: [
            { text: "No" },
            {
              text: "Yes", positive: true, onPress: async () => {
                await AsyncStorage.clear()
                navigation.replace('LogIn')
              },
            },
          ]
        }])
*/
export default function CustomModal({ modals, updater }: any) {

  return (
    <View style={{ width: '100%' }}>
      {
        modals.map((modal: any, i: number) => {
          const [modalActive, setModalActive] = useState(modal.active);
          const buttons = modal.buttons || [
            { text: 'OK', positive: true }
          ]
          return <Modal key={i} animationType="fade" transparent={true} visible={modalActive}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', width: '100%' }}>
              <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 25, paddingBottom: 20, alignItems: 'center', gap: 20, width: '80%' }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 18, color: colors.text, textAlign: 'center' }}>{modal.title}</Text>
                <Text style={{ fontSize: 16, color: colors.text, fontFamily: fonts.regular, }}>{modal.description}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-evenly', display: 'flex', width: '100%', gap: 20 }}>
                  {buttons.map((btn: any, i: number) => {
                    return <TouchableOpacity activeOpacity={0.8} key={i} style={{ width: buttons.length == 1 ? '100%' : '49%' }}
                      onPress={() => {
                        if (btn?.onPress) btn.onPress()
                        updater([])
                        setModalActive(!modalActive)
                      }}
                    >
                      <Text style={[modalStyles.modalButton, btn.positive ? modalStyles.buttonActive : {}]}>{btn.text}</Text>
                    </TouchableOpacity>
                  })}
                </View>
              </View>
            </View>
          </Modal>
        })
      }
    </View>
  )
}



const modalStyles = StyleSheet.create({
  modalButton: {
    fontFamily: fonts.medium, flexGrow: 1, textAlign: 'center',
    fontSize: 16, paddingVertical: 15, paddingHorizontal: 34, borderRadius: 10,
    backgroundColor: '#00000010', color: 'gray'
  },
  modalButtonYes: {
    color: 'dodgerblue',
    // backgroundColor : 'dodgerblue', color : 'white'
  },
  modalButtonNo: {
    color: 'red', backgroundColor: '#00000008'
    // backgroundColor: 'red', color: 'white'
  },
  buttonActive: {
    backgroundColor: colors.accent, color: 'white'
  }
})