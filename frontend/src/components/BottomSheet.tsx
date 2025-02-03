import { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetHandleProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { withModalProvider } from '@/components/withModalProvider';
import { HeaderHandle } from '@/components/HeaderHandle';

interface BottomSheetProps {
  handleChange: (index: number) => void; 
  children: React.ReactNode; 
}

const BottomSheet = ({ handleChange, children }: BottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);

  useEffect(() => {
    bottomSheetRef.current!.present();
  }, []);

  const renderHeaderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <HeaderHandle {...props} />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <BottomSheetModal
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDismissOnClose={false}
        enableDynamicSizing={false}
        onChange={handleChange}
        handleComponent={renderHeaderHandle}
      >
        {children}
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

// withModalProvider 타입 확장: BottomSheet에 props 전달
const BottomSheetWithModalProvider = withModalProvider((props: BottomSheetProps) => (
  <BottomSheet {...props} />
));

export default BottomSheetWithModalProvider;
