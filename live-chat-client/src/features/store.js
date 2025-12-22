import { configureStore } from '@reduxjs/toolkit'
import themeSliceReducer from './themeSlice'
import liveUserSliceReducer from './liveUserSlice'

export const store = configureStore({
  reducer: {
    themeToggle: themeSliceReducer,
    liveUser: liveUserSliceReducer,
  },
})

export default store;
