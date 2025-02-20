// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

import { Address, AddressCreate } from '@/types/address'

const initialState: {
  create: AddressCreate
  addresses: Address[]
} = {
  create: {
    addressName: '역삼역',
    roadAddress: '서울특별시 강남구 테헤란로 지하156',
    latitude: 37.500622,
    longitude: 127.036456,
    isPrimary: true,
  },
  addresses: [],
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
    setAddresses(state, action) {
      state.addresses = action.payload
    },
    filterOutAddress(state, action) {
      state.addresses = state.addresses.filter(
        (item) => item.id != action.payload,
      )
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
  setAddresses,
  filterOutAddress,
} = addressSlice.actions
export default addressSlice.reducer
