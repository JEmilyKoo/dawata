import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Platform,
  StatusBar,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'

/// 화면에 지도를 띄운다

import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'

import RecommandTabBar from '@/app/appointment/components/RecommandTabBar'
import BottomSheetContent from '@/app/live/components/BottomSheetContent'
import { MemberDetailItem } from '@/app/live/components/MemberDetailItem'
import PlusCircleIcon from '@/assets/icons/plus-circle.svg'
import BottomSheet from '@/components/BottomSheet'
import PrevNextButton from '@/components/PrevNextButton'
import Colors from '@/constants/Colors'
import RecommandData from '@/constants/RecommandData'
import { liveData } from '@/constants/liveData'
import { RootState } from '@/store/store'
import { LiveMember } from '@/types/live'

import CreateVoteItem from './components/CreateVoteItem'

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
  const create = useSelector((state: RootState) => state.address.create)

  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<LiveMember | null>(null)
  const [index, setIndex] = useState(0)
  const snapPoints = useMemo(() => ['10%', '30%'], [])

  const [isList, setIsList] = useState(true)
  const router = useRouter()
  const handleChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  const deleteItem = (id: number) => {
    console.log('deleteItem')
  }

  const [target, setTarget] = useState(['추천 기준'])

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
  const onSubmit = () => {
    console.log('지도위치 저장')
  }

  const onPressNext = () => {
    console.log('data 확인', RecommandData)
    // onSubmit()

    // router.push('/appointment/create4')
  }
  const onPressPrev = () => {
    onSubmit()
    router.push('/appointment/create3')
  }

  const addCreateVoteItem = () => {
    router.push('/appointment/createAddress')
  }
  const kakaoJsApiKey = Constants.expoConfig?.extra?.kakaoJsApiKey
  const htmlContent = `
   <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJsApiKey}"></script>
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
    <View className="w-full h-full"></View>
  ) : (
    <View className="flex-1">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
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
          <View>
            <View className="flex-row">
              <TouchableOpacity className="bg-primary">
                <Text>추천 기준</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={addCreateVoteItem}>
                <PlusCircleIcon
                  width={20}
                  height={20}
                />
                <Text> 기준 추가</Text>
              </TouchableOpacity>
            </View>
            {!isList && (
              <View>
                <Text> 추천</Text>
              </View>
            )}
            {isList && (
              <View>
                <CreateVoteItem
                  id={3}
                  deleteItem={deleteItem}
                />
              </View>
            )}
          </View>
        </BottomSheet>
      </View>
      <View className="flex-row w-full bg-white">
        <RecommandTabBar
          isList={isList}
          setIsList={setIsList}
        />
        <View className="flex-row justify-between w-1/2 py-2 pr-3 bg-white">
          {onPressPrev && (
            <TouchableOpacity
              className="bg-bord items-center justify-center p-3 rounded w-1/2"
              onPress={onPressPrev}>
              <Text className="text-text-primary text-center font-bold">
                {t('prev')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`bg-primary items-center justify-center rounded p-3 ml-2 w-1/2`}
            onPress={onPressNext}>
            <Text className="text-white text-center font-bold">
              {t('finish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
