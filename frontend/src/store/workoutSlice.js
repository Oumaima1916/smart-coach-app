import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ── thunks ────────────────────────────────────────────────────────────────────

// POST /api/workouts/start  →  creates a DB row, returns { session: { logId, status, startedAt } }
export const startWorkout = createAsyncThunk(
  'workout/start',
  async ({ planId, planTitle }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/workouts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, planTitle }),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message);
      }
      return await res.json(); // { message, session }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// POST /api/workouts/:logId/pause
export const pauseWorkout = createAsyncThunk(
  'workout/pause',
  async (logId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/workouts/${logId}/pause`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message);
      }
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// POST /api/workouts/:logId/resume
export const resumeWorkout = createAsyncThunk(
  'workout/resume',
  async (logId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/workouts/${logId}/resume`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message);
      }
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// POST /api/workouts/:logId/finish
export const finishWorkout = createAsyncThunk(
  'workout/finish',
  async (logId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/workouts/${logId}/finish`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message);
      }
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// ── slice ─────────────────────────────────────────────────────────────────────

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    activeFilter: 'All',

    // live session state
    session: null,       // { logId, status, startedAt }
    sessionLoading: false,
    sessionError: null,
    completedSession: null, // summary returned by /finish
  },
  reducers: {
    setFilter(state, action) {
      state.activeFilter = action.payload;
    },
    // lets WorkoutDetails clear stale error banners
    clearSessionError(state) {
      state.sessionError = null;
    },
    // called when user navigates away mid-session without finishing
    clearSession(state) {
      state.session = null;
      state.completedSession = null;
      state.sessionError = null;
    },
  },
  extraReducers: (builder) => {
    // ── start ──
    builder
      .addCase(startWorkout.pending, (state) => {
        state.sessionLoading = true;
        state.sessionError = null;
        state.completedSession = null;
      })
      .addCase(startWorkout.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.session = action.payload.session; // { logId, status, startedAt }
      })
      .addCase(startWorkout.rejected, (state, action) => {
        state.sessionLoading = false;
        state.sessionError = action.payload;
      });

    // ── pause ──
    builder
      .addCase(pauseWorkout.fulfilled, (state, action) => {
        // backend flips status to 'paused'
        if (state.session) state.session.status = action.payload.session.status;
      })
      .addCase(pauseWorkout.rejected, (state, action) => {
        state.sessionError = action.payload;
      });

    // ── resume ──
    builder
      .addCase(resumeWorkout.fulfilled, (state, action) => {
        if (state.session) state.session.status = action.payload.session.status;
      })
      .addCase(resumeWorkout.rejected, (state, action) => {
        state.sessionError = action.payload;
      });

    // ── finish ──
    builder
      .addCase(finishWorkout.pending, (state) => {
        state.sessionLoading = true;
      })
      .addCase(finishWorkout.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.completedSession = action.payload.session; // full summary
        state.session = null;
      })
      .addCase(finishWorkout.rejected, (state, action) => {
        state.sessionLoading = false;
        state.sessionError = action.payload;
      });
  },
});

export const { setFilter, clearSessionError, clearSession } = workoutSlice.actions;
export default workoutSlice.reducer;