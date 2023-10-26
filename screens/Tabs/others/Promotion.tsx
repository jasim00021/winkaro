import { StyleSheet, Text, View, Modal, Alert, TouchableOpacity, Image, ScrollView, Button, Linking } from 'react-native'
import React from 'react'
import images from '../../../assets/images/images'
import { colors } from '../../../styles/colors'
import ButtonFull from '../../../components/ButtonFull'
import { fonts } from '../../../styles/fonts'
import { email } from '../../../appData'


const Promotion = () => {
  const [modalVisible, setModalVisible] = React.useState(false)

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white' }}>
      <View style={{ width: '100%', padding: 20, }}>
        <Image source={images.refer} style={{
          width: '100%',
          height: 200, marginTop: 20,
          resizeMode: 'contain',
        }} />
      </View>
      <Text style={{ fontSize: 25, textAlign: 'center', color: colors.text, fontFamily: fonts.medium }}>Contact us for promotion</Text>
      <View style={{
        paddingHorizontal: 30,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.emailText}>Send us email : </Text>
          {/* <TouchableOpacity > */}
          <Text selectable={true} style={[styles.emailText, { color: colors.accent }]}>{email}</Text>
          {/* </TouchableOpacity> */}
          <Text style={styles.emailText}> for promotion</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <ButtonFull title='Send Email' onPress={sendEmail} />
      </View>
    </View>
  )
}

export default Promotion

function sendEmail() {
  Linking.openURL(`mailto:${email}`)
}


const styles = StyleSheet.create({
  emailText: {
    fontSize: 15, color: colors.gray, fontFamily: fonts.regular
  }
})



{/* <TouchableOpacity onPress={() => {
        setModalVisible(true)
        // Alert.alert('Modal has been closed')
      }}>
        <Text>Promotion</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            width: '80%',
            height: '50%',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity onPress={()=>{setModalVisible(false)}}>
              <Text>Close modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}