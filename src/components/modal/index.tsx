import { Fragment } from 'react';
import AuthModal from './Auth';
import Loader from './Loader';
import LiveChat from './LiveChat';
import Bonus from '../bonus/Bonus';
import PopUp from './PopUp';

// add here global scoped modal
export const HelperModal = () => {
  return (
    <Fragment>
      <AuthModal />
      <Loader />
      <LiveChat />
      <Bonus />
      <PopUp />
    </Fragment>
  );
};
