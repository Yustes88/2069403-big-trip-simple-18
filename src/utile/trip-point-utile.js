import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('DD/MM/YY H:00');
const humanizeHour = (hour) => dayjs(hour).format(' HH:00');
const humanizeStartDate = (startDate) => dayjs(startDate).format('MMM DD');
const differenceHoursMinutes = (dateFrom,dateTo) => dayjs(dateTo).diff(dayjs(dateFrom),'hour','minute');
const isDateAfter = (date) => date && dayjs().isAfter(date, 'D MMM');
const isDateSame = (date) => date && dayjs().isSame(date, 'D MMM');
const isDateBefore = (date) => date && dayjs().isBefore(date, 'D MMM');
const isPriceNumber = (basePrice) => parseInt(basePrice, 10);
const isDatesSame = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
const isPriceSame = (pointA, pointB) => pointA.basePrice === pointB.basePrice;

export {humanizeDate, humanizeHour, humanizeStartDate, differenceHoursMinutes, isDateAfter, isDateSame, isDateBefore, isPriceNumber, isDatesSame, isPriceSame};
