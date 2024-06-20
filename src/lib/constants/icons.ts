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

export const btnIcons = {
  plus: FaPlus,
};

export const asistantIcons = {
  message: TbMessageQuestion,
  minimize: FaMinus,
  assistant: FaUserTie,
};
