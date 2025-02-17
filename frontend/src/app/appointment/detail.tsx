import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'

import { useRoute } from '@react-navigation/native'
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
import AppointmentExpiredDetail from '@/app/appointment/components/AppointmentExpiredDetail'
import AppointmentNotSelectedDetail from '@/app/appointment/components/AppointmentNotSelectedDetail'
import AppointmentSelectedDetail from '@/app/appointment/components/AppointmentSelectedDetail'
import VoteItem from '@/app/appointment/components/VoteItem'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import VoteIcon from '@/assets/icons/vote.svg'
import BackButton from '@/components/BackButton'
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
import { MenuItem } from '@/types/menu'

export default function AppointmentDetail() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams()
  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailInfo>()

  const { user } = useSelector((state: RootState) => state.member)
  const [status, setStatus] = useState(
    useSelector((state: RootState) => state.appointment.currentVoteStatus),
  )
  const router = useRouter()

  // 호스트 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 role 확인하여 호스트 여부 확인
  // 참여 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 isAttending 확인
  const [isHost, setIsHost] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.role === 'HOST',
    ),
  )
  const [isAttending, setIsAttending] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.isAttending,
    ),
  )

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      const data = await getAppointmentDetail(Number(id))
      setAppointmentDetail(data)
      console.log('👍약속 상세 정보 : ', data)
    }
    fetchAppointmentDetail()
  }, [isAttending, isHost, status])

  const webViewRef = React.useRef<WebView>(null)

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

  const handleEdit = () => {
    router.push(
      `/appointment/update1?id=${appointmentDetail?.appointmentInfo.appointmentId}`,
    )
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
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    const menu: MenuItem[] = isHost
      ? detailHostMenu(isAttending ?? false)
      : detailmemberMenu(isAttending ?? false)
    setMenu(menu)
  }, [isHost, isAttending])

  // 로컬 상태 관리
  const [voteInfos, setVoteInfos] = useState<VoteInfo[]>([])

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

  const markerLocation = {
    latitude: 0,
    longitude: 0,
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
          center: new kakao.maps.LatLng(${markerLocation.latitude}, ${markerLocation.longitude}),
          level: 3
        };

        var map = new kakao.maps.Map(mapContainer, options);


      // 마커가 표시될 위치입니다 
      var markerPosition  = new kakao.maps.LatLng(${markerLocation.latitude}, ${markerLocation.longitude}); 

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

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-white items-center">
      {appointmentDetail && (
        <View className="flex-col w-full mt-5">
          <View className="flex-row flex-1">
            <ImageThumbnail
              img={appointmentDetail.clubInfo.img}
              defaultImg={require('@/assets/clubs/club1.png')}
              width={64}
              height={54}
              className="rounded-xl mx-5"
            />
            <View className="flex-col flex-1 mr-4">
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
                <Text className="text-primary text-xl font-semibold">
                  {appointmentDetail.clubInfo.name}
                </Text>
                <Text className="text-text-secondary text-base mt-1 font-medium mr-2">
                  #{t(`category.${appointmentDetail.appointmentInfo.category}`)}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row justify-between mx-5 mt-4">
            <View className="flex-row">
              <VoteIcon />
              <Text className="font-base text-text-primary font-regular">
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
      )}

      <View className="items-center justify-center w-full p-4">
        <View className="flex-1 w-full">
          {/* 상태에 따라 다른 View 렌더링 */}
          {status === 'EXPIRED' && appointmentDetail && (
            <View>
              <View>
                <DropDown title="장소">
                  <View>
                    {voteInfos.length > 0 ? (
                      (() => {
                        const maxPercentage = Math.max(
                          ...voteInfos.map((v) => v.percentage),
                        )
                        const topVotes = voteInfos.filter(
                          (vote) => vote.percentage === maxPercentage,
                        )
                        return (
                          <View>
                            <View className="flex-row">
                              <MapPinIcon
                                height={24}
                                width={24}
                                stroke={Colors.text.primary}
                                strokeWidth={2}
                              />
                              <Text className="text-text-primary font-bold text-base pt-[1px]">
                                {topVotes[0].title}
                              </Text>
                              <Text className="text-text-secondary text-sm pt-1">
                                {topVotes[0].category}
                              </Text>
                            </View>
                            <Text>{topVotes[0].roadAddress}</Text>
                            <Link href={'http://' + topVotes[0].linkUrl}>
                              <Text>{topVotes[0].linkUrl}</Text>
                            </Link>
                          </View>
                        )
                      })()
                    ) : (
                      <Text>투표된 장소가 없습니다</Text>
                    )}
                  </View>
                </DropDown>
              </View>
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
            </View>
          )}
          {status === 'SELECTED' && appointmentDetail && (
            <View>
              <DropDown title="장소 투표">
                <View>
                  {voteInfos.map((vote) => (
                    <VoteItem
                      key={vote.voteItemId}
                      voteInfo={vote}
                      onSelect={handleSelect}
                      disabled={true}
                    />
                  ))}
                  <TouchableOpacity
                    className="mt-4 px-4 py-4 bg-primary rounded-full"
                    onPress={handleVoteUpdate}>
                    {/* TODO: 투표 수정하기 버튼 UI */}
                    <Text className="text-white text-center font-bold">
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
              <DropDown title="장소 투표">
                <View>
                  {voteInfos.map((vote) => (
                    <VoteItem
                      key={vote.voteItemId}
                      voteInfo={vote}
                      onSelect={handleSelect}
                      disabled={false}
                    />
                  ))}
                  <TouchableOpacity
                    className="mt-4 px-4 py-4 bg-primary rounded-full"
                    onPress={handleVoteSubmit}>
                    <Text className="text-white text-center font-bold">
                      투표하기
                    </Text>
                  </TouchableOpacity>
                </View>
              </DropDown>
            </View>
          )}
        </View>
        {/* 참여 인원 리스트 */}
        <View className="w-full">
          <DropDown title="참여 인원">
            <View>
              <Text>
                참여 인원 :
                {
                  appointmentDetail?.participantInfos.filter(
                    (participant) => participant.isAttending,
                  ).length
                }
              </Text>
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
                        <MenuOptions optionsContainerStyle={{ marginTop: -20 }}>
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
    </SafeAreaView>
  )
}
