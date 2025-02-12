// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

import { Address, AddressCreate } from '@/types/address'

const initialState: {
  create: AddressCreate
  address: Address[]
} = {
  create: {
    addressName: '',
    roadAddress: '',
    latitude: 0,
    longitude: 0,
    isPrimary: true,
  },
  address: [],
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    initCreate(state) {
      state.create = initialState.create
    },
    setCreateAddressName(state, action) {
      state.create.addressName = action.payload
    },
    setCreateRoadAddress(state, action) {
      state.create.roadAddress = action.payload
    },
    setCreateLatitude(state, action) {
      state.create.latitude = action.payload
    },
    setCreateLongitude(state, action) {
      state.create.longitude = action.payload
    },
    setCreateIsPrimary(state, action) {
      state.create.isPrimary = action.payload
    },
    setAddress(state, action) {
      state.address = action.payload
    },
  },
})

export const {
  initCreate,
  setCreateAddressName,
  setCreateRoadAddress,
  setCreateLatitude,
  setCreateLongitude,
  setCreateIsPrimary,
  setAddress,
} = addressSlice.actions
export default addressSlice.reducer
