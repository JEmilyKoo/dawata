import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, View } from 'react-native'

interface MarqueeTextProps {
  text: string
  speed?: number
  className?: string
}

const MarqueeText = ({
  text,
  speed = 50,
  className = '',
}: MarqueeTextProps) => {
  const scrollPos = useRef(new Animated.Value(0)).current
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const charWidth = 8 // 대략적인 한 글자 너비
  const textWidth = text.length * charWidth

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop()
    }

    scrollPos.setValue(0)

    // 컨테이너가 텍스트보다 넓으면 애니메이션 중지
    if (containerWidth === 0 || containerWidth >= textWidth) {
      return
    }

    const timer = setTimeout(() => {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scrollPos, {
            toValue: -charWidth,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scrollPos, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      )
      animationRef.current.start()
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [text, containerWidth])

  return (
    <View
      className="overflow-hidden flex-1"
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width)
      }}>
      <Animated.Text
        numberOfLines={1}
        ellipsizeMode="clip"
        className={`text-text-secondary text-sm ${className}`}
        style={{
          transform: [{ translateX: scrollPos }],
        }}>
        {
          containerWidth >= textWidth ? text : text + text + text // 부드러운 순환을 위해 3번 반복
        }
      </Animated.Text>
    </View>
  )
}

export default MarqueeText
