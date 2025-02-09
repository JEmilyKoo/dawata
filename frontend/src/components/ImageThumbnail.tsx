import { useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Colors from '@/constants/Colors'

interface ImageThumbnailProps {
  img: string
  defaultImg: any
  width: number
  height: number
}
const ImageThumbnail = ({
  img,
  defaultImg,
  width,
  height,
}: ImageThumbnailProps) => {
  const [imageError, setImageError] = useState(false)
  const isLoading = useRef(false)

  return (
    <View className="items-center"
    >
      <View className="relative">
        <Image
          source={imageError ? defaultImg : { uri: img }} // ✅ 직접 적용
          className="rounded-xl"
            style={{ width: width || 80, height: height || 80 }}
          resizeMode="stretch" 
          defaultSource={defaultImg}
          onLoadStart={() => {
            console.log('로딩 중', img)
            isLoading.current = true
          }}
          onLoad={() => {
            console.log('로딩 끝', img)
            isLoading.current = false
          }}
          onError={() => {
            console.log('이미지 로딩 실패', img)
            setImageError(true)
            isLoading.current = false
          }}
        />
        {isLoading.current && (
          <View
            className="absolute inset-0 items-center justify-center bg-white opacity-25"
            style={{
              width: width,
              height: height,
            }}
            >
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default ImageThumbnail
