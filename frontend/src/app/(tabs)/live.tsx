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
  // 샘플 사용자 데이터
  const users: User[] = [
    {
      id: '1',
      name: '고성태',
      avatar: require('@/assets/avatars/user1.png'),
      details: {
        status: '도착',
        lastActive: '3분 5초 전 예정',
      },
    },
    {
      id: '2',
      name: '구정은',
      avatar: require('@/assets/avatars/user2.png'),
      details: {
        status: '미도착',
        lastActive: '10분 전',
      },
    },
  ]

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
        <script src="https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${TMAP_API_KEY}"></script>
        <script type="text/javascript">
          let map;
          let marker;

          function initTmap() {
            map = new Tmapv3.Map("map_div", {
              center: new Tmapv3.LatLng(37.566481622437934, 126.98502302169841),
              width: "100%",
              height: "100%",
              zoom: 18
            });
          }

          function updateMyLocation(lat, lng) {
            const position = new Tmapv3.LatLng(lat, lng);
            console.log("position", position);
            if (!marker) {
              marker = new Tmapv3.Marker({
                position: position,
                map: map
              });
            } else {
              marker.setPosition(position);
            }

            map.setCenter(position);
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
      <body onload="initTmap()">
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
