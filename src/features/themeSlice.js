import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isLight: true
  },
  reducers: {
    toggleTheme: (state) => {
      state.isLight = !state.isLight
    }
  }
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
