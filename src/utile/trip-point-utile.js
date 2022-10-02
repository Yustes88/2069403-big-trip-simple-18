import dayjs from 'dayjs';

const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
const humanizeDate = (date) => dayjs(date).format('DD/MM/YY H:00');
const humanizeHour = (hour) => dayjs(hour).format(' HH:00');
const humanizeStartDate = (startDate) => dayjs(startDate).format('MMM DD');
const isPriceNumber = (basePrice) => parseInt(basePrice, 10);
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
const isPriceSame = (pointA, pointB) => pointA.basePrice === pointB.basePrice;

export {isEscKey, humanizeDate, humanizeHour, humanizeStartDate, isPriceNumber, isDatesSame, isPriceSame};
