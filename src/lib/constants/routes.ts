import { navMenuIcons } from './icons';
import { IconType } from 'react-icons';

type Route = {
  name: string;
  path: string;
  icon: IconType;
};

export const ROUTES: Route[] = [
  { name: 'Overview', path: '/dashboard', icon: navMenuIcons.overview },
  { name: 'Expenses', path: '/expenses', icon: navMenuIcons.expenses },
  { name: 'Assistant', path: '/assistant', icon: navMenuIcons.assistant },
  //   { name: 'Schedule', path: '/schedule', icon: navMenuIcons.assistant },
  //   { name: 'Notebook', path: '/notebook', icon: navMenuIcons.assistant },
];
