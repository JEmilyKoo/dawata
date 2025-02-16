declare module 'redux-persist/integration/react' {
  import { ReactNode } from 'react';

  interface PersistGateProps {
    loading?: ReactNode;
    persistor: any;
    children?: ReactNode;
  }

  export class PersistGate extends React.Component<PersistGateProps> {}
}
