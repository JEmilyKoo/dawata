import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Constants from 'expo-constants'
import { Link, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

import {
  deleteAppointment,
  getAppointmentDetail,
  updateAppointmentHost,
  updateMyAppointmentAttendance,
} from '@/apis/appointment'
import { toggleVoteSelection } from '@/apis/votes'
import VoteItem from '@/app/appointment/components/VoteItem'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import MoreIcon from '@/assets/icons/more.svg'
import VoteIcon from '@/assets/icons/vote.svg'
import DropDown from '@/components/DropDown'
import ImageThumbnail from '@/components/ImageThumbnail'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import Colors from '@/constants/Colors'
import { RootState } from '@/store/store'
import {
  AppointmentDetailInfo,
  ParticipantInfo,
  VoteInfo,
} from '@/types/appointment'
import { CustomOverlay } from '@/types/live'
import { MenuItem } from '@/types/menu'

import {
  initUpdate,
  patchUpdate,
  setCreateAppointmentId,
  setSelectedRecommandList,
} from '../../store/slices/appointmentSlice'

export default function AppointmentDetail() {
  const { t } = useTranslation()
  const [selectedLat, setSelectedLat] = useState(0)
  const [selectedLog, setSelectedLog] = useState(0)
  const webViewRef = React.useRef<WebView>(null)
  const { id } = useLocalSearchParams()
  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailInfo>()

  const { user } = useSelector((state: RootState) => state.member)
  const [status, setStatus] = useState(
    useSelector((state: RootState) => state.appointment.currentVoteStatus),
  )
  const [destinationOverlay, setDestinationOverlay] =
    useState<CustomOverlay | null>(null)

  const router = useRouter()
  const [webViewInit, setWebViewInit] = useState(false)

  const [isFinish, setIsFinish] = useState(false)
  // 호스트 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 role 확인하여 호스트 여부 확인
  // 참여 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 isAttending 확인
  const [isHost, setIsHost] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.role === 'HOST',
    ),
  )

  // 로컬 상태 관리
  const [voteInfos, setVoteInfos] = useState<VoteInfo[]>([])

  const [menu, setMenu] = useState<MenuItem[]>([])

  const [topVote, setTopVote] = useState<VoteInfo | null>(null)
  const [isAttending, setIsAttending] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.isAttending,
    ),
  )

  useEffect(() => {
    setIsFinish(status === 'EXPIRED' || status == 'PLACE_ONLY')
  }, [status])

  useEffect(() => {
    if (voteInfos.length == 0) return
    let topInfos =
      status == 'SELECTED'
        ? voteInfos
        : voteInfos.filter((item) => item.isSelected)
    const maxPercentage = Math.max(...topInfos.map((v) => v.percentage))
    let top = topInfos.find((vote) => vote.percentage === maxPercentage)
    if (top) {
      setTopVote(top)
    } else {
      setTopVote(voteInfos[0])
    }
  }, [voteInfos])

  useEffect(() => {
    if (!topVote) return
    setSelectedLat(topVote.latitude)
    setSelectedLog(topVote.longitude)
  }, [topVote])

  useEffect(() => {
    if (!selectedLat || voteInfos.length == 0) return
    clearCustomOverlay()
    if (isFinish) {
      setDestinationOverlay({
        id: 0,
        type: 'destination',
        latitude: selectedLat,
        longitude: selectedLog,
        fillColor: Colors.primary,
        strokeColor: Colors.primary,
        textColor: 'white',
        text: '도착',
        show: true,
      })
      // 도착지 세팅
    } else {
      let newMemberOverlayList = voteInfos.map((voteInfo: VoteInfo, index) => ({
        id: voteInfo.voteItemId,
        type: 'address',
        latitude: voteInfo.latitude,
        longitude: voteInfo.longitude,
        fillColor: voteInfo.isSelected ? Colors.primary : 'white',
        strokeColor: Colors.primary,
        textColor: voteInfo.isSelected ? 'white' : Colors.primary,
        text: String.fromCharCode(65 + index),
        show: true,
      }))
      setCustomOverlayList(newMemberOverlayList)
      // 다른 것들 세팅
    }
  }, [voteInfos, selectedLat])

  useEffect(() => {
    if (destinationOverlay) {
      setCustomOverlay(destinationOverlay)
    }
  }, [destinationOverlay])

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

  const onMessage = (event: unknown) => handleOnMessage(event)
  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      const data = await getAppointmentDetail(Number(id))
      setAppointmentDetail(data)
      console.log('👍약속 상세 정보 : ', data)
    }
    fetchAppointmentDetail()
  }, [isAttending, isHost, status])

  useEffect(() => {
    if (appointmentDetail) {
      const attending = appointmentDetail.participantInfos.some(
        (participant) =>
          participant.memberId === user?.id && participant.isAttending,
      )
      setIsAttending(attending)
    }
  }, [appointmentDetail])

  useEffect(() => {
    if (appointmentDetail) {
      setIsHost(
        appointmentDetail.participantInfos.some(
          (participant) =>
            participant.memberId === user?.id && participant.role === 'HOST',
        ),
      )
    }
  }, [appointmentDetail])

  const dispatch = useDispatch()
  const handleEdit = () => {
    if (!appointmentDetail) return

    dispatch(initUpdate())
    if (appointmentDetail.appointmentInfo) {
      dispatch(patchUpdate(appointmentDetail.appointmentInfo))
    }
    router.push(`/appointment/update1`)
  }

  const handleDelete = async () => {
    const data = await deleteAppointment(Number(id))
    router.replace('/appointment')
  }

  const handleToggleParticipation = async () => {
    if (isAttending !== undefined) {
      const data = await updateMyAppointmentAttendance(Number(id), {
        isAttending: !isAttending,
      })
      setIsAttending(!isAttending)
    }
  }

  const detailHostMenu = (isAttending: boolean) => {
    return [
      {
        title: !isAttending ? '참여' : '불참',
        onSelect: handleToggleParticipation,
        color: Colors.text.primary,
      },
      {
        title: '수정',
        onSelect: handleEdit,
        color: Colors.text.primary,
      },
      {
        title: '삭제',
        onSelect: handleDelete,
        color: Colors.light.red,
      },
    ]
  }

  const detailmemberMenu = (isAttending: boolean) => {
    return [
      {
        title: !isAttending ? '참여' : '불참',
        onSelect: handleToggleParticipation,
        color: Colors.text.primary,
      },
    ]
  }

  useEffect(() => {
    const menu: MenuItem[] = isHost
      ? detailHostMenu(isAttending ?? false)
      : detailmemberMenu(isAttending ?? false)
    setMenu(menu)
  }, [isHost, isAttending])

  useEffect(() => {
    if (appointmentDetail) {
      setVoteInfos(appointmentDetail.voteInfos)
    }
  }, [appointmentDetail])

  // 체크박스 선택 시 로컬 상태만 업데이트
  const handleSelect = (voteItemId: number, isSelected: boolean) => {
    setVoteInfos((prev) =>
      prev.map((vote) =>
        vote.voteItemId === voteItemId ? { ...vote, isSelected } : vote,
      ),
    )
  }

  // 투표하기 버튼 클릭 시 API 요청
  // TODO: 투표가 아무것도 없을 때 투표하기 버튼 비활성화
  const handleVoteSubmit = async () => {
    try {
      const response = await toggleVoteSelection(
        appointmentDetail?.appointmentInfo.appointmentId ?? 0,
        {
          voteInfos: voteInfos.map((vote) => ({
            voteItemId: vote.voteItemId,
            isSelected: vote.isSelected,
          })),
        },
      )
      setStatus('SELECTED')
    } catch (error) {
      console.error('🔍 투표 실패:', error)
    }
  }

  const handleVoteUpdate = () => {
    setStatus('NOT_SELECTED')
  }

  const addVote = () => {
    dispatch(
      setCreateAppointmentId(appointmentDetail?.appointmentInfo.appointmentId),
    )
    dispatch(setSelectedRecommandList([]))

    router.push({
      pathname: '/appointment/create4',
    })
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
  // 약속장 변경
  const handleHostChange = async (participant: ParticipantInfo) => {
    const data = await updateAppointmentHost(Number(id), {
      clubId: appointmentDetail?.clubInfo.clubId ?? 0,
      oriHost: {
        memberId:
          appointmentDetail?.participantInfos.find((p) => p.role === 'HOST')
            ?.memberId ?? 0,
        participantId:
          appointmentDetail?.participantInfos.find((p) => p.role === 'HOST')
            ?.participantId ?? 0,
      },
      newHost: {
        memberId: participant.memberId,
        participantId: participant.participantId,
      },
    })
    setIsHost(false)
  }

  useEffect(() => {
    if (webViewInit && selectedLat && selectedLog) {
      webViewRef.current?.injectJavaScript(
        `initMap(${selectedLat}, ${selectedLog});`,
      )
      panTo(selectedLat, selectedLog)
    }
  }, [webViewInit, selectedLat, selectedLog])

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-white items-center pt-4">
      <ScrollView>
        {appointmentDetail && (
          <View className="w-full mt-5 pt-7">
            <View className="flex-row">
              <ImageThumbnail
                img={appointmentDetail.clubInfo.img}
                defaultImg={require('@/assets/clubs/club1.png')}
                width={64}
                height={54}
                className="rounded-xl mx-5"
              />
              <View className="flex-col justify-start flex-1 mr-4">
                <View className="flex-row justify-between">
                  <Text className="text-2xl font-extrabold">
                    {appointmentDetail.appointmentInfo.name}
                  </Text>
                  <Menu>
                    <MenuTrigger>
                      <MoreIcon
                        height={24}
                        width={24}
                      />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuCustomOptions menuList={menu} />
                    </MenuOptions>
                  </Menu>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-primary text-xl font-semibold truncate w-3/4">
                    {appointmentDetail.clubInfo.name}
                  </Text>
                  <Text className="text-text-secondary text-base mt-1 font-medium mr-2">
                    #
                    {t(
                      `category.${appointmentDetail.appointmentInfo.category}`,
                    )}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between mx-5 mt-2">
              <View className="flex-row">
                {isFinish && <Text>✅</Text>}
                {!isFinish && <VoteIcon />}
                <Text className="font-base text-text-primary font-regular ml-1">
                  {t(`voteStatus.${status}`)}
                </Text>
              </View>
              <Text className="font-base text-text-primary font-regularmr-1">
                {new Date(
                  appointmentDetail.appointmentInfo.scheduledAt,
                ).toLocaleString('ko', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
        {voteInfos.length > 0 && (
          <View className="w-full aspect-square p-5">
            <WebView
              ref={(ref) => (webViewRef.current = ref)}
              originWhitelist={['*']}
              source={{ html: webViewContent }}
              javaScriptEnabled={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              onMessage={onMessage}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent
                console.warn('WebView error: ', nativeEvent)
              }}
            />
          </View>
        )}
        <View className="flex-1 items-center justify-center w-full p-4">
          <View className="flex-1 w-full">
            {/* 상태에 따라 다른 View 렌더링 */}
            {isFinish && appointmentDetail && (
              <View>
                <View>
                  <DropDown title="장소">
                    <View>
                      {topVote ? (
                        <View>
                          <View className="flex-row">
                            <MapPinIcon
                              height={24}
                              width={24}
                              stroke={Colors.text.primary}
                              strokeWidth={2}
                            />
                            <Text className="text-text-primary font-bold text-base pt-[1px]">
                              {topVote.title}
                            </Text>
                            <Text className="text-text-secondary text-sm pt-1">
                              {topVote.category}
                            </Text>
                          </View>
                          <Text>{topVote.roadAddress}</Text>
                          <Link href={topVote.linkUrl}>
                            <Text>{topVote.linkUrl}</Text>
                          </Link>
                        </View>
                      ) : (
                        <Text>투표된 장소가 없습니다</Text>
                      )}
                    </View>
                  </DropDown>
                </View>
                {topVote && (
                  <View>
                    <DropDown title="장소 투표 결과">
                      <View>
                        {voteInfos.map((vote) => (
                          <View key={vote.voteItemId}>
                            <Text>{vote.percentage}%</Text>
                            <Text>{vote.title}</Text>
                          </View>
                        ))}
                      </View>
                    </DropDown>
                  </View>
                )}
              </View>
            )}
            {status === 'SELECTED' && appointmentDetail && (
              <View>
                <DropDown title="장소 투표">
                  <View>
                    {voteInfos.map((vote, index) => (
                      <TouchableOpacity
                        key={vote.voteItemId}
                        onPress={() => panTo(vote.latitude, vote.longitude)}>
                        <VoteItem
                          voteInfo={vote}
                          onSelect={handleSelect}
                          disabled={true}
                          index={index}
                        />
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      className="mt-4 px-4 py-4 bg-primary rounded-full"
                      onPress={addVote}>
                      <Text className="text-white text-center font-bold">
                        투표 항목 추가하기
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="mt-4 px-4 py-4 border border-primary rounded-full"
                      onPress={handleVoteUpdate}>
                      <Text className="text-primary text-center font-bold">
                        투표 수정하기
                      </Text>
                    </TouchableOpacity>
                  </View>
                </DropDown>
              </View>
            )}
            {/* 장소 투표 뷰 */}
            {status === 'NOT_SELECTED' && appointmentDetail && (
              <View>
                <DropDown
                  title="장소 투표"
                  preOpen={true}>
                  <Text className="ml-4">
                    투표 기한 :{' '}
                    {new Date(
                      appointmentDetail.appointmentInfo.voteEndTime,
                    ).toLocaleString('ko', {
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                  {voteInfos.length > 0 && (
                    <View>
                      {voteInfos.map((vote, index) => (
                        <TouchableOpacity
                          key={vote.voteItemId}
                          onPress={() => panTo(vote.latitude, vote.longitude)}>
                          <VoteItem
                            voteInfo={vote}
                            onSelect={handleSelect}
                            disabled={false}
                            index={index}
                          />
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        className="mt-4 px-4 py-4 bg-primary rounded-full"
                        onPress={handleVoteSubmit}>
                        <Text className="text-white text-center font-bold">
                          투표하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {voteInfos.length == 0 && (
                    <View>
                      <View className="justify-center items-center p-5">
                        <Text>현재 투표 항목이 없습니다.</Text>
                      </View>
                      <TouchableOpacity
                        className="mt-4 px-4 py-4 bg-primary rounded-full"
                        onPress={addVote}>
                        <Text className="text-white text-center font-bold">
                          투표 항목 추가하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </DropDown>
              </View>
            )}
          </View>
          {/* 참여 인원 리스트 */}
          <View className="w-full">
            <DropDown
              title="참여 인원"
              subtitle={
                appointmentDetail?.participantInfos.filter(
                  (participant) => participant.isAttending,
                ).length + '명'
              }>
              <View className="px-2">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="space-x-4">
                  {appointmentDetail?.participantInfos
                    .filter((participant) => participant.isAttending)
                    .map((participant) => (
                      <View key={participant.participantId}>
                        <Menu>
                          <MenuTrigger>
                            <View className="p-2 mr-2 rounded-xl min-w-16 items-center">
                              <ImageThumbnail
                                img={participant.img}
                                defaultImg={require('@/assets/avatars/user1.png')}
                                width={48}
                                height={48}
                                className={`w-12 h-12 rounded-full mb-2`}
                              />
                              <Text className="text-base font-semibold mb-1">
                                {participant.name}
                              </Text>
                            </View>
                          </MenuTrigger>
                          <MenuOptions
                            optionsContainerStyle={{ marginTop: -20 }}>
                            <View>
                              <MenuOption
                                onSelect={() =>
                                  isHost && handleHostChange(participant)
                                }>
                                <Text>약속장 변경</Text>
                              </MenuOption>
                            </View>
                          </MenuOptions>
                        </Menu>
                      </View>
                    ))}
                </ScrollView>
              </View>
            </DropDown>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
