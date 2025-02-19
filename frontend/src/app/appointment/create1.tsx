import { useTranslation } from 'react-i18next'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import { createAppointment } from '@/apis/appointment'
import PrevNextButton from '@/components/PrevNextButton'
import SelectMemberItem from '@/components/SelectMemberItem'
import StepIndicator from '@/components/StepIndicator'
import TopHeader from '@/components/TopHeader'
import { AppDispatch } from '@/store/store'
import { RootState } from '@/store/store'

import {
  fetchRecommendPlaceAsync,
  setCreateAppointmentId,
  setCreateMemberIds,
} from '../../store/slices/appointmentSlice'
import { useClub } from '../club/hooks/useClubInfo'

const AppointmentCreate1 = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.member)
  const create = useSelector((state: RootState) => state.appointment.create) // Redux store에서 모든 데이터 가져오기
  const { clubInfo } = useClub({ clubId: create.clubId })
  const clubMembers = clubInfo?.members || []
  const memberIds = create.memberIds

  const onSubmit = async () => {
    dispatch(setCreateMemberIds(memberIds))
    console.log('✅✅✅✅✅✅무슨 값이 오나요?', create)
    const response: number = await createAppointment(create)
    if (response) {
      dispatch(setCreateAppointmentId(response))
      console.log('✅✅✅✅✅✅무슨 값이 오나요?', response)
      dispatch(fetchRecommendPlaceAsync(24))
      router.push('/appointment/create2')
    } else {
      console.log('오류 발생')
    }
  }

  const handleCheckboxChange = (value: number) => {
    if (memberIds.includes(value)) {
      dispatch(setCreateMemberIds(memberIds.filter((v) => v !== value)))
    } else {
      dispatch(setCreateMemberIds([...memberIds, value]))
    }
  }
  const onPressNext = () => {
    onSubmit()

    router.push('/appointment/create2')
  }

  const isUser = (memberId: number) => {
    return memberId === user.id
  }
  const selectAll = () => {
    if (clubMembers.length == 0) return
    dispatch(setCreateMemberIds(clubMembers.map((item) => item.memberId)))
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="flex-1 justify-start">
        <TopHeader title={t('createAppointment.title')} />
        <StepIndicator
          step={4}
          nowStep={1}
        />
        <View className="p-5">
          <Text className="text-xl font-bold mb-2">참여자를 선택해주세요</Text>
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={selectAll}>
              <Text className="text-base text-text-secondary">모두 선택</Text>
            </TouchableOpacity>
          </View>
          {clubMembers &&
            clubMembers.map((item) => (
              <SelectMemberItem
                key={item.memberId}
                disabled={isUser(item.memberId)}
                img={item.img}
                name={item.nickname}
                email={item.email}
                checked={memberIds.includes(item.memberId)}
                setChecked={() => handleCheckboxChange(item.memberId)}
              />
            ))}
        </View>
      </View>
      <PrevNextButton onPressNext={onPressNext} />
    </SafeAreaView>
  )
}

export default AppointmentCreate1
