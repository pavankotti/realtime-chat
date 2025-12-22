import { createSlice } from '@reduxjs/toolkit';

export const liveUserSlice = createSlice({
    name: 'liveUser',
    initialState: {
        onlineUsers: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            // action.payload should be an array of user IDs
            state.onlineUsers = action.payload;
        },
    },
});

export const { setOnlineUsers } = liveUserSlice.actions;

export default liveUserSlice.reducer;
