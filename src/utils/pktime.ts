import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertToPakistanTime = (
  date: string | Date | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) => {
  return dayjs(date)
    .utc() // normalize input
    .utcOffset(5 * 60) // PKT = UTC+5
    .format(format);
};
