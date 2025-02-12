import { useEffect, useState } from 'react'
import { Button, Image, Platform, Text, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'

import { patchMemberImg } from '@/apis/member'
import CameraIcon from '@/assets/icons/camera.svg'
import Cropper from '@/components/WebImageCropper'
import ImageUploader from '@/hooks/useUploadThumbnail'

export default function UploadImg() {
  const { image, pickImage, cropImage, croppedImage } = ImageUploader()
  const memberId = Number(useLocalSearchParams().memberId)
  useEffect(() => {
    pickImage()
  }, [])
  const base64ToBlob = (base64: string) => {
    const byteCharacters = atob(base64.split(',')[1]) // Base64 데이터 부분만 추출
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: 'image/png' })
  }

  const uploadMemberImg = async (croppedImage: string) => {
    let fileName = new Date().toISOString()
    console.log(croppedImage)
    const result = await patchMemberImg(fileName, base64ToBlob(croppedImage))
    if (result) {
      console.log('업로드 성공')
    }
    console.log(result)
  }

  useEffect(() => {
    if (croppedImage) {
      console.log(croppedImage)
      uploadMemberImg(croppedImage)
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
