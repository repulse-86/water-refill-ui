import dayjs from 'dayjs';

export function dateKey(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatDate(date) {
  return dayjs(date).format('MMM D, YYYY');
}

export function formatDateTime(date) {
  return dayjs(date).format('MMM D, YYYY, h:mm A');
}

export function formatLongDate(date) {
  return dayjs(date).format('dddd, MMMM D, YYYY');
}

export default dayjs;