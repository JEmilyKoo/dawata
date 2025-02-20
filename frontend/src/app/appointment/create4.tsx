import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { createVoteItem } from '@/apis/appointment'
/// 화면에 지도를 띄운다
import { searchByCategory } from '@/apis/mapApi'
import RecommandTabBar from '@/app/appointment/components/RecommandTabBar'
import PlusCirclePrimaryIcon from '@/assets/icons/plus-circle-primary.svg'
import BottomSheet from '@/components/BottomSheet'
import Colors from '@/constants/Colors'
import RecommandData from '@/constants/RecommandData'
import { CategoryGroupCodeTypes } from '@/constants/categoryGroupCode'
import {
  addStandardRecommand,
  resetAppointmentState,
  resetRecommandStandard,
  setRecommandList,
  setSelectedRecommandList,
  setStandardList,
  updateLoading,
  updatePickList,
  updateRecommandList,
  updateRecommandedStandardCoordinates,
  updateStandardRecommandList,
} from '@/store/slices/appointmentSlice'
import { RootState } from '@/store/store'
import {
  CategoryGroupCodeType,
  CreateVoteInfo,
  LocationData,
  Recommand,
  RecommandList,
  Standard,
  StandardRecommand,
} from '@/types/appointment'
import { CustomOverlay } from '@/types/live'
import { LiveMember } from '@/types/live'

import CreateRecommandItem from './components/CreateRecommandItem'
import CreateVoteItem from './components/CreateVoteItem'

interface LocationRecord {
  latitude: number
  longitude: number
  timestamp: number
}

export default function createAddress4() {
  const { t } = useTranslation()

  const router = useRouter()
  const onMessage = (event: unknown) => handleOnMessage(event)
  const dispatch = useDispatch()

  const createAppointmentId = useSelector<RootState, number>(
    (state) => state.appointment.createAppointmentId,
  )
  const recommandedPlace: LocationData | null = useSelector(
    (state: RootState) => state.appointment.recommandedPlace,
  )

  const [webViewInit, setWebViewInit] = useState(false)

  const selectedRecommandList: Recommand[] = useSelector(
    (state: RootState) => state.appointment.selectedRecommandList,
  )
  const recommandList: RecommandList[] = useSelector(
    (state: RootState) => state.appointment.recommandList,
  )
  const standardList: Standard[] = useSelector(
    (state: RootState) => state.appointment.standardList,
  )
  const standardRecommandList: StandardRecommand[] = useSelector(
    (state: RootState) => state.appointment.standardRecommandList,
  )

  const webViewRef = useRef<WebView | null>(null)
  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<LiveMember | null>(null)
  const [index, setIndex] = useState(0)
  const snapPoints = useMemo(() => ['10%', '30%', '50%'], [])

  const [isList, setIsList] = useState(false)
  const handleChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  const categoryCodes = Object.values(CategoryGroupCodeTypes)

  const [pickedList, setPickedList] = useState<RecommandList | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [categoryGroupCode, setCategoryGroupCode] = useState(
    CategoryGroupCodeTypes.SW8,
  )
  const [standardId, setStandardId] = useState<number>(-1)
  const [selectedLat, setSelectedLat] = useState(0)
  const [selectedLog, setSelectedLog] = useState(0)

  useEffect(() => {
    if (standardId < 0 || standardRecommandList.length == 0) return
    let sList = standardRecommandList.find(
      (item) => item.standard?.standardId == standardId,
    )

    if (sList?.standard) {
      setSelectedLat(sList?.standard.latitude)
      setSelectedLog(sList?.standard.longitude)
    }
  }, [standardId, standardRecommandList])

  const handleOnMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data)
      if (!message.action) return

      if (message.action == 'webviewInit') {
        setWebViewInit(true)
      }
      if (message.action === 'mapInitComplete') {
        panTo(selectedLat, selectedLog)
        setWebViewInit(false) // 모든 작업 완료 후 상태 리셋
      }
    } catch (error) {
      console.error('handleOnMessage 오류:', error)
    }
  }

  useEffect(() => {
    if (webViewInit && selectedLat && selectedLog) {
      webViewRef.current?.injectJavaScript(
        `initMap(${selectedLat}, ${selectedLog});`,
      )
      panTo(selectedLat, selectedLog)
    }
  }, [webViewInit, selectedLat, selectedLog])
  useEffect(() => {
    clearCustomOverlay()
    if (isList && selectedRecommandList.length != 0) {
      setAddressOverlayList(selectedRecommandList)
    } else if (!isList && pickedList && pickedList?.recommand.length != 0) {
      clearCustomOverlay()
      setAddressOverlayList(pickedList.recommand)
    }
  }, [isList, pickedList, selectedRecommandList])

  const deleteItem = (id: string) => {
    dispatch(
      setSelectedRecommandList(
        selectedRecommandList.filter((item) => item.id !== id),
      ),
    )
  }
  const panTo = (lat: number, lng: number) => {
    webViewRef.current?.injectJavaScript(`panTo(${lat}, ${lng});`)
  }

  const clearCustomOverlay = () => {
    webViewRef.current?.injectJavaScript(`clearCustomOverlay();`)
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
    if (!webViewRef.current) {
      console.log('WebView ref가 없습니다')
      return
    }
    const jsonData = JSON.stringify(data)
    const jsCode = `setCustomOverlayList(${jsonData});`
    webViewRef.current.injectJavaScript(jsCode)
  }

  useEffect(() => {
    if (!recommandedPlace?.latitude) return

    let targetStandard = standardRecommandList.find(
      (item) => item?.standard?.standardId == 0,
    )

    let newStandard = {
      title: '추천장소',
      latitude: recommandedPlace.latitude,
      longitude: recommandedPlace.longitude,
      isRecommanded: true,
      standardId: 0,
    }

    if (targetStandard) {
      dispatch(resetRecommandStandard(newStandard))
    } else {
      dispatch(addStandardRecommand(newStandard))
    }
    setStandardId(0)
  }, [recommandedPlace])

  const fetchPickedList = async () => {
    if (standardId < 0) return

    const selectedStandard = standardRecommandList.find(
      (item) => item?.standard?.standardId == standardId,
    )

    if (!selectedStandard?.standard) {
      console.warn('standardId에 해당하는 표준이 없습니다.')
      return
    }

    const props = {
      category_group_code: categoryGroupCode,
      x: selectedStandard.standard.longitude,
      y: selectedStandard.standard.latitude,
      radius: 1000,
    }
    const response = await searchByCategory(props)

    let data: Recommand[] = response?.data?.documents

    data = data.map((item) => ({
      ...item,
      standardId: standardId,
    }))

    let newPickedList = {
      category_group_code: categoryGroupCode,
      recommand: data,
      loading: 1,
    }
    setPickedList(newPickedList)
    // 마커 다 지우고 마커 세팅
    // dispatch(updatePickList({ newPickedList, standardId }))
  }

  const setAddressOverlayList = (data: Recommand[]) => {
    const newMemberOverlayList: CustomOverlay[] = data.map(
      (recommand: Recommand, index) => {
        const isSelected = selectedRecommandList.some(
          (srl) => srl.id === recommand.id,
        )

        return {
          id: Number(recommand.id),
          type: 'address',
          latitude: Number(recommand.y),
          longitude: Number(recommand.x),
          fillColor: isSelected ? Colors.primary : 'white',
          strokeColor: Colors.primary,
          textColor: isSelected ? 'white' : Colors.primary,
          text: String.fromCharCode(65 + index),
          show: true,
        }
      },
    )

    setCustomOverlayList(newMemberOverlayList)
  }

  useEffect(() => {
    if (!pickedList && standardId >= 0) {
      setPickedList(
        standardRecommandList
          .find((item) => item?.standard?.standardId == standardId)
          ?.recommandList.find(
            (item) => item.category_group_code == categoryGroupCode,
          ) ?? null,
      )
    }
    setIsEmpty(
      !pickedList ||
        (pickedList.loading == 1 && pickedList.recommand.length == 0),
    )

    if (pickedList?.loading == -1) {
      setPickedList({
        ...pickedList,
        loading: 0,
      })
      fetchPickedList()
    }
    if (pickedList?.loading == 1) {
      dispatch(updatePickList({ pickedList, standardId }))
    }
  }, [pickedList, categoryGroupCode, standardId])

  const handleSelect = (id: string, isSelected: boolean) => {
    const hasList = selectedRecommandList.some((item) => item.id === id)
    if (hasList) {
      dispatch(
        setSelectedRecommandList(
          selectedRecommandList.filter((item) => item.id !== id),
        ),
      )
      return
    }
    if (!pickedList) return
    const result = pickedList.recommand.find((item) => item.id === id)
    if (!hasList && result) {
      dispatch(setSelectedRecommandList([...selectedRecommandList, result]))
    }
  }

  const onSubmit = () => {
    const vList = selectedRecommandList.map(
      (item) =>
        ({
          roadAddress: item.road_address_name,
          longitude: Number(item.x),
          latitude: Number(item.y),
          title: item.place_name,
          category: item.category_group_code,
          linkUrl: item.place_url,
          isOnly: false,
        }) as CreateVoteInfo,
    )
    if (vList.length == 1) {
      vList[0].isOnly = true
    }

    vList.forEach((item) => {
      createVoteItem({
        createVoteInfo: item,
        appointmentId: createAppointmentId,
      })
    })
    router.push('/appointment/create5')
  }

  const onPressNext = () => {
    if (selectedRecommandList.length == 0) {
      ToastAndroid.show('투표 장소를 선택해주세요', ToastAndroid.SHORT)
      return
    }
    onSubmit()
    // router.push('/appointment/create5')
  }

  const onPressPrev = () => {
    router.back()
  }

  const addCreateVoteItem = () => {
    router.push('/appointment/createAddress')
  }
  const kakaoJsApiKey = Constants.expoConfig?.extra?.kakaoJsApiKey

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
      src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJsApiKey}"></script>
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

  return Platform.OS === 'web' ? (
    <View className="w-full h-full"></View>
  ) : (
    <View className="flex-1">
      <StatusBar
        style="dark"
        translucent
        backgroundColor="transparent"
      />
      <View className="relative flex-1">
        <WebView
          ref={(ref) => (webViewRef.current = ref)}
          originWhitelist={['*']}
          source={{ html: webViewContent }}
          className="flex-1"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={onMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn('WebView error: ', nativeEvent)
          }}
        />
        <BottomSheet
          handleChange={handleChange}
          snaps={snapPoints}>
          <View className="p-4">
            <View className="flex-row">
              <TouchableOpacity
                className="bg-primary rounded-xl justify-center items-center p-1 mr-1"
                onPress={() => {
                  dispatch(resetAppointmentState())
                }}>
                <Text className="text-white">추천 기준</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row border border-primary rounded-xl justify-center items-center p-1"
                onPress={addCreateVoteItem}>
                <PlusCirclePrimaryIcon
                  width={20}
                  height={20}
                />
                <Text className="text-primary"> 기준 추가</Text>
              </TouchableOpacity>
            </View>
            {!isList && (
              <View className="mt-4 h-100">
                <View className="border border-primary rounded-md h- mb-3">
                  <Picker
                    selectedValue={categoryGroupCode}
                    onValueChange={setCategoryGroupCode}
                    className="border-2 p-2 mb-4">
                    {categoryCodes.map((item) => (
                      <Picker.Item
                        key={item}
                        label={t(`categoryGroupCode.${item}`)}
                        value={item}
                        color={Colors.text.primary}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={{ height: '75%' }}>
                  <BottomSheetScrollView style={{ flex: 1 }}>
                    {pickedList &&
                      pickedList.loading == 1 &&
                      pickedList.recommand.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => panTo(Number(item.y), Number(item.x))}>
                          <CreateRecommandItem
                            index={index}
                            recommand={item}
                            isSelected={selectedRecommandList.some(
                              (srl) => srl.id === item.id,
                            )}
                            onSelect={handleSelect}
                          />
                        </TouchableOpacity>
                      ))}
                    {/* <View className="h-[195px] w-full bg-white"></View> */}
                  </BottomSheetScrollView>
                </View>

                {pickedList && pickedList.loading == 0 && (
                  <View className="inset-0 items-center justify-center">
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                    />
                  </View>
                )}
                {isEmpty && (
                  <View>
                    <Text>{t('createAddress.search.error')}</Text>
                  </View>
                )}
              </View>
            )}

            {isList && (
              <View className="pt-5">
                <BottomSheetScrollView>
                  {selectedRecommandList &&
                    selectedRecommandList.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => panTo(Number(item.y), Number(item.x))}>
                        <CreateVoteItem
                          recommand={item}
                          deleteItem={deleteItem}
                        />
                      </TouchableOpacity>
                    ))}
                  {/* <View className="h-[195px] w-full bg-primary"></View> */}
                </BottomSheetScrollView>
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
