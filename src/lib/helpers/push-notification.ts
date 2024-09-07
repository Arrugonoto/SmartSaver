import { toast } from 'react-toastify';
import type {
  ToastPosition,
  Theme,
  ToastTransition,
} from 'node_modules/react-toastify/dist/types';

interface NotificationProps {
  status: 'info' | 'success' | 'warning' | 'error';
  text: string;
  config?: {
    position?: ToastPosition | undefined;
    autoClose?: number | false | undefined;
    hideProgressBar?: boolean | undefined;
    closeOnClick?: boolean | undefined;
    pauseOnHover?: boolean;
    draggable?: boolean | undefined;
    progress?: undefined;
    theme?: Theme | undefined;
    transition?: ToastTransition | undefined;
  };
}

export const pushNotification = ({
  status,
  text,
  config,
}: NotificationProps) => {
  switch (status) {
    case 'info':
      toast.info(`${text}`, {
        ...config,
      });
      break;
    case 'success':
      toast.success(`${text}`, {
        ...config,
      });
      break;
    case 'warning':
      toast.warning(`${text}`, {
        ...config,
      });
      break;
    case 'error':
      toast.error(`${text}`, {
        ...config,
      });
      break;
    default:
      toast.info(`${text}`, {
        ...config,
      });
  }
};
