import React, { useCallback, useMemo, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import BottomSheet from "@gorhom/bottom-sheet"

export default function TestPage() {
  // BottomSheet의 ref 설정
  const bottomSheetRef = useRef<BottomSheet>(null)

  // snapPoints 설정: BottomSheet 위치를 설정 (10%, 50%, 90%)
  const snapPoints = useMemo(() => ["10%", "50%", "90%"], [])

  // 상태 변경 핸들러 (BottomSheet 위치 변경 시)
  const handleSheetChanges = useCallback((index: number) => {
    console.log("Current BottomSheet index:", index)
  }, [])

  // BottomSheet 내용
  const renderBottomSheetContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>BottomSheet Content</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Button Pressed!")}>
        <Text style={styles.buttonText}>Press me</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BottomSheet Test Page</Text>

      {/* BottomSheet Component */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0} // 기본적으로 10% 위치에서 시작
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true} // 스와이프하여 닫을 수 있게 설정
        style={styles.bottomSheet}>
        {renderBottomSheetContent()}
      </BottomSheet>

      {/* Open BottomSheet Button */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => bottomSheetRef.current?.expand()} // expand()로 BottomSheet를 열기
      >
        <Text style={styles.buttonText}>Open BottomSheet</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // BottomSheet가 다른 요소 위로 올라오게 설정
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  testButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
})
