import { configureStore } from '@reduxjs/toolkit'
import themeToggleReducer from './themeSlice'


export default configureStore({
  reducer: {
    themeToggle:  themeToggleReducer
  }
})