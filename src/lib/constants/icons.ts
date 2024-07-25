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
} from 'react-icons/fa6';
import { TbMessageQuestion } from 'react-icons/tb';

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
};

export const asistantIcons = {
  message: TbMessageQuestion,
  minimize: FaMinus,
  assistant: FaUserTie,
};

export const userMenuIcons = {
  settings: FaGear,
  logout: FaArrowRightFromBracket,
};
