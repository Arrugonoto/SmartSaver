import {
  FaRegTrashCan,
  FaEllipsisVertical,
  FaPencil,
  FaCalendarDays,
  FaSquare,
  FaCalendar,
  FaGear,
  FaPlus,
  FaMinus,
  FaUserTie,
  FaPaperPlane,
  FaChartLine,
  FaMoneyCheckDollar,
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaUserGear,
  FaMoon,
  FaSun,
  FaCircleInfo,
  FaGithub,
  FaGoogle,
  FaBars,
  FaMagnifyingGlass,
} from 'react-icons/fa6';
import { TbMessageQuestion } from 'react-icons/tb';

export const brandIcons = {
  google: FaGoogle,
  github: FaGithub,
  default: FaMoneyCheckDollar,
};

export const tableIcons = {
  delete: FaRegTrashCan,
  menu: FaEllipsisVertical,
  edit: FaPencil,
};

export const selectIcons = {
  calendar: FaCalendarDays,
  calendarEmpty: FaCalendar,
};

export const chartIcons = {
  square: FaSquare,
};

export const menuIcons = {
  gear: FaGear,
  menu: FaBars,
};

export const navMenuIcons = {
  overview: FaChartLine,
  expenses: FaMoneyCheckDollar,
  assistant: FaUserTie,
};

export const btnIcons = {
  signin: FaArrowRightToBracket,
  plus: FaPlus,
  send: FaPaperPlane,
  lightMode: FaSun,
  darkMode: FaMoon,
  search: FaMagnifyingGlass,
};

export const asistantIcons = {
  message: TbMessageQuestion,
  minimize: FaMinus,
  assistant: FaUserTie,
};

export const userMenuIcons = {
  settings: FaGear,
  logout: FaArrowRightFromBracket,
  themeDark: FaMoon,
  themeLight: FaSun,
};

export const accountIcons = {
  settings: FaUserGear,
};

export const infoIcons = {
  informative: FaCircleInfo,
};
