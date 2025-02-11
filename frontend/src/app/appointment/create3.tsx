import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import CheckBox from 'expo-checkbox'
import { useRouter } from 'expo-router'

import { createAppointment } from '@/apis/appointment'
import RoundCheckBox from '@/components/RoundCheckBox'
import SelectMemberItem from '@/components/SelectMemberItem'
import { RootState } from '@/store/store'

import { setCreateMemberIds } from '../../store/slices/appointmentSlice'
import { useClub } from '../club/hooks/useClubInfo'

const AppointmentCreate3 = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.member)
  const { create } = useSelector((state: RootState) => state.appointment) // Redux store에서 모든 데이터 가져오기
  const { clubInfo } = useClub({ clubId: create.clubId })
  const clubMembers = clubInfo?.members || []
  const memberIds = create.memberIds

  const onSubmit = async () => {
    dispatch(setCreateMemberIds(memberIds))
    if (await createAppointment(create)) {
      router.push('/appointment/create4')
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
    router.push('/appointment/create4')
  }
  const onPressPrev = () => {
    onSubmit()
    router.push('/appointment/create2')
  }

  const isUser = (memberId: number) => {
    return memberId === user.id
  }

  return (
    <View className="flex-1 p-4 bg-white justify-between">
      <View>
        <Text className="text-xl font-bold mb-2">참여자를 선택해주세요</Text>
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
      <View className="flex-row justify-between space-x-2">
        <TouchableOpacity
          className="bg-bord p-2 rounded w-1/4"
          onPress={onPressPrev}>
          <Text className="text-text-primary text-center font-bold">
            {t('prev')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary p-2 rounded w-3/4"
          onPress={onPressNext}>
          <Text className="text-white text-center font-bold">{t('next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppointmentCreate3
