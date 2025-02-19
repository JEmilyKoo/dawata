import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  Text,
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

  const dispatch = useDispatch()
  const create = useSelector((state: RootState) => state.address.create)

  const createVoteItemList: CreateVoteInfo[] = useSelector(
    (state: RootState) => state.appointment.createVoteItemList,
  )
  const recommandedPlace: LocationData | null = useSelector(
    (state: RootState) => state.appointment.recommandedPlace,
  )

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

  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<LiveMember | null>(null)
  const [index, setIndex] = useState(0)
  const snapPoints = useMemo(() => ['10%', '30%', '50%'], [])

  const [isList, setIsList] = useState(true)
  const router = useRouter()
  const handleChange = (newIndex: number) => {
    setIndex(newIndex)
  }

  const deleteItem = (id: string) => {
    dispatch(
      setSelectedRecommandList(
        selectedRecommandList.filter((item) => item.id !== id),
      ),
    )
  }
  const categoryCodes = Object.values(CategoryGroupCodeTypes)

  const [pickedList, setPickedList] = useState<RecommandList | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [categoryGroupCode, setCategoryGroupCode] = useState(
    CategoryGroupCodeTypes.SW8,
  )
  const [standardId, setStandardId] = useState<number>(-1)

  useEffect(() => {
    if (!recommandedPlace?.latitude) return

    let targetStandard = standardRecommandList.find(
      (item) => item.standard.standardId == 0,
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
    console.log('아니씨발업뎃을 했잖아', pickedList)
    if (standardId < 0) return
    const props = {
      category_group_code: categoryGroupCode,
      x: standardRecommandList.find(
        (item) => item.standard.standardId == standardId,
      )?.standard.longitude,
      y: standardRecommandList.find(
        (item) => item.standard.standardId == standardId,
      )?.standard.latitude,
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

    // dispatch(updatePickList({ newPickedList, standardId }))
  }

  useEffect(() => {
    console.log('pickedList', pickedList)
    if (!pickedList && standardId >= 0) {
      setPickedList(
        standardRecommandList
          .find((item) => item.standard.standardId == standardId)
          ?.recommandList.find(
            (item) => item.category_group_code == categoryGroupCode,
          ),
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

  const webViewRef = React.useRef<WebView>(null)
  const onSubmit = () => {
    console.log('지도위치 저장')
  }

  const onPressNext = () => {
    console.log('data 확인', RecommandData)
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
                        <CreateRecommandItem
                          key={index}
                          index={index}
                          recommand={item}
                          isSelected={selectedRecommandList.some(
                            (srl) => srl.id === item.id,
                          )}
                          onSelect={handleSelect}
                        />
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
              <BottomSheetScrollView>
                {selectedRecommandList &&
                  selectedRecommandList.map((item) => (
                    <CreateVoteItem
                      key={item.id}
                      recommand={item}
                      deleteItem={deleteItem}
                    />
                  ))}
                {/* <View className="h-[195px] w-full bg-primary"></View> */}
              </BottomSheetScrollView>
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
