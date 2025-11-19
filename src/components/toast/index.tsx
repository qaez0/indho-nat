import Success from './Success';
import Error from './Error';
import Loading from './Loading';

// you can add more toast types here
const toastConfig = {
  success: Success,
  error: Error,
  promise: Loading,
};

export default toastConfig;
