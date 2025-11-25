import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';

dayjs.extend(utc);
dayjs.extend(timezone);

const getAge = (dateString: string) => {
  const date = moment(dateString, 'YYYY-MM-DD');
  const now = moment();

  // Calculate difference in years and months
  const years = now.diff(date, 'years'); // Get the number of full years
  const months = now.diff(date.clone().add(years, 'years'), 'months'); // Get the remaining months

  return `${years || 0} ${(years <= 1) ? 'Yr' : 'Yrs'} ${months || 0} ${(months <= 1) ? 'Mo' : 'Mos'}`;
};

const getDateByDays = (date: any, duePeriod: string) => {
  const currentDuePeriod = duePeriod?.split('-');
  const currentDate = moment(date?.format('YYYY-MM-DD'));
  const calculatedDate = currentDate.add(currentDuePeriod?.[0] as any, currentDuePeriod?.[1] as any);
  return calculatedDate;
};

const addCommasToNumber = (amount: number) => {
  // Convert the number to a string
  const strAmount = amount.toString();

  // Split the string into integer and decimal parts
  const parts = strAmount.split('.');

  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Join the parts back together
  return parts.join('.');
};

const generateSixDigitNumber = (inputNumber: number) => {
  // Ensure input is a positive number
  const currentNumber = Math.abs(inputNumber);

  // Convert the input number to a string
  const inputString = currentNumber.toString();

  // Calculate the number of zeros needed for padding
  const zerosNeeded = 6 - inputString.length;

  // Pad the input number with zeros at the beginning
  const paddedInputString = '0'.repeat(zerosNeeded) + inputString;

  // Take the last 6 digits of the padded input to ensure it's a 6-digit number
  const sixDigitNumber = paddedInputString.slice(-6);

  return sixDigitNumber;
};

const formatDateByCountry = (countryCode: string) => {
  if (countryCode === 'US') {
    return 'M/D/YYYY';
  }
  if (['AU', 'IE', 'NZ'].includes(countryCode)) {
    return 'D/M/YYYY';
  }
  if (['PH'].includes(countryCode)) {
    return 'DD/MM/YYYY';
  }
  if (countryCode === 'CA') {
    return 'YYYY/M/D';
  }
  return 'D/M/YYYY';
};

const formatStringDateByCountry = (date: any, countryCode: any) => {
  const originalDate = dayjs.tz(date, 'UTC');
  const currentTimezone = dayjs.tz.guess();

  if (countryCode === 'US') {
    return dayjs.tz(originalDate, currentTimezone)?.format('MMM DD YYYY');
  }
  if (['AU', 'IE', 'NZ', 'PH'].includes(countryCode)) {
    return dayjs.tz(originalDate, currentTimezone)?.format('DD MMM YYYY');
  }
  if (countryCode === 'CA') {
    return dayjs.tz(originalDate, currentTimezone)?.format('YYYY MMM DD');
  }
  return dayjs.tz(originalDate, currentTimezone)?.format('MMMM DD YYYY');
};

export {
  getAge, getDateByDays, addCommasToNumber, generateSixDigitNumber, formatDateByCountry, formatStringDateByCountry,
};
