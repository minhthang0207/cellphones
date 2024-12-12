"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  addDays,
  isSameMonth,
  isSameDay,
  startOfYear,
  addYears,
  subYears,
} from "date-fns";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PiClockCountdownLight } from "react-icons/pi";

interface CalendarProps {
  type?: "from" | "to" | "default";
  hasTime?: boolean;
  size?: "md" | "lg";
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const dayRows = 5;
const dayCols = 7;
const numberOfMonths = 12;
const numberOfYears = 12;

const CalendarCustom: React.FC<CalendarProps> = ({
  type = "default",
  hasTime = false,
  size = "md",
  date,
  setDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isYearView, setIsYearView] = useState(false);
  const [isDecadeView, setIsDecadeView] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [selectedTime, setSelectedTime] = useState("08:00");
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleIconClockClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.showPicker();
    }
  };

  const toggleCalendar = () => setShowCalendar((prev) => !prev);

  const handleDateClick = (day: Date) => {
    setDate(day);
    setShowCalendar(false);
  };

  const handleMonthClick = (month: Date) => {
    setCurrentMonth(month);
    setIsYearView(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <button
        type="button"
        onClick={() =>
          setCurrentMonth(
            isDecadeView
              ? subYears(currentMonth, 10)
              : isYearView
              ? subYears(currentMonth, 1)
              : subMonths(currentMonth, 1)
          )
        }
        className="text-neutrals-700 bg-base-white border-neutrals-200 border-2 p-1.5 rounded-md hover:bg-neutrals-200 transition"
      >
        <SlArrowLeft size={8} />
      </button>
      <span
        className="text-sm text-base-black font-medium cursor-pointer hover:bg-neutrals-200 rounded px-2 transition"
        onClick={() => {
          if (isYearView) {
            setIsDecadeView(true);
          } else {
            setIsYearView(true);
          }
        }}
      >
        {isDecadeView
          ? `${format(
              subYears(currentMonth, currentMonth.getFullYear() % 10),
              "yyyy"
            )} - ${format(
              addYears(currentMonth, 9 - (currentMonth.getFullYear() % 10)),
              "yyyy"
            )}`
          : isYearView
          ? format(currentMonth, "yyyy")
          : format(currentMonth, "MMMM yyyy")}
      </span>
      <button
        type="button"
        onClick={() =>
          setCurrentMonth(
            isDecadeView
              ? addYears(currentMonth, 10)
              : isYearView
              ? addYears(currentMonth, 1)
              : addMonths(currentMonth, 1)
          )
        }
        className="text-neutrals-700 bg-base-white border-neutrals-200 border-2 p-1.5 rounded-md hover:bg-neutrals-200 transition"
      >
        <SlArrowRight size={8} />
      </button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 text-center text-sm font-normal text-neutrals-700">
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
        <div key={index} className="flex justify-center items-center p-2">
          {day}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth); // Start with the first day of the current month
    const startDate = startOfWeek(monthStart); // Align with the start of the week
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    for (let i = 0; i < dayRows; i++) {
      for (let j = 0; j < dayCols; j++) {
        const cloneDay = new Date(day.getTime());
        days.push(
          <div
            className={`p-2 text-center cursor-pointer ${
              !isSameMonth(day, currentMonth) ? "text-[#b2b2b2]" : ""
            } ${
              date && isSameDay(day, date)
                ? "bg-primary-main text-base-white rounded-s"
                : "hover:bg-neutrals-200 rounded transition"
            }`}
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span>{format(day, dateFormat)}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className="grid grid-cols-7 text-sm font-medium"
          key={day.toString()}
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderYearView = () => {
    const startMonth = startOfYear(currentMonth);
    const months = [];
    const dateFormat = "MMM";

    for (let i = 0; i < numberOfMonths; i++) {
      const month = addMonths(startMonth, i);
      months.push(
        <div
          className={`p-2 text-center cursor-pointer ${
            isSameMonth(month, currentMonth)
              ? "bg-primary-main text-base-white rounded-s"
              : "hover:bg-neutrals-200 rounded transition"
          }`}
          key={month.toString()}
          onClick={() => handleMonthClick(month)}
        >
          <span className="">{format(month, dateFormat)}</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2 text-sm font-medium">{months}</div>
    );
  };

  const renderDecadeView = () => {
    const startYear = subYears(currentMonth, currentMonth.getFullYear() % 10);
    const years = [];

    for (let i = 0; i < numberOfYears; i++) {
      const year = addYears(startYear, i);
      years.push(
        <div
          className={`p-2 text-center cursor-pointer ${
            year.getFullYear() === currentMonth.getFullYear()
              ? "bg-primary-main text-base-white rounded-s"
              : "hover:bg-neutrals-200 rounded transition"
          }`}
          key={year.toString()}
          onClick={() => {
            setCurrentMonth(startOfYear(year));
            setIsYearView(true);
            setIsDecadeView(false);
          }}
        >
          <span className="">{format(year, "yyyy")}</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2 text-sm font-medium">{years}</div>
    );
  };

  return (
    <div className="w-full relative h-[36px]">
      {hasTime ? (
        <div
          className={`w-full flex gap-sm items-baseline ${
            size === "md" ? "py-sm" : "py-xxs"
          }`}
        >
          {type !== "default" && (
            <span className="font-semibold mr-auto">
              {type === "from" ? "Từ: " : "Đến: "}
            </span>
          )}
          <div className="flex justify-between items-center gap-2 rounded-md ">
            <div className="flex justify-between gap-m rounded-md ">
              <input
                ref={timeInputRef}
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="outline-none text-sm truncate text-neutrals-400 font-normal bg-transparent"
              />
              <span onClick={handleIconClockClick} className="cursor-pointer">
                <PiClockCountdownLight
                  className="text-primary-main"
                  size={22}
                />
              </span>
            </div>
          </div>

          <div
            className="flex justify-between items-center justify-self-end gap-m rounded-md cursor-pointer relative"
            onClick={toggleCalendar}
          >
            <span className="text-sm truncate text-neutrals-400 font-normal">
              {date ? format(date, "dd/MM/yyyy") : "DD/MM/YYYY"}
            </span>
            <IoCalendarClearOutline className="text-primary-main" size={20} />
          </div>
        </div>
      ) : (
        <div
          className={`flex justify-between items-center gap-2 bg-white px-3 h-full rounded-md border ${
            size === "md" ? "py-1" : "py-2"
          } md cursor-pointer  transition`}
          onClick={toggleCalendar}
        >
          <span className="text-sm truncate font-normal">
            {type !== "default" && (
              <span className="font-semibold ">
                {type === "from" ? "Từ: " : "Đến: "}
              </span>
            )}
            {date ? format(date, "dd/MM/yyyy") : "DD/MM/YYYY"}
          </span>
          <IoCalendarClearOutline className="text-primary-main" size={20} />
        </div>
      )}
      {showCalendar && (
        <div
          className="absolute mt-2 left-0 bg-base-white w-[100%] px-3 pb-2 pt-3 border-2 border-neutrals-200 rounded-2xl z-50"
          ref={calendarRef}
        >
          {renderHeader()}
          {isDecadeView ? (
            renderDecadeView()
          ) : isYearView ? (
            renderYearView()
          ) : (
            <>
              {renderDays()}
              {renderCells()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarCustom;
