import React, { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button, View } from 'react-native'

interface CropperProps {
  image: string
  onCropComplete: (cropData: {
    x: number
    y: number
    width: number
    height: number
  }) => void
}

const WebImageCropper: React.FC<CropperProps> = ({ image, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropCompleteHandler = useCallback((croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  return (
    <View className="inset-0 flex-1 bg-black">
      <View className="absolute bottom-4 w-full flex items-center z-1000">
        <Button
          title="크롭 완료"
          onPress={() => croppedAreaPixels && onCropComplete(croppedAreaPixels)}
        />
      </View>

      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteHandler}
        style={{
          containerStyle: {
            width: '100%',
            height: '90%', // 버튼을 위한 공간 확보
          },
        }}
      />
    </View>
  )
}

export default WebImageCropper
