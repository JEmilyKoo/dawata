import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

import { BottomSheetHandleProps, BottomSheetModal } from '@gorhom/bottom-sheet'

import { HeaderHandle } from '@/components/HeaderHandle'
import { withModalProvider } from '@/components/withModalProvider'

interface BottomSheetProps {
  handleChange: (index: number) => void
  children: React.ReactNode
}

const BottomSheet = ({ handleChange, children }: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], [])

  useLayoutEffect(() => {
    bottomSheetRef.current?.present()
  }, [])

  const renderHeaderHandle = useCallback(
    (props: BottomSheetHandleProps) => <HeaderHandle {...props} />,
    [],
  )

  return (
    <BottomSheetModal
      index={0}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableDismissOnClose={false}
      enableDynamicSizing={false}
      onChange={handleChange}
      handleComponent={renderHeaderHandle}>
      {children}
    </BottomSheetModal>
  )
}

const BottomSheetWithModalProvider = withModalProvider(
  (props: BottomSheetProps) => <BottomSheet {...props} />,
)

export default BottomSheetWithModalProvider
