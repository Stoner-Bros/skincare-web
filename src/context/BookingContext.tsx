import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import BookingService from "@/services/booking.services";

interface Booking {
  bookingId: number;
  slotDate: string;
  bookingAt: string;
  status: string;
  checkinAt: string | null;
  checkoutAt: string | null;
  totalPrice: number;
  notes: string;
  treatment: {
    treatmentId: number;
    treatmentName: string;
    belongToService: {
      serviceId: number;
      serviceName: string;
    };
  };
  skinTherapist: {
    accountId: number;
    fullName: string;
  } | null;
  staff: any | null;
  customer: {
    accountId: number;
    fullName: string;
  } | null;
  guest: {
    guestId: number;
    fullName: string;
  } | null;
  timeSlots: {
    timeSlotId: number;
    startTime: string;
    endTime: string;
  }[];
}

interface BookingUpdateData {
  skinTherapistId?: number;
  staffId?: number;
  status?: string;
  checkinAt?: string;
  checkoutAt?: string;
  notes?: string;
}

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  fetchBookings: (pageNumber?: number, pageSize?: number) => Promise<void>;
  updateBooking: (
    bookingId: number,
    bookingData: BookingUpdateData
  ) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const fetchBookings = useCallback(async (pageNumber = 1, pageSize = 7) => {
    setLoading(true);
    try {
      const response = await BookingService.getBookings(pageNumber, pageSize);
      setBookings(response.data.items);
      setPageInfo({
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBooking = useCallback(
    async (bookingId: number, bookingData: BookingUpdateData) => {
      try {
        await BookingService.updateBooking(bookingId, bookingData);
      } catch (err) {
        setError("Failed to update booking");
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const value = {
    bookings,
    loading,
    error,
    pageInfo,
    fetchBookings,
    updateBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
