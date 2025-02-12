import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import CameraIcon from '@/assets/icons/camera.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import MoreIcon from '@/assets/icons/more.svg'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import UploadThumbnail from '@/components/UploadThumbnail'
import Colors from '@/constants/Colors'
import { RootState } from '@/store/store'
import { ClubHeaderProps } from '@/types/club'
import { MenuItem } from '@/types/menu'

import { useClubMember } from '../../../hooks/useClubMember'
import ClubDeleteModal from './ClubDeleteModal'
import ClubLeaveModal from './ClubLeaveModal'

const ClubHeader = ({
  name,
  category,
  teamCode,
  clubId,
  img,
}: ClubHeaderProps) => {
  const { user } = useSelector((state: RootState) => state.member)
  const { t } = useTranslation()
  const router = useRouter()

  const updateClubInfo = () => {
    router.push({ pathname: '/club/updateInfo', params: { clubId: clubId } })
  }
  const getMemberList = () => {
    router.push({
      pathname: '/club/memberList',
      params: { clubId: clubId },
    })
  }

  const updateClubProfile = () => {
    router.push({
      pathname: '/club/updateProfile',
      params: { clubId: clubId, memberId: user.id },
    })
  }

  const deleteClub = () => {
    setIsDeleteModalVisible(true)
  }

  const leaveClub = () => {
    setIsLeaveModalVisible(true)
  }

  const adMinMenu: MenuItem[] = [
    {
      title: t('club.updateClubInfo'),
      onSelect: updateClubInfo,
      color: Colors.text.primary,
    },
    {
      title: t('club.getMemberList'),
      onSelect: getMemberList,
      color: Colors.text.primary,
    },
    {
      title: t('club.updateClubProfile'),
      onSelect: updateClubProfile,
      color: Colors.text.primary,
    },
    {
      title: t('club.deleteClub'),
      onSelect: deleteClub,
      color: Colors.light.red,
    },
  ]

  const memberMenu: MenuItem[] = [
    {
      title: t('club.updateClubProfile'),
      onSelect: updateClubProfile,
      color: Colors.text.primary,
    },
    {
      title: t('club.leaveClub'),
      onSelect: leaveClub,
      color: Colors.light.red,
    },
  ]
  const { isMember, isAdmin } = useClubMember({ clubId: clubId })
  const menu = isAdmin ? adMinMenu : memberMenu
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false)
  const uploadImg = () => {
    if (Platform.OS === 'web') {
      router.push({
        pathname: '/club/uploadClubImg',
        params: { clubId: clubId },
      })
    } else {
      console.log('uploadImg')
    }
  }
  return (
    <View className="flex-row p-4 border-b-2 border-bord">
      <View className="flex-1 w-full">
        <Text className="text-xl font-bold">{name}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-secondary">#{category}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-secondary">그룹 초대 코드</Text>
          <Text className="text-sm text-secondary mx-2">{teamCode}</Text>
          <TouchableOpacity>
            <CopyIcon
              height={20}
              width={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity className="">
        {isMember && (
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
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadImg}>
        <CameraIcon
          width={18}
          height={18}
        />
      </TouchableOpacity>
      <View>
        <ClubDeleteModal
          isVisible={isDeleteModalVisible}
          setVisible={setIsDeleteModalVisible}
          clubName={name}
          clubId={clubId}
        />
        <ClubLeaveModal
          isVisible={isLeaveModalVisible}
          setVisible={setIsLeaveModalVisible}
          clubName={name}
          clubId={clubId}
          memberId={user?.id}
        />
      </View>
    </View>
  )
}
export default ClubHeader
