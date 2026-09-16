import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMyBookings = createAsyncThunk('bookings/fetchMyBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my');
    return res.data.bookings;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const bookTicket = createAsyncThunk('bookings/bookTicket', async ({ eventId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings', { eventId, quantity });
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const cancelMyBooking = createAsyncThunk('bookings/cancelMyBooking', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/bookings/${id}`);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelMyBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export default bookingSlice.reducer;
