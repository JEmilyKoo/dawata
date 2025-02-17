import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'

import Constants from 'expo-constants'
import * as Location from 'expo-location'

import BottomSheetContent from '@/app/live/components/BottomSheetContent'
import { MemberDetailItem } from '@/app/live/components/MemberDetailItem'
import BottomSheet from '@/components/BottomSheet'
import { liveData } from '@/constants/liveData'
import { LiveMember } from '@/types/live'

interface LocationRecord {
  latitude: number
  longitude: number
  timestamp: number
}

interface User {
  id: string
  name: string
  avatar: string
  location?: LocationRecord
  details: {
    status: string
    lastActive: string
  }
}

export default function LiveScreen() {
  const { t } = useTranslation()
  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<LiveMember | null>(null)

  const TMAP_API_KEY = 'YBRKLWh8yp2cxRr7ZrktOariTykJhXPBaIQFLJiV'
  const [index, setIndex] = useState(0)
  const [selectedMemberId, setSelectedMemberId] = useState<number>(null)

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

  const kakaoJSApiKey = Constants.expoConfig?.extra?.kakaoJSApiKey

  const webViewRef = React.useRef<WebView>(null)

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJSApiKey}&libraries=services"></script>
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
          console.log("업데이트 마이 로케이션, lat,lng ")
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

        // React Native에서 호출할 함수 정의
 document.addEventListener('message', function(event) {
    try {
      console.log("addEvent")
      const data = JSON.parse(event.data);
      console.log("Received from RN:", data);
      updateMyLocation(data.latitude, data.longitude);
    } catch (e) {
      console.error('Invalid RN message:', event.data);
    }
  });
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
    <body onload="initKakaoMap()">
      <div id="map_div"></div>
    </body>
  </html>
`

  return Platform.OS === 'web' ? (
    <View className="w-full h-full">
      <iframe
        srcDoc={htmlContent}
        className="flex-1"
      />
      <BottomSheet handleChange={handleChange}>
        <BottomSheetContent
          liveMembers={liveData}
          selectedMemberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}></BottomSheetContent>
      </BottomSheet>
    </View>
  ) : (
    <View className="flex-1">
      <View className="relative flex-1">
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          className="flex-1"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn('WebView error: ', nativeEvent)
          }}
        />
        <BottomSheet handleChange={handleChange}>
          <BottomSheetContent
            liveMembers={liveData}
            selectedMemberId={selectedMemberId}
            setSelectedMemberId={setSelectedMemberId}></BottomSheetContent>
        </BottomSheet>
      </View>
    </View>
  )
}
