"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availabilityData: AvailabilityData;
  config?: BookingConfig;
}

interface BookingConfig {
  logoUrl?: string;
  defaultAdults?: number;
  minNights?: number;
  maxNights?: number;
  bookingEngineUrl: string;
  accentColor?: string;
  backgroundColor?: string;
}

export interface AvailabilityData {
  dates: DateAvailability[];
  blockedDates: string[];
  reviews: {
    google: { rating: number; count: number };
    tripadvisor: { rating: number; count: number };
  };
}

export interface DateAvailability {
  date: string;
  price: number;
  currency: string;
  status: "available" | "last-rooms" | "minimum-stay";
}

interface BookingParams {
  adults: number;
  arrival: string;
  departure: string;
  promoCode?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const ADULTS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const DEFAULT_CONFIG: Required<Omit<BookingConfig, "bookingEngineUrl">> = {
  logoUrl: "/logo.png",
  defaultAdults: 2,
  minNights: 1,
  maxNights: 30,
  accentColor: "#C69C4D",
  backgroundColor: "#E8E4DC",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BookingModal({
  isOpen,
  onClose,
  availabilityData,
  config,
}: BookingModalProps) {
  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  } as Required<BookingConfig>;

  // ============================================================================
  // STATE
  // ============================================================================
  const [adults, setAdults] = useState(finalConfig.defaultAdults);
  const [promoCode, setPromoCode] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingArrival, setIsSelectingArrival] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // ============================================================================
  // MEMOIZED DATA MAPS
  // ============================================================================

  // Convert array to Map for O(1) lookup
  const availabilityMap = useMemo(() => {
    const map = new Map<string, DateAvailability>();
    availabilityData.dates.forEach((d) => {
      map.set(d.date, d);
    });
    return map;
  }, [availabilityData.dates]);

  const blockedDatesSet = useMemo(() => {
    return new Set(availabilityData.blockedDates);
  }, [availabilityData.blockedDates]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset selection mode when dates are cleared
  useEffect(() => {
    if (!arrivalDate && !departureDate) {
      setIsSelectingArrival(true);
      setValidationError(null);
    }
  }, [arrivalDate, departureDate]);

  // Validate date range when both dates selected
  useEffect(() => {
    if (arrivalDate && departureDate) {
      const nights = Math.ceil(
        (departureDate.getTime() - arrivalDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (nights < finalConfig.minNights) {
        setValidationError(`Minimum stay is ${finalConfig.minNights} night(s)`);
      } else if (nights > finalConfig.maxNights) {
        setValidationError(`Maximum stay is ${finalConfig.maxNights} night(s)`);
      } else if (hasBlockedDateInRange(arrivalDate, departureDate)) {
        setValidationError("Selected range contains blocked dates");
      } else {
        setValidationError(null);
      }
    }
  }, [
    arrivalDate,
    departureDate,
    finalConfig.minNights,
    finalConfig.maxNights,
  ]);

  // ============================================================================
  // CALENDAR LOGIC
  // ============================================================================

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Mon=0

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, []);

  const getDateKey = useCallback((date: Date): string => {
    return date.toISOString().split("T")[0];
  }, []);

  const isDateBlocked = useCallback(
    (date: Date): boolean => {
      return blockedDatesSet.has(getDateKey(date));
    },
    [blockedDatesSet, getDateKey]
  );

  const getDateAvailability = useCallback(
    (date: Date): DateAvailability | null => {
      const key = getDateKey(date);
      return availabilityMap.get(key) || null;
    },
    [availabilityMap, getDateKey]
  );

  const hasBlockedDateInRange = useCallback(
    (start: Date, end: Date): boolean => {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + 1); // Start from day after arrival

      while (currentDate < end) {
        if (isDateBlocked(currentDate)) {
          return true;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return false;
    },
    [isDateBlocked]
  );

  const isDateInRange = useCallback(
    (date: Date) => {
      if (!arrivalDate || !departureDate) return false;
      return date > arrivalDate && date < departureDate;
    },
    [arrivalDate, departureDate]
  );

  const isDateSelected = useCallback(
    (date: Date) => {
      if (!arrivalDate && !departureDate) return false;
      return (
        date.toDateString() === arrivalDate?.toDateString() ||
        date.toDateString() === departureDate?.toDateString()
      );
    },
    [arrivalDate, departureDate]
  );

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateBlocked(date)) return;

      const availability = getDateAvailability(date);
      if (!availability) return; // Date not available

      if (isSelectingArrival) {
        setArrivalDate(date);
        setDepartureDate(null);
        setIsSelectingArrival(false);
        setValidationError(null);
      } else {
        if (arrivalDate && date <= arrivalDate) {
          // If clicked date is before/same as arrival, set as new arrival
          setArrivalDate(date);
          setDepartureDate(null);
          setValidationError(null);
        } else {
          setDepartureDate(date);
          setIsSelectingArrival(true);
        }
      }
    },
    [isSelectingArrival, arrivalDate, isDateBlocked, getDateAvailability]
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  }, [currentMonth]);

  const handleBook = useCallback(() => {
    if (!arrivalDate || !departureDate || validationError) return;

    const params: BookingParams = {
      adults,
      arrival: getDateKey(arrivalDate),
      departure: getDateKey(departureDate),
    };

    if (promoCode) {
      params.promoCode = promoCode;
    }

    // Build URL with query parameters
    const url = new URL(finalConfig.bookingEngineUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    // Open in new tab
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }, [
    adults,
    arrivalDate,
    departureDate,
    promoCode,
    validationError,
    finalConfig.bookingEngineUrl,
    getDateKey,
  ]);

  const formatPrice = useCallback((price: number, currency: string) => {
    if (currency === "IDR") {
      const millions = price / 1000000;
      return `IDR ${millions.toFixed(1)}M`;
    }
    return `${currency} ${price.toLocaleString()}`;
  }, []);

  const calculateTotalNights = useCallback(() => {
    if (!arrivalDate || !departureDate) return 0;
    return Math.ceil(
      (departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [arrivalDate, departureDate]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderDateCell = (date: Date | null) => {
    if (!date) {
      return <div key={`empty-${Math.random()}`} className="aspect-square" />;
    }

    const availability = getDateAvailability(date);
    const isBlocked = isDateBlocked(date);
    const isSelected = isDateSelected(date);
    const isInRange = isDateInRange(date);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isDisabled = isPast || isBlocked || !availability;

    return (
      <button
        key={date.toISOString()}
        onClick={() => !isDisabled && handleDateClick(date)}
        disabled={isDisabled}
        className={`
          relative aspect-square flex flex-col items-center justify-center p-1 text-sm
          transition-all duration-200 rounded
          ${
            isDisabled
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#C69C4D]/10"
          }
          ${isSelected ? "bg-[#C69C4D] text-white font-semibold shadow-md" : ""}
          ${isInRange ? "bg-[#C69C4D]/20" : ""}
          ${isBlocked ? "bg-red-50 line-through" : ""}
        `}
        style={{
          backgroundColor: isSelected ? finalConfig.accentColor : undefined,
        }}
      >
        <span className="text-base">{date.getDate()}</span>

        {!isDisabled && availability && (
          <>
            {/* Price */}
            <span
              className={`text-[9px] mt-0.5 font-medium ${
                isSelected ? "text-white" : "text-green-600"
              }`}
            >
              {formatPrice(availability.price, availability.currency)}
            </span>

            {/* Status Indicators */}
            <div className="absolute top-1 right-1 flex gap-0.5">
              {availability.status === "available" && (
                <div
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                  title="Best Price"
                />
              )}
              {availability.status === "last-rooms" && (
                <div
                  className="w-1.5 h-1.5 bg-red-500 rounded-full"
                  title="Last Room(s)"
                />
              )}
              {availability.status === "minimum-stay" && (
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  title="Minimum Stay"
                />
              )}
            </div>
          </>
        )}
      </button>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  const totalNights = calculateTotalNights();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl rounded-lg shadow-2xl my-8 animate-fadeIn"
        style={{ backgroundColor: finalConfig.backgroundColor }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-full transition-all"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Logo & Reviews */}
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span
                  style={{ color: finalConfig.accentColor }}
                  className="font-semibold"
                >
                  {availabilityData.reviews.google.rating} ⭐
                </span>
                <span>
                  / {availabilityData.reviews.google.count} Google Reviews
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  style={{ color: finalConfig.accentColor }}
                  className="font-semibold"
                >
                  {availabilityData.reviews.tripadvisor.rating} ⭐
                </span>
                <span>
                  / {availabilityData.reviews.tripadvisor.count} Tripadvisor
                  Reviews
                </span>
              </div>
            </div>

            <div className="relative w-24 h-24">
              <Image
                src={finalConfig.logoUrl}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Number of Adults */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of adults
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 outline-none transition-all focus:ring-2 focus:[--accent-color] focus:border-transparent"
              >
                {ADULTS_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Date Labels */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className={`text-sm font-medium transition-colors ${
                isSelectingArrival ? "font-semibold" : ""
              }`}
              style={{
                color: isSelectingArrival ? finalConfig.accentColor : "#6B7280",
              }}
            >
              Arrival Date {isSelectingArrival && "→"}
            </div>
            <div
              className={`text-sm font-medium transition-colors ${
                !isSelectingArrival ? "font-semibold" : ""
              }`}
              style={{
                color: !isSelectingArrival
                  ? finalConfig.accentColor
                  : "#6B7280",
              }}
            >
              Departure Date {!isSelectingArrival && "→"}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg p-4 md:p-6 mb-4 shadow-sm">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous month"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <h3
                className="text-lg md:text-xl font-medium"
                style={{ color: finalConfig.accentColor }}
              >
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next month"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs md:text-sm font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) =>
                renderDateCell(date)
              )}
            </div>
          </div>

          {/* Validation Error or Night Count */}
          <div className="mb-6 text-center min-h-[24px]">
            {validationError ? (
              <p className="text-red-600 text-sm font-medium">
                {validationError}
              </p>
            ) : totalNights > 0 ? (
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">{totalNights}</span> night
                {totalNights !== 1 ? "s" : ""} selected
              </p>
            ) : null}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Best Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Last room(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span>Minimum stay</span>
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBook}
            disabled={!arrivalDate || !departureDate || !!validationError}
            className="w-full md:w-auto md:min-w-[200px] mx-auto block px-8 py-3 text-white font-semibold rounded transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: finalConfig.accentColor,
              opacity:
                !arrivalDate || !departureDate || !!validationError ? 0.5 : 1,
            }}
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
}
