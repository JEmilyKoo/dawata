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
import { useSelector } from 'react-redux'

import * as Location from 'expo-location'

import BottomSheetContent from '@/app/live/components/BottomSheetContent'
import { MemberDetailItem } from '@/app/live/components/MemberDetailItem'
import BottomSheet from '@/components/BottomSheet'
import { liveData } from '@/constants/liveData'
import { RootState } from '@/store/store'
import { LiveMember } from '@/types/live'

import CreateAddressName from './components/CreateAddressName'

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

export default function createAddress2() {
  const { t } = useTranslation()
  const { create } = useSelector((state: RootState) => state.address)

  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<LiveMember | null>(null)
  const [index, setIndex] = useState(0)
  const snapPoints = useMemo(() => ['10%', '30%'], [])

  const handleChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  useEffect(() => {
    ;(async () => {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('위치 권한이 거부되었습니다')
        return
      }

      // 실시간 위치 추적 시작
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초마다 업데이트
          distanceInterval: 5, // 5미터 이상 이동 시 업데이트
        },
        (location) => {
          setCurrentLocation(location)
          setLocationRecords((prev) => [
            ...prev,
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
            },
          ])

          // 지도에 현재 위치 표시를 위한 JavaScript 실행
          webViewRef.current?.injectJavaScript(`
            updateMyLocation(${location.coords.latitude}, ${location.coords.longitude});
          `)
        },
      )
    })()
  }, [])

  const webViewRef = React.useRef<WebView>(null)

  const htmlContent = `
   <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.EXPO_PUBLIC_KAKAO_MAP_JS_API_KEY}"></script>
    <script type="text/javascript">
      function initTmap() {
        var mapContainer = document.getElementById('map'); // ID 수정
        var options = {
          center: new kakao.maps.LatLng(${create.latitude}, ${create.longitude}),
          level: 3
        };

        var map = new kakao.maps.Map(mapContainer, options);


      // 마커가 표시될 위치입니다 
      var markerPosition  = new kakao.maps.LatLng(${create.latitude}, ${create.longitude}); 

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
          position: markerPosition
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
      }
    </script>
    <style>
      html, body, #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body onload="initTmap()">
    <div id="map"></div>
  </body>
</html>

  `

  return Platform.OS === 'web' ? (
    <View className="w-full h-full">
      <iframe
        srcDoc={htmlContent}
        className="flex-1"
      />
      <BottomSheet
        handleChange={handleChange}
        snaps={snapPoints}>
        <CreateAddressName />
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
        <BottomSheet
          handleChange={handleChange}
          snaps={snapPoints}>
          <CreateAddressName />
        </BottomSheet>
      </View>
    </View>
  )
}
