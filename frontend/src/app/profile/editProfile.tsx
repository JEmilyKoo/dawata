import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import TopHeader from '@/components/TopHeader'
import { clearTokens } from '@/store/slices/authSlice'
import { resetStore } from '@/store/store'

export default function EditProfile() {
  const dispatch = useDispatch()
  const router = useRouter()

  const logout = () => {
    dispatch(clearTokens())
    dispatch(resetStore())
    router.push('/')
  }
  return (
    <SafeAreaView className="flex-1 bg-white pt-4">
      <TopHeader title="내 정보" />
      <ScrollView>
        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              회원 정보 수정
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/profile/manageAddress',
            })
          }}
          className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              주소 관리
            </Text>
          </View>
        </TouchableOpacity>

        {/* 내 루틴 목록 */}
        <TouchableOpacity
          className="flex-row items-center px-4 py-4 border-b border-gray-100"
          onPress={() => {
            router.push({
              pathname: '/routine/routineList',
            })
          }}>
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              내 루틴 목록
            </Text>
          </View>
        </TouchableOpacity>

        {/* 고객 지원 섹션 */}
        <View className="px-4 py-1 bg-bord">
          <Text className="text-sm text-text-secondary">고객 지원</Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center px-4 py-4 border-b border-gray-100"
          onPress={() => {
            router.push({
              pathname: '/testPage2',
            })
          }}>
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              버그 및 오류 신고
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              문의하기
            </Text>
          </View>
        </TouchableOpacity>

        {/* 계정 관리 섹션 */}
        <View className="px-4 py-1 bg-bord">
          <Text className="text-sm text-text-secondary">계정 관리</Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center px-4 py-4 border-b border-gray-100"
          onPress={logout}>
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              로그아웃
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-xl text-medium text-light-red">
              회원 탈퇴
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
