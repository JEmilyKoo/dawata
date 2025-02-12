import { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { useSelector } from 'react-redux'

import { useRoute } from '@react-navigation/native'
import { Link, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

import {
  deleteAppointment,
  getAppointmentDetail,
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
import BackButton from '@/components/BackButton'
import DropDown from '@/components/DropDown'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import Colors from '@/constants/Colors'
import { RootState } from '@/store/store'
import { AppointmentDetailInfo, VoteInfo } from '@/types/appointment'
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

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>{isAttending ? '참' : '불'}</Text>
      <View className="absolute top-0 right-0 p-4">
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

      <View className="items-center justify-center w-full p-4">
        <Text className="text-lg font-bold mb-4">Appointment Detail</Text>
        <Text className="text-gray-500 mb-4">약속 ID: {id}</Text>
        <Text className="text-gray-500 mb-4">
          상태: {t(`voteStatus.${status}`)}
        </Text>
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
                참여 인원 :{' '}
                {
                  appointmentDetail?.participantInfos.filter(
                    (participant) => participant.isAttending,
                  ).length
                }
              </Text>
              {appointmentDetail?.participantInfos
                .filter((participant) => participant.isAttending)
                .map((participant) => (
                  <Text key={participant.participantId}>{participant.img}</Text>
                ))}
            </View>
          </DropDown>
        </View>
      </View>
    </View>
  )
}
