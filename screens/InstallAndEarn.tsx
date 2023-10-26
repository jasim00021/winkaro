import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IronSource, IronSourceError, IronSourceOWCreditInfo, OfferwallEvents as OW } from 'ironsource-mediation';
const p = console.log
const e = console.error

const showOW = async () => {
  console.log('Show OW Click')
  const isAvailable = await IronSource.isOfferwallAvailable()
  console.log(`isOfferwallAvailable: ${isAvailable}`)
  if (isAvailable) {
    // Show OW
    IronSource.showOfferwall();

    // Show by placement
    IronSource.showOfferwall('Game_Screen')
  }
}

const getOWCreditInfo = () => {
  p('Get OW Credit Info click')
  IronSource.getOfferwallCredits()
}

const setOWCustomParams = async () => {
  const params = { currentTime: Date.now().toString() }
  await IronSource.setOfferwallCustomParams(params)
  // showAlert('Set OW Custom Params', [prettyJSON(params)])
}
const InstallAndEarn = () => {
  const [isOWAvailable, setIsOWAvailable] = useState<boolean>(false)

  useEffect(() => {
    // This must be called before IronSource.init().
    // Credits would be notified via onOfferwallAdCredited without calling getOfferwallCredits.
    // However, it's recommended to add proactive polling also.
    IronSource.setClientSideCallbacks(true);

    // initialize
    OW.removeAllListeners()

    // Set OW Event listeners
    OW.onOfferwallAvailabilityChanged.setListener((isAvailable: boolean) => {
      console.log(`onOfferwallAvailabilityChanged isAvailable: ${isAvailable}`)
      setIsOWAvailable(isAvailable)
    })
    OW.onOfferwallOpened.setListener(() => console.log('onOfferwallOpened'))
    OW.onOfferwallShowFailed.setListener((error: IronSourceError) => {
      console.log('OW Show Error', (error))
      e(`onOfferwallShowFailed error:${JSON.stringify(error)}`)
    })
    OW.onOfferwallAdCredited.setListener(
      (creditInfo: IronSourceOWCreditInfo) => {
        // showAlert('OW Credit Info', [prettyJSON(creditInfo)])
        console.log(`onOfferwallAdCredited info:${JSON.stringify(creditInfo)}`)
      }
    )
    OW.onGetOfferwallCreditsFailed.setListener((error: IronSourceError) => {
      // showAlert('OW GetCredits Error', [prettyJSON(error)])
      e(`onGetOfferwallCreditsFailed error:${JSON.stringify(error)}`)
    })
    OW.onOfferwallClosed.setListener(() => console.log('onOfferwallClosed'))

    return () => OW.removeAllListeners()
  }, [])

  return (
    <View>
      <Text>Offerwall</Text>
      <TouchableOpacity onPress={showOW}>
        <Text style={{
          fontSize: 20, padding: 10, backgroundColor: 'red', color: 'white'
        }}>Show Offerwall</Text>
      </TouchableOpacity>
      <Text onPress={getOWCreditInfo}> Get Offerwall Credit Info</Text>
      <Text onPress={setOWCustomParams}> Set Offerwall Custom Params</Text>
    </View>
  )
}

export default InstallAndEarn

const styles = StyleSheet.create({})