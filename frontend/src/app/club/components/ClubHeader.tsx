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
import BackButton from '@/components/BackButton'
import ImageThumbnail from '@/components/ImageThumbnail'
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
      params: { clubId: clubId, memberId: user.memberId },
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
    // {
    //   title: t('club.updateClubProfile'),
    //   onSelect: updateClubProfile,
    //   color: Colors.text.primary,
    // },
    {
      title: t('club.deleteClub'),
      onSelect: deleteClub,
      color: Colors.light.red,
    },
  ]

  const memberMenu: MenuItem[] = [
    // {
    //   title: t('club.updateClubProfile'),
    //   onSelect: updateClubProfile,
    //   color: Colors.text.primary,
    // },
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
      router.push({
        pathname: '/club/uploadClubImg',
        params: { clubId: clubId },
      })
    }
  }
  return (
    <View className="relative flex-col justify-between pt-4 border-b-2 border-bord bg-group-color1-secondary">
      <View className="relative w-full h-[75px] mt-4 bg-group-color1-secondary">
        <View className="flex-row items-center mt-4">
          <View className="flex-row p-2 items-center">
            <BackButton />
            <View className="flex-row items-center w-1/2">
              <Text className="text-xl font-bold mr-1">{name}</Text>
              <Text className="text-sm text-secondary text-base font-medium bg-white rounded-full p-1">
                #{t(`category.${category}`)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-col justify-start mt-1 bg-white h-[80px]">
        <Text className="text-sm text-secondary mx-4 mt-4">그룹 초대 코드</Text>
        <View className="flex-row items-center">
          <Text className="text-xl font-medium ml-[50px] text-group-color1-primary mx-2">
            {teamCode}
          </Text>
          <TouchableOpacity>
            <CopyIcon
              height={20}
              width={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="absolute right-0 h-[200px] w-1/2 flex-row justify-end items-center">
        <ImageThumbnail
          img={img}
          defaultImg={require('@/assets/clubs/club1.png')}
          width={125}
          height={125}
          className="rounded-full border-2 border-white"
        />
        <View className="flex-col mt-4 pt-4">
          <TouchableOpacity
            onPress={uploadImg}
            className="bg-white rounded-full w-8 h-8 justify-center items-center border border-bord mr-3 mb-3 mt-4">
            <CameraIcon
              width={18}
              height={18}
            />
          </TouchableOpacity>
          <TouchableOpacity className="relative">
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
        </View>
      </View>
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
