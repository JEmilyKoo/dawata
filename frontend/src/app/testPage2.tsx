import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import Constants from 'expo-constants'
import * as Location from 'expo-location'

import BottomSheetContent from '@/app/live/components/BottomSheetContent'
import BottomSheet from '@/components/BottomSheet'
import { liveData } from '@/constants/liveData'
import { LiveMember } from '@/types/live'

interface LocationRecord {
  latitude: number
  longitude: number
  timestamp: number
}

const WebViewTest = () => {
  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  useState<Location.LocationObject | null>(null)
  const kakaoJSApiKey = Constants.expoConfig?.extra?.kakaoJSApiKey
  const webViewRef = useRef<WebView | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0)
  const [index, setIndex] = useState(0)

  const sendMessageToWebView = (message: string) => {
    return `document.getElementById('webviewtextbox').value = '${message}';`
  }

  useEffect(() => {
    panTo(37.494589, 126.868346)
  }, [selectedMemberId])

  const panTo = (lat: number, lng: number) => {
    webViewRef.current?.injectJavaScript(`panTo(${lat}, ${lng})`)
  }

  const clearCustomOverlay = () => {
    webViewRef.current?.injectJavaScript(`clearCustomOverlay()`)
  }

  const updateLatLngCustomOverlay = (id: number, lat: number, lng: number) => {
    webViewRef.current?.injectJavaScript(
      `updateLatLngCustomOverlay(${id}, ${lat}, ${lng})`,
    )
  }

  const setCustomOverlay = (
    id: number,
    type: string,
    lat: number,
    lng: number,
    fillColor: string,
    strokeColor: string,
    textColor: string,
    text: string,
    img: string,
  ) => {
    webViewRef.current?.injectJavaScript(
      `setCustomOverlay(${id}, ${type}, ${lat}, ${lng}, ${fillColor}, ${strokeColor}, ${textColor}, ${text}, ${img})`,
    )
  }

  const handleOnMessage = (event: any) => {
    if (event.nativeEvent.data.action == 'webviewInit') {
      webViewRef.current?.injectJavaScript(`initMap()`)
    }
    if (event.nativeEvent.data.action == 'clickOverlay') {
      console.log('clickOverlay', event.nativeEvent.data.id)
      setSelectedMemberId(event.nativeEvent.data.id)
    }
  }

  const onMessage = (event: unknown) => handleOnMessage(event)

  const handleChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('위치 권한이 거부되었습니다')
        return
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 50,
          distanceInterval: 5,
        },
        (location) => {
          console.log('내 위치를 받아옴', location)
          const { latitude, longitude } = location.coords

          // WebView로 위치 정보 전달
          webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new MessageEvent('message', {
              data: JSON.stringify(location))
            }));
          `)
        },
      )
    })()
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
      src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJSApiKey}"></script>
    <script type="text/javascript">
      var mapContainer
      var mapOption
      var map
      var customOverlays = []
      function webviewInit() {
        window.ReactNativeWebView.postMessage({ action: "webviewInit" })
      }
      function initMap() {
        mapContainer = document.getElementById("map")
        mapOption = {
          center: new kakao.maps.LatLng(37.494589, 126.868346),
          level: 3
        }

        map = new kakao.maps.Map(mapContainer, mapOption)
        var markerPosition = new kakao.maps.LatLng(37.494589, 126.868346)
        var marker = new kakao.maps.Marker({
          position: markerPosition,
        })
        marker.setMap(map)
      }
      function panTo(lat, lng) {
        var moveLatLon = new kakao.maps.LatLng(lat, lng)
        map.panTo(moveLatLon)
      }
      function updateLatLngCustomOverlay(id, lat, lng) {
        if (customOverlays[id]) {
          customOverlays[id].setPosition(new kakao.maps.LatLng(lat, lng))
        }
      }
      function setCustomOverlay(data) {
        if (customOverlays[data.id]) {
          console.log(customOverlays[data.id])
          let customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(data.latitude, data.longitude),
            content: makeCustomOverlayContent(data),
          })
          customOverlays[data.id].setMap(null)
          customOverlay.setMap(map)
          customOverlays[data.id] = customOverlay
        } else {
          var customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(data.latitude, data.longitude),
            content: makeCustomOverlayContent(data),
            yAnchor: 1,
          })
          customOverlay.setMap(map)
          customOverlays[data.id] = customOverlay
        }
      }
      function clearCustomOverlay() {
        for (var i = 0; i < customOverlays.length; i++) {
          customOverlays[i].setMap(null)
        }
        customOverlays = []
      }
      function clickOverlay(id) {
        window.ReactNativeWebView.postMessage({ action: "clickOverlay", id })
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
        height: 70%;
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
    <View style={{ flex: 1 }}>
      <View className="relative flex-1">
        <WebView
          ref={(ref) => (webViewRef.current = ref)}
          originWhitelist={['*']}
          source={{ html: webViewContent }}
          onMessage={onMessage}
        />
      </View>
      <BottomSheet handleChange={handleChange}>
        <BottomSheetContent
          liveMembers={liveData}
          selectedMemberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}></BottomSheetContent>
      </BottomSheet>
    </View>
  )
}

export default WebViewTest
