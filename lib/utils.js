import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDayName(dateStr, locale = "en-IN") {
  const dateFormat = dateStr.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  return dateConv.toLocaleDateString(locale, { weekday: "long" });
}

export function getCurrentMonth(dateStr, locale = "en-IN") {
  const dateFormat = dateStr.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  return dateConv.toLocaleDateString(locale, { month: "numeric" });
}

export function getCurentYear(dateStr, locale = "en-IN") {
  const dateFormat = dateStr.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  return dateConv.toLocaleDateString(locale, { year: "numeric"});
}

export function getFormatedDate(dateStr, locale = "en-IN") {
  const dateFormat = dateStr?.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  return dateConv.toLocaleDateString(locale);
}

export function getFirstDay(dateStr, locale = "en-IN") {
  const dateFormat = dateStr?.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  const year = dateConv.getFullYear(), month = dateConv.getMonth();
  const firstDay = new Date(year, month, 1);
  return firstDay.toLocaleDateString(locale);
}

export function getLastDay(dateStr, locale = "en-IN") {
  const dateFormat = dateStr?.split("/");
  const dateConv = new Date(
    `${dateFormat[1]}/${dateFormat[0]}/${dateFormat[2]}`
  );
  const year = dateConv.getFullYear(), month = dateConv.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  return lastDay.toLocaleDateString(locale);
}

export function validateDateBetween(dateFrom, dateTo, dateCheck, currentMonth) {
  const start = parseInt(dateFrom.split('/')[1]) == currentMonth ? getFormatedDate(dateFrom) : getFirstDay(dateTo);
  const end = parseInt(dateTo.split('/')[1]) == currentMonth ? getFormatedDate(dateTo) : getLastDay(dateFrom);
  const validate = getFormatedDate(dateCheck);
  const evaluate = validate >= start && validate <= end;

  return evaluate;
}

export function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}
