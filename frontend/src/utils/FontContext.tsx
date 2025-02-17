import React, { createContext, useContext } from 'react'
import { Text, TextProps, StyleSheet } from 'react-native'

// Context 생성
const FontContext = createContext({ fontFamily: 'NotoSansKRRegular' })

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <FontContext.Provider value={{ fontFamily: 'NotoSansKRRegular' }}>{children}</FontContext.Provider>
}

// 기존 Text를 그대로 사용하면서 폰트를 적용하는 컴포넌트
export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const { fontFamily } = useContext(FontContext)
  return <Text style={[styles.text, { fontFamily }, style]} {...props} />
}

// 기본 스타일 정의
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
})
