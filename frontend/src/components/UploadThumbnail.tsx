import { Button, Image, Platform, Text, View } from 'react-native'

import CameraIcon from '@/assets/icons/camera.svg'
import Cropper from '@/components/WebImageCropper'
import ImageUploader from '@/hooks/useUploadThumbnail'

export default function UploadThumbnail() {
  const { image, pickImage, cropImage, croppedImage } = ImageUploader()
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
      {croppedImage && (
        <Image
          source={{ uri: croppedImage }}
          style={{ width: 400, height: 400 }}
        />
      )}
    </View>
  )
}
