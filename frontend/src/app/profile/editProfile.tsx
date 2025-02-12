import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import BackButton from '@/components/BackButton'
import { router } from 'expo-router'

export default function EditProfile() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <View className="flex-row p-4 pt-2">
          <BackButton />
          <Text className="text-xl font-bold mt-2">내 정보</Text>
        </View>
      </View>

      <ScrollView>
        {/* 회원 정보 수정 */}
        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="flex-1">
            <Text className="text-xl text-medium text-text-primary">
              회원 정보 수정
            </Text>
          </View>
        </TouchableOpacity>

        {/* 주소 관리 */}
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
        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
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

        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
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

        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-100">
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
    </View>
  )
}
