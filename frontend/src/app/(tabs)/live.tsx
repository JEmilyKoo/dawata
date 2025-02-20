import { useEffect, useRef, useState } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'

import { set } from 'date-fns'
import Constants from 'expo-constants'
import * as Location from 'expo-location'

import { findLiveDetail, findLives } from '@/apis/live'
import BottomSheetContent from '@/app/live/components/BottomSheetContent'
import BottomSheet from '@/components/BottomSheet'
import Colors from '@/constants/Colors'
import {
  patchLiveData,
  resetLiveData,
  setLiveAppointmentId,
  setLiveData,
  setLiveLat,
  setLiveLog,
} from '@/store/slices/liveSlice'
import { RootState } from '@/store/store'
import {
  CustomOverlay,
  LiveMember,
  WebSocketLiveRequest,
  WebSocketLiveResponse,
} from '@/types/live'

const Live = () => {
  const [isLiveStart, setIsLiveStart] = useState(false) // 카카오 지도가 뜨고, 소켓 연결이 완료되고, 데이터가 다 불러오고 나야 라이브 스타트 가능.
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.member)
  const { liveAppointmentId, liveLat, liveLog } = useSelector(
    (state: RootState) => state.live,
  )
  const [messages, setMessages] = useState<WebSocketLiveResponse[]>([])
  const [convertedOverlayList, setConvertedOverlayList] = useState<
    CustomOverlay[]
  >([])

  const socketRef = useRef<WebSocket | null>(null)
  const [memberOverlayList, setMemberOverlayList] = useState<CustomOverlay[]>(
    [],
  )
  const [destinationOverlay, setDestinationOverlay] =
    useState<CustomOverlay | null>(null)
  const liveData = useSelector((state: RootState) => state.live.liveData)
  // const kakaoJSApiKey = Constants.expoConfig?.extra?.kakaoJSApiKey
  const kakaoJSApiKey = '19ea7ae7701988d8dc2bccca4ab5504c'
  const webViewRef = useRef<WebView | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0)
  const [webViewInit, setWebViewInit] = useState(false)
  useEffect(() => {
    fetchFindLives()
  }, [])

  const fetchFindLives = async () => {
    console.log('fetchFindLives')
    // const lives = 120
    const lives: number = await findLives()
    if (lives) {
      dispatch(setLiveAppointmentId(lives))
    } else {
      console.log('현재 진행중인 라이브가 없는 상태')
      dispatch(resetLiveData())
      clearCustomOverlay()
    }
  }

  const liveStart = async () => {
    const live = await findLiveDetail(liveAppointmentId)
    console.log('liveStart 라이브 데이터', live)
    if (live) {
      dispatch(setLiveData(live))
      dispatch(setLiveLat(live.latitude))
      dispatch(setLiveLog(live.longitude))
    }
  }
  let reconnectTimeout: NodeJS.Timeout | null = null

  useEffect(() => {
    if (!liveAppointmentId) return
    liveStart()

    let retryCount = 0
    const maxRetries = 5

    const connectWebSocket = () => {
      if (!liveAppointmentId) return
      if (retryCount >= maxRetries) {
        console.error('WebSocket 재연결 시도 초과')
        return
      }

      socketRef.current = new WebSocket(
        `ws://i12a301.p.ssafy.io:8080/appointment/${liveAppointmentId}`,
      )

      socketRef.current.onopen = () => {
        console.log('WebSocket 연결됨')
        retryCount = 0 // 연결되면 재시도 카운트 초기화
        // socketRef.current?.send('클라이언트에서 메시지 보냄')
      }

      socketRef.current.onmessage = (event) => {
        try {
          const data: WebSocketLiveResponse = JSON.parse(event.data)
          console.log('onmessage, data', data)

          setMessages((prev) => [...prev, data])
        } catch (error) {
          console.error('JSON 파싱 오류:', error)
        }
      }

      socketRef.current.onerror = (error) => {
        console.error('WebSocket 오류:', error)
      }

      socketRef.current.onclose = () => {
        console.log('WebSocket 연결 종료, 재연결 시도')
        retryCount++
        reconnectTimeout = setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      socketRef.current?.close()
      messageSetRef.current = new Set()
    }
  }, [liveAppointmentId])
  useEffect(() => {
    if (!isLiveStart && liveLat) {
      setIsLiveStart(true)
    }
  }, [liveLat])
  const messageSetRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (messages.length > 0) {
      const newMessages = messages.filter((msg) => {
        const key = `${msg.memberId}-${msg.arrivalState}-${msg.estimatedTime}`
        if (!messageSetRef.current.has(key)) {
          messageSetRef.current.add(key)
          return true
        }
        return false
      })
      console.log('뉴메시지', newMessages)
      if (newMessages.length > 0) {
        dispatch(patchLiveData(newMessages))
      }
    }
  }, [messages])

  useEffect(() => {
    console.log('바뀌었나요?')
    if (liveData && liveData?.participants.length == 0) return
    let newMemberOverlayList = liveData.participants.map(
      (participant: LiveMember) => ({
        id: participant.memberId,
        type: 'member',
        latitude: participant.latitude,
        longitude: participant.longitude,
        fillColor: getOverlayColor(participant.arrivalState),
        strokeColor: getOverlayColor(participant.arrivalState),
        textColor: Colors.primary,
        text: participant.nickname,
        img: participant.img,
        show:
          participant.arrivalState !== 'ABSENT' &&
          participant.arrivalState !== 'LOST',
      }),
    )
    console.log('아니저장을 했다고저장을', newMemberOverlayList)
    setConvertedOverlayList(newMemberOverlayList)
  }, [JSON.stringify(liveData?.participants)])

  useEffect(() => {
    if (liveLat && liveLog) {
      if (!destinationOverlay) {
        setDestinationOverlay({
          id: 0,
          type: 'destination',
          latitude: liveLat,
          longitude: liveLog,
          fillColor: Colors.primary,
          strokeColor: Colors.primary,
          textColor: 'white',
          text: '도착',
          show: true,
        })
      } else {
        setDestinationOverlay({
          ...destinationOverlay,
          latitude: liveLat,
          longitude: liveLog,
        })
      }
    }
  }, [liveLat, liveLog])

  const getOverlayColor = (arrivalState: string) => {
    if (arrivalState === 'NOT_ARRIVED') return Colors.light.yellow
    if (arrivalState === 'ARRIVED') return Colors.light.green
    if (arrivalState === 'LATE') return Colors.light.red
    return Colors.light.gray
  }

  useEffect(() => {
    console.log('convertedOverlayList 변경됨:', convertedOverlayList)
    if (!liveLat || !liveData?.participants) return

    if (convertedOverlayList?.length == 0) {
      clearCustomOverlay()
      setCustomOverlayList(convertedOverlayList)
    } else {
      setCustomOverlayList(convertedOverlayList)
    }
  }, [convertedOverlayList])

  useEffect(() => {
    if (destinationOverlay) {
      setCustomOverlay(destinationOverlay)
    }
  }, [destinationOverlay])

  const sendMessage = (request: WebSocketLiveRequest) => {
    try {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(request))
      } else {
        console.warn('WebSocket이 연결되지 않았습니다.')
      }
    } catch (error) {
      console.error('WebSocket 메시지 전송 오류:', error)
    }
  }

  useEffect(() => {
    if (!liveData?.participants) return
    let selectedParticipant = liveData.participants.find(
      (participant: LiveMember) => participant.memberId == selectedMemberId,
    )
    if (selectedParticipant) {
      panTo(selectedParticipant.latitude, selectedParticipant.longitude)
    }
  }, [selectedMemberId])

  const panTo = (lat: number, lng: number) => {
    webViewRef.current?.injectJavaScript(`panTo(${lat}, ${lng});`)
  }

  const clearCustomOverlay = () => {
    webViewRef.current?.injectJavaScript(`clearCustomOverlay();`)
    setMemberOverlayList([])
  }

  const updateLatLngCustomOverlay = (
    id: number,
    latitude: number,
    longitude: number,
  ) => {
    webViewRef.current?.injectJavaScript(
      `updateLatLngCustomOverlay(${id}, ${latitude}, ${longitude});`,
    )
  }

  const setCustomOverlay = (data: CustomOverlay) => {
    const jsonData = JSON.stringify(data)
    webViewRef.current?.injectJavaScript(`setCustomOverlay(${jsonData});`)
  }

  const setCustomOverlayList = (data: CustomOverlay[]) => {
    console.log('setCustomOverlayList 실행:', data)
    if (!webViewRef.current) {
      console.log('WebView ref가 없습니다')
      return
    }
    const jsonData = JSON.stringify(data)
    const jsCode = `setCustomOverlayList(${jsonData});`
    console.log('실행할 JavaScript:', jsCode)
    webViewRef.current.injectJavaScript(jsCode)
  }

  const updateLatLngCustomOverlayList = (data: CustomOverlay[]) => {
    const jsonData = JSON.stringify(data)
    webViewRef.current?.injectJavaScript(
      `updateLatLngCustomOverlayList(${jsonData});`,
    )
  }

  useEffect(() => {
    console.log('webViewInit✅✅✅✅✅✅')
    if (webViewInit && liveLat && liveLog) {
      console.log('시작을 했냐고')
      webViewRef.current?.injectJavaScript(`initMap(${liveLat}, ${liveLog});`)
      panTo(liveLat, liveLog)
      // setWebViewInit(false)
    }
  }, [webViewInit, liveLat, liveLog])
  const handleOnMessage = (event: any) => {
    console.log('아니뭐라고오시는데✅✅✅✅✅✅', event)
    try {
      const message = JSON.parse(event.nativeEvent.data)
      console.log('message✅✅✅✅✅✅', message?.action)
      if (!message.action) return

      if (message.action == 'webviewInit') {
        setWebViewInit(true)
      }
      if (message.action == 'clickOverlay' && message.id) {
        console.log('clickOverlay', message.id)
        setSelectedMemberId(message.id)
      }
      if (message.action === 'mapInitComplete') {
        panTo(liveLat, liveLog)
        setWebViewInit(false) // 모든 작업 완료 후 상태 리셋
      }
    } catch (error) {
      console.error('handleOnMessage 오류:', error)
    }
  }

  const onMessage = (event: unknown) => handleOnMessage(event)
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null,
  )

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('위치 권한이 거부되었습니다')
        return
      }

      if (!locationSubscriptionRef.current) {
        locationSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            const { latitude, longitude } = location.coords
            sendMessage({ memberId: user.memberId, latitude, longitude })
            updateLatLngCustomOverlay(user.memberId, latitude, longitude)
          },
        )
      }
    })()

    return () => {
      locationSubscriptionRef.current?.remove()
      locationSubscriptionRef.current = null
    }
  }, [])

  const webViewContent = `<!doctype html>
<html>
  <head>
    <meta
      http-equiv="Content-Type"
      content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <script
      type="text/javascript"
      src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJSApiKey}"></script>
    <script type="text/javascript">
      var mapContainer
      var mapOption
      var map
      var customOverlays = []
      function webviewInit() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: "webviewInit" })
        )
      }
      function initMap(latitude, longitude) {
        mapContainer = document.getElementById("map")
        mapOption = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3
        }
        map = new kakao.maps.Map(mapContainer, mapOption)
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'mapInitComplete' }));
      }
      function panTo(latitude, longitude) {
        var moveLatLon = new kakao.maps.LatLng(latitude, longitude)
        map.panTo(moveLatLon)
      }
      function updateLatLngCustomOverlay(id, latitude, longitude) {
        if (customOverlays[id]) {
          customOverlays[id].setPosition(new kakao.maps.LatLng(latitude, longitude))
        }
      }
      function setCustomOverlayList(data) {
        for (var i = 0; i < data.length; i++) {
          setCustomOverlay(data[i])
        }
      }
      function updateLatLngCustomOverlayList(data) {
        for (var i = 0; i < data.length; i++) {
          updateLatLngCustomOverlay(data[i].id, data[i].latitude, data[i].longitude)
        }
      }
      function setCustomOverlay(data) {
        if (customOverlays[data.id]) {
            // 기존 오버레이 삭제
            customOverlays[data.id].setMap(null);
            delete customOverlays[data.id];
        }

        // 새로운 오버레이 생성
        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(data.latitude, data.longitude),
            content: makeCustomOverlayContent(data),
             yAnchor: 1,
        });

         // 오버레이 표시
          if (data.show) {
              customOverlay.setMap(map);
              customOverlays[data.id] = customOverlay; // 새 오버레이 저장
          }
      }
      function clearCustomOverlay() {
        Object.keys(customOverlays).forEach((key) => {
          customOverlays[key].setMap(null)
          delete customOverlays[key]
        })
      }
      function clickOverlay(id) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ action: "clickOverlay", id }))
      }
      function makeCustomOverlayContent(data) {
        var background = makeCustomOverlayBackground(data)
        var content = \`<div class="overlay-content" onclick="clickOverlay(\${data.id})">
                  <div class="background-svg">
                      \${background}
                  </div>\`
        if (data.type == "member") {
          var content =
            content + \`<img class="member-img"  src="\${data.img}"></div>\`
        } else if (data.type == "address") {
          var content =
            content +
            \`<div class="address-text" style="color: \${data.textColor};">\${data.text}</div></div>\`
        } else if (data.type == "destination") {
          var content =
            content +
            \`<div class="destination-text" style="color: \${data.textColor};">\${data.text}</div></div>\`
        }
        return content
      }
      function makeCustomOverlayBackground(data) {
        var fillColor = data.fillColor
        var strokeColor = data.strokeColor
        var background = \`
          <svg width="48px" height="48px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M 41.91,22.24
             L 41.22,18.77
             L 39.87,15.51
             L 37.91,12.58
             L 35.42,10.09
             L 32.49,8.13
             L 29.23,6.78
             L 25.76,6.09
             L 22.24,6.09
             L 18.77,6.78
             L 15.51,8.13
             L 12.58,10.09
             L 10.09,12.58
             L 8.13,15.51
             L 6.78,18.77
             L 6.09,22.24
             L 6.09,25.76
             L 7.37,30.89
             L 9.03,34.00
             L 10.09,35.42
             L 11.27,36.73
             L 24.00,48.00
             L 36.73,36.73
             L 38.97,34.00
             L 40.63,30.89
             L 41.22,29.23
             L 41.91,25.76
             L 41.91,22.24
             Z"
          fill="\${data.fillColor}" stroke="\${data.strokeColor}" />
      </svg>\`
        return background
      }
    </script>
    <style>
      html,
      body,
      #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      .overlay-content {
        width: 48px;
        height: 48px;
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .background-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .member-img {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .address-text {
        position: relative;
        font-size: 24px;
        font-weight: 900;
        margin-bottom: 3px;
      }
      .destination-text {
        position: relative;
        font-size: 14px;
        font-weight: 900;
      }
    </style>
  </head>
  <body onload="webviewInit()">
    <div id="map"></div>
  </body>
</html>`

  return (
    <>
      {isLiveStart && (
        <View style={{ flex: 1 }}>
          {/* <Text>{JSON.stringify(memberOverlayList)}</Text> */}
          <View className="relative flex-1">
            <WebView
              ref={(ref) => (webViewRef.current = ref)}
              originWhitelist={['*']}
              source={{ html: webViewContent }}
              javaScriptEnabled={true} // 필수 설정
              onMessage={onMessage}
            />
          </View>
          <BottomSheet handleChange={() => {}}>
            {liveData && (
              <BottomSheetContent
                liveMembers={liveData.participants}
                liveAppointmentId={liveAppointmentId}
                selectedMemberId={selectedMemberId}
                setSelectedMemberId={setSelectedMemberId}></BottomSheetContent>
            )}
          </BottomSheet>
        </View>
      )}

      {!isLiveStart && (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
          <View className="w-3/4 h-1/2 justify-between">
            <Text>라이브 시작 전 대기 중...</Text>
            <View className="mb-4">
              <Image
                source={require('@/assets/images/wait_live.gif')}
                resizeMode="contain"
                style={{ width: '100%', maxHeight: 100 }}
              />
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default Live
