// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

interface CreatePlay {
  playName: string
  spendTime: number
}
const initialState: {
  create: {
    routineName: string
    playList: CreatePlay[]
  }
  currentVoteStatus: string
} = {
  create: {
    routineName: '기본 루틴',
    playList: [],
  },
  currentVoteStatus: '',
}

const routineSlice = createSlice({
  name: 'routine',
  initialState,
  reducers: {
    initCreate(state) {
      state.create = initialState.create
    },

    setCreateRoutineName(state, action) {
      state.create.routineName = action.payload
    },

    setCreatePlayList(state, action) {
      state.create.playList = action.payload
    },
  },
})

export const { initCreate, setCreateRoutineName, setCreatePlayList } =
  routineSlice.actions
export default routineSlice.reducer
