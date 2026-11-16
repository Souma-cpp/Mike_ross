import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: {
    _id: "demo-citizen-01",
    name: "Aadhaar Verified Citizen",
    email: "citizen@nyaysetu.in",
    city: "New Delhi",
    state: "Delhi",
    phone: "+91 98765 43210"
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    }
  },
})

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
