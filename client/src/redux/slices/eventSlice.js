import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/events', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data.event;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createEvent = createAsyncThunk('events/createEvent', async (eventData, { rejectWithValue }) => {
  try {
    const res = await api.post('/events', eventData);
    return res.data.event;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    selectedEvent: null,
    total: 0,
    pages: 1,
    currentPage: 1,
    loading: false,
    error: null
  },
  reducers: {
    updateSeatCount: (state, action) => {
      const { eventId, availableSeats } = action.payload;
      if (state.selectedEvent && state.selectedEvent._id === eventId) {
        state.selectedEvent.availableSeats = availableSeats;
      }
      const ev = state.events.find(e => e._id === eventId);
      if (ev) {
        ev.availableSeats = availableSeats;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateSeatCount } = eventSlice.actions;
export default eventSlice.reducer;
