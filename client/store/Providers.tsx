import { FC, ReactNode } from 'react';
import { RoomProvider } from './roomStore';

interface IProviders {
  children: ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
  return <RoomProvider>{children}</RoomProvider>;
};

export default Providers;
