import { useEffect, useState } from 'react'
import { Button, Image, Platform, Text, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'

import { patchClubImg } from '@/apis/club'
import CameraIcon from '@/assets/icons/camera.svg'
import Cropper from '@/components/WebImageCropper'
import ImageUploader from '@/hooks/useUploadThumbnail'

export default function UploadClubImg() {
  const { image, pickImage, cropImage, croppedImage } = ImageUploader()
  const clubId = Number(useLocalSearchParams().clubId)

  useEffect(() => {
    pickImage()
  }, [])

  const uploadClubImg = async () => {
    let fileName = new Date().toISOString() + '.png'
    const data = await patchClubImg(clubId, fileName)
    console.log(data)
  }
  useEffect(() => {
    if (croppedImage) {
      console.log(croppedImage)
      uploadClubImg()
    }
  }, [croppedImage])
  return (
    <View className="flex-1 align-center justify-center border-primary">
      <View>
        <CameraIcon
          onPress={pickImage}
          height={18}
          width={18}
        />
      </View>

      {image && Platform.OS === 'web' ? (
        <Cropper
          image={image}
          onCropComplete={cropImage}
        />
      ) : (
        image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
          />
        )
      )}
      {/* {croppedImage && (
        <Image
          source={{ uri: croppedImage }}
          style={{ width: 400, height: 400 }}
        />
      )} */}
    </View>
  )
}
