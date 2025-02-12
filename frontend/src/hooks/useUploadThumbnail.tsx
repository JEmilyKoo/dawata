import { useState } from 'react'
import { Platform } from 'react-native'

import { ImageManipulator } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: Platform.OS !== 'web',
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  const cropImage = async (cropData: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    if (!image) return

    try {
      if (Platform.OS === 'web') {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = document.createElement('img')

        img.src = image
        img.crossOrigin = 'anonymous'

        return new Promise((resolve) => {
          img.onload = () => {
            canvas.width = 400
            canvas.height = 400

            ctx?.drawImage(
              img,
              cropData.x,
              cropData.y,
              cropData.width,
              cropData.height,
              0,
              0,
              400,
              400,
            )

            const croppedImageUrl = canvas.toDataURL('image/png', 1.0)
            setCroppedImage(croppedImageUrl)
            resolve(null)
          }
        })
      } else {
        const manipResult = await ImageManipulator.manipulateAsync(
          image,
          [
            {
              crop: {
                originX: cropData.x,
                originY: cropData.y,
                width: cropData.width,
                height: cropData.height,
              },
            },
            {
              resize: {
                width: 400,
                height: 400,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
        )
        setCroppedImage(manipResult.uri)
      }
    } catch (error) {
      console.error('이미지 크롭 중 오류 발생:', error)
    }
  }

  return { image, pickImage, cropImage, croppedImage }
}
