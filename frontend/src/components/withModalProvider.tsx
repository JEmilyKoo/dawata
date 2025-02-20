import { FC } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export const withModalProvider = <P extends {}>(Component: FC<P>) => {
  return (props: P) => (
    <BottomSheetModalProvider>
      <Component {...props} />
    </BottomSheetModalProvider>
  );
};
