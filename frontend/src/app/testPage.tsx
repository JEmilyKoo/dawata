import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import Constants from 'expo-constants'
import * as Location from 'expo-location'

export default function LiveScreen() {
  const webViewRef = useRef<WebView>(null)
  const kakaoJsApiKey = Constants.expoConfig?.extra?.kakaoJsApiKey
  const [webViewLoaded, setWebViewLoaded] = useState(false) // WebView 로드 상태 추적

  useEffect(() => {
    let unsubscribe: Location.LocationSubscription | null = null

    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('위치 권한이 거부되었습니다')
        return
      }

      unsubscribe = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          const { latitude, longitude } = location.coords

          console.log('📍 내 위치 전송: ', latitude, longitude)

          if (webViewLoaded) {
            webViewRef.current?.postMessage(
              JSON.stringify({ latitude, longitude }),
            )
          }
        },
      )
    })()

    return () => {
      // ✅ cleanup (위치 감지 중지)
      if (unsubscribe) {
        unsubscribe.remove()
      }
    }
  }, [webViewLoaded])

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJsApiKey}&libraries=services"></script>
      <script>
        let map;
        let marker;

        function initKakaoMap() {
          const container = document.getElementById('map_div');
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
          };
          map = new kakao.maps.Map(container, options);
        }

        function updateMyLocation(lat, lng) {
          console.log("📌 업데이트 위치: ", lat, lng)
          const position = new kakao.maps.LatLng(lat, lng);
          
          if (!marker) {
            marker = new kakao.maps.Marker({
              position: position,
              map: map
            });
          } else {
            marker.setPosition(position);
          }
          map.setCenter(position);
        }

        // ✅ React Native → WebView 데이터 수신
        window.addEventListener('message', (event) => {
          try {
            console.log('📩 메시지 수신 from RN')
            const data = JSON.parse(event.data);
            updateMyLocation(data.latitude, data.longitude);
          } catch (e) {
            console.error('🚨 잘못된 데이터: ', event.data);
          }
        });

        function notifyReactNative() {
          window.ReactNativeWebView.postMessage("WebView Loaded");
        }
      </script>
      <style>
        html, body, #map_div {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body onload="initKakaoMap(); notifyReactNative();">
      <div id="map_div"></div>
    </body>
  </html>
  `

  return (
    <View className="flex-1">
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        className="flex-1"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          console.log(
            '📩 WebView → React Native 메시지 수신:',
            event.nativeEvent.data,
          )
          if (event.nativeEvent.data === 'WebView Loaded') {
            setWebViewLoaded(true)
          }
        }}
        onError={(syntheticEvent) => {
          console.warn('⚠️ WebView error: ', syntheticEvent.nativeEvent)
        }}
      />
    </View>
  )
}
