import {
  Alert, BackHandler,
  Animated, Dimensions, Easing, Image, Modal,
  ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { fonts } from '../../styles/fonts'
import { colors } from '../../styles/colors'
import images from '../../assets/images/images'
import { Touchable } from 'react-native'
import ButtonFull from '../../components/ButtonFull'
import icons from '../../assets/icons/icons'
import Video from 'react-native-video'
import buttons from '../../styles/buttons'
import { Linking } from 'react-native'
import RecordScreen, { RecordingStartResponse } from 'react-native-record-screen';
import { RecordingResult } from 'react-native-record-screen'
import CustomModal from '../../components/CustomModal'
import { getDefaultHeader } from '../methods'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../appData'
import Loading from '../../components/Loading'
import { Clipboard } from 'react-native'
import RNRestart from 'react-native-restart';
// import {Video as CVideo} from 'react-native-video'
// import { Video as CVideo } from 'react-native-compressor'
// import VideoProcessing from 'react-native-video-processing';
import { stat } from 'react-native-fs';
import {
  GoBtn, TaskRejectedUI, TaskStatusUI, copyToClipboard,
  TaskAmount, SwipeUp, WatchTutorial, Uploading, WatchHelp
} from './Components'
import Chunk from './Chunk'
import Axios from 'axios';
import ChunkUpload from 'react-native-chunk-upload';


// const compressVideo = async (inputPath, outputPath) => {
//   try {
//     const videoInfo = await VideoProcessing.getVideoInfo(inputPath);
//     const compressedVideo = await VideoProcessing.compress({
//       source: inputPath,
//       quality: 'low', // Adjust the quality as per your requirements
//       bitrateMultiplier: 0.8, // Adjust the bitrate as per your requirements
//       outputPath,
//     });
//     console.log('Compressed video path:', compressedVideo);
//   } catch (error) {
//     console.error('Failed to compress video:', error);
//   }
// };

// const compressVideo = async (inputPath, outputPath) => {
//   try {
//     const videoInfo = await VideoProcessing.getVideoInfo(inputPath);
//     const compressedVideo = await VideoProcessing.compress({
//       source: inputPath,
//       quality: 'low', // Adjust the quality as per your requirements
//       bitrateMultiplier: 0.8, // Adjust the bitrate as per your requirements
//       outputPath,
//     });
//     console.log('Compressed video path:', compressedVideo);
//   } catch (error) {
//     console.error('Failed to compress video:', error);
//   }
// };

const { height, width } = Dimensions.get('window')

const API_LINKS: any = {
  'youtube': API_URL.get_yt_task,
  'yt_shorts': API_URL.get_yt_shorts_task,
  'instagram': API_URL.get_insta_task,
}

async function restartApp() {
  await AsyncStorage.setItem('refresh', 'true')
  RNRestart.Restart();
}


export default function YouTubeTask({ route, navigation }: any) {
  const [bottomSwipeIcon] = useState(new Animated.Value(0))
  const [topSwipeIcon] = useState(new Animated.Value(10))
  const [modalVisible, setModalVisible] = useState(false)
  const [recordingIndex, setRecordingIndex] = useState(-1)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [modals, setModals] = useState<any>([])
  const [progress, setProgress] = useState(0)
  const [uploadingIndex, setUploadingIndex] = useState(0)
  const [currentRecordingTaskId, setCurrentRecordingTaskId] = useState(-1)
  const [tasks, setTasks] = useState<any>(null)
  const [uploadResponse, setUploadResponse] = useState<any>(null)
  const [isErrorUploading, setIsErrorUploading] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const xhr = new XMLHttpRequest();
  const taskType = route.params.taskType
  // const RecordScreen = require('react-native-record-screen').default



  function cancelUpload() {
    console.log('Cancel upload')
    xhr.abort()
    setModals([{
      title: "Are you sure?",
      description: "Are you sure you want to cancel this upload? This will stop your recording to complete the task.",
      buttons: [
        { text: "No" },
        {
          text: "Yes", positive: true, onPress: async () => {
            // Clear all recording files
            RecordScreen.clean().then(res => {
              console.log(res);
            }).catch(err => {
              console.log(err);
            })
            restartApp()
          },
        },
      ]
    }])
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bottomSwipeIcon, { toValue: 10, duration: 500, useNativeDriver: false, easing: Easing.linear }),
        Animated.timing(bottomSwipeIcon, { toValue: 0, duration: 500, useNativeDriver: false, easing: Easing.linear })
      ])
    ).start()
  }, [])


  async function getTasks(taskType: string) {
    const headers = getDefaultHeader(await AsyncStorage.getItem('token'))
    const res = await fetch(API_LINKS[taskType], { method: 'POST', headers: headers })
    const data = await res.json()
    // data.data.shift()
    setTasks(data.data)
    // console.log(data.data)
  }
  useEffect(() => {
    getTasks(taskType)
  }, [])

  useEffect(() => {
    const backAction = () => {
      // Clear all recording files
      // RecordScreen.clean().then(res => {
      //   console.log(res);
      // }).catch(err => {
      //   console.log(err);
      // })

      if (recordingIndex === -1)
        return false;
      setModals([{
        title: "Are you sure?",
        description: "Are you sure you want to go back? This will stop your recording to complete the task and you have to start again.",
        type: "success", active: true,
        buttons: [
          { text: "No" },
          {
            text: "Yes", positive: true, onPress: () => {
              cancelRecording()
              restartApp()
            },
          },
        ]
      }])
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [recordingIndex])

  async function startRecording(index: number, id: number) {
    // let clear = await RecordScreen.clean()
    // console.log(clear)
    try {
      let res = await RecordScreen.startRecording({ mic: false, })
      // res = await RecordScreen.startRecording({ mic: false })
      if (res === RecordingResult.PermissionError) {
        console.log("Permission Error")
        Alert.alert('Permission Error', 'Please allow the permission to record screen')
      } else if (res === RecordingResult.Started) {
        // Everything is ok
        setCurrentRecordingTaskId(id)
        console.log(id)
        console.log("Start Recording");
        console.log(res);
        setRecordingIndex(index)
      } else {
        console.log(res)
      }
    } catch (err) {
      console.log(err)
      setRecordingIndex(-1)
    }
  }


  let timer: any = null

  function stopRecording() {
    RecordScreen.stopRecording().then(async res => {
      let video_url = 'file://' + res.result.outputURL


      // console.log('Compressed', compressedVideo)
      setUploadingIndex(recordingIndex)
      setRecordingIndex(-1)
      // uploadVideo()
      uploadV2()


      // RecordScreen.clean().then(data => {
      //   console.log(data)
      // })

      async function uploadVideo() {
        console.log('Uploading Video...')
        setStartTime(new Date().getTime())
        setIsUploading(true)
        setIsErrorUploading(false)
        const auth = await AsyncStorage.getItem('token')
        const formData = new FormData();
        formData.append('task_id', currentRecordingTaskId)
        formData.append('proof_src', {
          uri: video_url,
          type: 'video/mp4',
          name: 'video.mp4'
        });

        xhr.upload.addEventListener('progress', (e) => {
          const percent = e.loaded / e.total;
          let progress = Math.round(percent * 100);
          if (progress === 100) { progress = 99 }
          setProgress(progress)
        });

        xhr.addEventListener('load', () => {
          console.log('Completed')
          setIsUploading(false)
          setUploadResponse(xhr.response)
          setModals([{
            title: "Success", description: "Your video has been uploaded successfully.", type: "success", active: true,
            buttons: [{
              text: "Ok", positive: true, onPress: async () => {
                // navigation.goBack(),
                restartApp()
              }
            },]
          }])

          // Delete the video from the phone
          RecordScreen.clean().then(data => {
            console.log(data)
          })
        });

        xhr.open('POST', API_URL.upload_task);
        xhr.setRequestHeader('secret', 'hellothisisocdexindia')
        xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Authorization', `Bearer ${auth}`)
        xhr.addEventListener('error', (e) => {
          console.log('Error')
          console.log(e)

          // Reset network request
          xhr.abort()
          setIsErrorUploading(true)

          timer && clearTimeout(timer)

          // Retry after 5 seconds
          // timer = setTimeout(() => {
          //   uploadVideo()
          // }, 10000);


          // Ask the user to retry
          // setModals([{
          //   title: "Error", description: "There was an error uploading your video. Please try again.", type: "error", active: true,
          //   buttons: [{
          //     text: "Retry", positive: true, onPress: () => {
          //       uploadVideo()
          //     }
          //   },
          //   {
          //     text: "Cancel", positive: false, onPress: () => {
          //       // Delete all the files
          //       RecordScreen.clean()
          //       restartApp()
          //     }
          //   }]
          // }])
        })
        xhr.send(formData);
      }

      async function uploadV2() {
        console.log('Uploading Video...')
        setStartTime(new Date().getTime())
        setIsUploading(true)
        setIsErrorUploading(false)

        const token = await AsyncStorage.getItem('token')
        const file = await stat(video_url);
        const fileName = video_url.split('/').pop();

        console.log(file.originalFilepath)

        const chunk = new ChunkUpload({
          path: video_url, // Path to the file
          size: 1_048_577, // Chunk size (must be multiples of 3)
          fileName: fileName as string, // Original file name
          fileSize: file.size, // Original file size

          // Errors
          // onFetchBlobError: (e) => console.log(e),
          // onWriteFileError: (e) => console.log(e),
        });

        chunk.digIn(upload.bind(chunk));

        function upload(file: any, next: any, retry: any, unlink: any) {
          const body = new FormData();

          body.append('video', file.blob);
          body.append('task_id', currentRecordingTaskId);

          Axios.post(API_URL.upload_task_v2, body, {
            headers: {
              "Content-Type": "multipart/form-data",
              "Accept": 'application/json',
              "secret": 'hellothisisocdexindia',
              'Authorization': `Bearer ${token}`,

              // 💥 Choose one of the following methods:

              // 1️⃣ If you're using the wester-chunk-upload php library...
              ...file.headers,

              // 2️⃣ Customize the headers
              "x-chunk-number": file.headers["x-chunk-number"],
              "x-chunk-total-number": file.headers["x-chunk-total-number"],
              "x-chunk-size": file.headers["x-chunk-size"],
              "x-file-name": file.headers["x-file-name"],
              "x-file-size": file.headers["x-file-size"],
              "x-file-identity": file.headers["x-file-identity"]
            }
          })
            .then(response => {
              setIsErrorUploading(false)
              switch (response.status) {
                // ✅ done
                case 200:
                  console.log(response.data);
                  setIsUploading(false)
                  setUploadResponse(response.data)
                  setModals([{
                    title: "Success", description: "Your video has been uploaded successfully.", type: "success", active: true,
                    buttons: [{
                      text: "Ok", positive: true, onPress: async () => {
                        // navigation.goBack(),
                        restartApp()
                      }
                    },]
                  }])

                  break;
                // 🕗 still uploading...
                case 201:
                  console.log(`${response.data.progress}% uploaded...`);
                  // Show the progress
                  setProgress(response.data.progress)

                  next();
                  break;
              }
            })
            .catch(error => {
              console.log(error)
              setIsErrorUploading(true)
              if (error.response) {
                if ([400, 404, 415, 500, 501].includes(error.response.status)) {
                  console.log(error.response.status, 'Failed to upload the chunk.');

                  unlink(file.path);
                  // Show failed to upload the chunk
                  setModals([{
                    title: "Error", description: "There was an error uploading your video. Please try again.", type: "error", active: true,
                    buttons: [{
                      text: "Retry", positive: true, onPress: () => {
                        uploadVideo()
                      }
                    },
                    {
                      text: "Cancel", positive: false, onPress: () => {
                        // Delete all the files
                        RecordScreen.clean()
                        restartApp()
                      }
                    }]
                  }])
                } else if (error.response.status === 422) {
                  console.log('Validation Error', error.response.data);
                  // Show the validation error
                  unlink(file.path);
                  setModals([{
                    title: "Error", description: error.response.data.message, type: "error", active: true,
                    buttons: [{
                      text: "Retry", positive: true, onPress: () => {
                        uploadVideo()
                      }
                    },
                    {
                      text: "Cancel", positive: false, onPress: () => {
                        // Delete all the files
                        RecordScreen.clean()
                        restartApp()
                      }
                    }]
                  }])
                } else {
                  console.log('Re-uploading the chunk...');
                  setTimeout(() => {
                    retry();
                  }, 1000);
                }
              } else {
                console.log('Re-uploading the chunk...');
                setTimeout(() => {
                  retry();
                }, 1000);
              }
            });
        }
      }





    }).catch(err => {
      console.log(err);
      setModals([{
        title: "Error", description: err, active: true,
      }])
    })
  }
  function cancelRecording() {
    xhr.abort()
    RecordScreen.stopRecording().then(res => {
      RecordScreen.clean().then(data => {
        console.log(data)
      })
      setRecordingIndex(-1)
    }).catch(err => {
      console.log(err);
    })
  }

  if (tasks === null)
    return <Loading />


  if (tasks.length === 0) {
    return <View className='flex-1 justify-center items-center bg-white'>
      <Text style={{ fontFamily: fonts.medium, color: colors.text }}>
        No tasks available for today
      </Text>
    </View>
  }


  return (
    <View style={{
      backgroundColor: 'white', flex: 1
    }}>
      <CustomModal modals={modals} updater={setModals} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)',
        }}>
          <View style={{
            backgroundColor: 'white', padding: 25, borderRadius: 25, gap: 30,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <Image source={icons.swipe_up_finger} />
            <Text style={{
              fontSize: 20, fontFamily: fonts.regular, color: colors.text, textAlign: 'center'
            }}>Swipe Up To View Next Task</Text>
            <ButtonFull title='Ok, Got it' onPress={() => {
              setModalVisible(false)
            }} />
          </View>
        </View>

      </Modal >
      <ScrollView
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        {
          tasks.map((task: any, index: number) => {
            return <Task task={task} index={index} key={index} />
          })}
      </ScrollView>
    </View >
  )

  function Task({ task, index }: { task: any, index: number }) {
    const task_name = task.data.task_name
    const title = task.data.title
    const reward_coin = task.data.reward_coin
    const thumbnail_image = task.data.thumbnail_image
    const publisher = task.data.publisher
    const action_url = task.data.action_url
    const ends_at = task.data.expire_at
    const id = task.data.id
    const [s, ss] = useState(task.status)
    // const [status, setStatus] = useMemo(() => [s, ss], [s])
    const now = new Date()
    const end = new Date(ends_at)
    const isExpired = now > end
    const [isCopied, setIsCopied] = useState(false)
    // const isExpired = false

    return <View style={{ height: height, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }} key={index}>
      <View>
        <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10, paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontFamily: fonts.semiBold, color: colors.text, textAlign: 'center' }}>
            {task_name}
          </Text>
        </View>
        <View>
          {/*16 : 9 Video Thumbnail*/}
          {
            taskType === 'youtube' ?
              <Image source={{ uri: thumbnail_image }} style={{ width: width - 40, height: (width - 40) * 9 / 16, alignSelf: 'center', borderRadius: 25, }}></Image>
              :
              <View>
                <Image blurRadius={10} source={{ uri: thumbnail_image }} style={{ width: width - 40, height: (width - 40) * 12 / 16, alignSelf: 'center', borderRadius: 25, }}></Image>
                <Image source={{ uri: thumbnail_image }} style={{ width: width - 40, height: (width - 40) * 12 / 16, position: 'absolute', resizeMode: 'contain', }}></Image>
              </View>
          }
          <View style={{ flexDirection: 'row', width: width - 50, alignItems: 'center', justifyContent: 'space-between', marginTop: 15, gap: 10 }}>
            <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0, width: width - 100 }}>
              <TouchableOpacity onPress={() => {
                setModals([...modals, {
                  title: "Task Title", description: title, type: "info", active: true,
                  buttons: [{
                    text: "Ok",
                  },
                  {
                    text: "Copy", positive: true, onPress: () => {
                      copyToClipboard(title), setIsCopied(true)
                      setTimeout(() => { setIsCopied(false) }, 5000)
                    }
                  }]
                }])
              }}>
                <Text numberOfLines={3} style={{ fontSize: 16, fontFamily: fonts.medium, color: colors.text, }}>
                  {title}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.text, fontFamily: fonts.regular, marginTop: 10 }}>Publisher : <Text style={{ fontFamily: fonts.medium, color: colors.accent }}>
                {publisher}
              </Text></Text>
            </View>
            <View style={{ backgroundColor: '#f5f5f5', borderColor: '#e5e5e5', borderWidth: 0.5, borderRadius: 10, padding: 10, }}>
              <TouchableOpacity onPress={() => {
                copyToClipboard(title), setIsCopied(true)
                setTimeout(() => { setIsCopied(false) }, 5000)
              }}>
                <Image source={isCopied ? icons.check : icons.copy} style={{
                  width: 23, height: 23, alignSelf: 'center', resizeMode: 'contain',
                  tintColor: isCopied ? 'limegreen' : colors.text
                }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <TaskAmount coins={reward_coin} endTime={ends_at} />
      <WatchHelp navigation={navigation} taskType={taskType} />
      <View style={{ width: '100%' }}>

        {s === 'rejected' ? <TaskRejectedUI reason={task.remarks} retry={ss} /> : null}
        <View style={{ paddingHorizontal: 20, marginTop: 10, width: '100%', gap: 15 }}>
          {
            s === 'complete' || s === 'processing' ? <TaskStatusUI status={s} /> :
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                {
                  isExpired ? null :
                    isUploading ?
                      uploadingIndex === index ?
                        <Uploading progress={progress} cancel={() => cancelUpload()} isError={isErrorUploading} startTime={startTime} />
                        : <TouchableOpacity style={[buttons.full, { width: width - 40, backgroundColor: 'grey' }]} activeOpacity={0.8} disabled>
                          <Image source={icons.record} style={{ width: 20, height: 20, alignSelf: 'center', resizeMode: 'contain', tintColor: 'white' }} />
                          <Text style={[{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium },]}>Uploading another task</Text>
                        </TouchableOpacity>
                      :
                      recordingIndex === index ?
                        <>
                          <TouchableOpacity style={[buttons.full, { width: width * 2 / 3 - 25, backgroundColor: 'red' }]} activeOpacity={0.8} onPress={() => stopRecording()}>
                            <Image source={icons.record} style={{ width: 20, height: 20, alignSelf: 'center', resizeMode: 'contain', tintColor: 'white' }} />
                            <Text style={[{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium },]}>Stop and Complete</Text>
                          </TouchableOpacity>
                          <GoBtn url={action_url} />
                        </>
                        :
                        <>
                          {
                            recordingIndex === -1 ?
                              <>
                                <TouchableOpacity style={[buttons.full, { width: width - 40 }]} activeOpacity={0.8} onPress={() => startRecording(index, id)}                          >
                                  <Image source={icons.record} style={{ width: 20, height: 20, alignSelf: 'center', resizeMode: 'contain', tintColor: 'white' }} />
                                  <Text style={[{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium },]}>{
                                    s === 'rejected' ? 'Retry Task' : 'Start Recording'
                                  }</Text>
                                </TouchableOpacity>
                              </>
                              :
                              <TouchableOpacity style={[buttons.full, { width: width - 40, backgroundColor: 'grey' }]} activeOpacity={0.8} disabled>
                                <Image source={icons.record} style={{ width: 20, height: 20, alignSelf: 'center', resizeMode: 'contain', tintColor: 'white' }} />
                                <Text style={[{ textAlign: 'center', fontSize: 15, color: 'white', fontFamily: fonts.medium },]}>Recording another task</Text>
                              </TouchableOpacity>
                          }
                        </>
                }
              </View>
          }
        </View>
        <SwipeUp bottomSwipeIcon={bottomSwipeIcon} topSwipeIcon={topSwipeIcon} isVisible={index == tasks.length - 1 ? false : true} />
      </View>
    </View>
  }
}


const test = {
  "data": [{
    "balance": 14549,
    "created_at": "2023-04-04T11:03:35.000000Z",
    "email": "codeabinash@gmail.com",
    "id": 6, "name": "Abinash Karmakar",
    "phone": "9547400680",
    "profile_pic": "https://winkaro.codexindia.com/storage/users/profiles/JfSYlJk03rR07l9di0MMv7H9kkMQ0nFPzMb40tOL.jpg",
    "refer_code": "WIN561226",
    "referred_by": null, "updated_at": "2023-04-09T11:39:35.000000Z"
  }],
  "message": "user retrieve successfully",
  "status": true,
  "unread_alert": 0
}



function generateRandomString(length = 32) {
  return [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
}