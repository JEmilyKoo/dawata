// /src/store/slices/appointmentSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { recommendPlace } from '@/apis/appointment'
import { CategoryGroupCodeTypes } from '@/constants/categoryGroupCode'
import {
  AppointmentCreateInfo,
  AppointmentInfo,
  CreateVoteInfo,
  LocationData,
  Recommand,
  RecommandList,
  Standard,
  StandardRecommand,
} from '@/types/appointment'

const initialState: {
  createAppointmentId: number
  create: AppointmentCreateInfo
  update: AppointmentInfo
  currentVoteStatus: string
  recommandedPlace: LocationData | null
  recommandList: RecommandList[]
  selectedRecommandList: Recommand[]
  createVoteItemList: CreateVoteInfo[]
  standardList: Standard[]
  standardRecommandList: StandardRecommand[]
} = {
  createAppointmentId: 0,
  create: {
    name: '',
    category: '',
    scheduledAt: '',
    voteEndTime: '',
    clubId: 0,
    memberIds: [],
  },
  update: {
    name: '',
    category: '',
    scheduledAt: '',
    voteEndTime: '',
    appointmentId: 0,
  },
  currentVoteStatus: '',
  recommandedPlace: null,
  recommandList: [
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.SW8,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.FD6,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.AC5,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.CE7,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.SC4,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.AT4,
      recommand: [],
    },
    {
      loading: -1,
      category_group_code: CategoryGroupCodeTypes.CT1,
      recommand: [],
    },
  ],
  selectedRecommandList: [
    {
      id: '1',
      place_name: '추천타이틀',
      category_name: '추천카테고리',
      category_group_code: 'SW8',
      category_group_name: 'category_group_name',
      phone: 'phone',
      address_name: 'address_name ',
      road_address_name: '추천장소',
      x: '126.902626',
      y: '37.485005',
      place_url: 'http://naver.com',
    },
  ],
  createVoteItemList: [
    {
      roadAddress: '추천장소',
      longitude: 126.902626,
      latitude: 37.485005,
      title: '추천타이틀',
      category: '추천카테고리',
      linkUrl: 'http://naver.com',
      isOnly: false,
    },
  ],
  standardList: [],
  standardRecommandList: [],
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    addStandardRecommand(state, action) {
      const newStandardRecommand = {
        standard: action.payload,
        recommandList: initialState.recommandList,
      }
      state.standardRecommandList = [
        ...state.standardRecommandList,
        newStandardRecommand,
      ]
    },
    resetAppointmentState: (state) => {
      return initialState // store를 초기 상태로 완전히 리셋
    },
    setCreateAppointmentId(state, action) {
      state.createAppointmentId = action.payload
    },
    resetVote(state) {
      state.createVoteItemList = []
      state.recommandList = initialState.recommandList
      state.selectedRecommandList = []
      // state.recommandedPlace = null
      state.standardList = state.standardList.filter(
        (item) => item.standardId != 0,
      )
      state.standardRecommandList = []
    },

    initCreate(state, action) {
      state.create.category = action.payload.category
      state.create.memberIds = action.payload?.members.map(
        (member) => member.memberId,
      )
      state.create.name = initialState.create.name
      state.create.scheduledAt = initialState.create.scheduledAt
      state.create.voteEndTime = initialState.create.voteEndTime
      state.create.clubId = action.payload.clubId
    },
    setCreateName(state, action) {
      state.create.name = action.payload
    },

    setCreateCategory(state, action) {
      state.create.category = action.payload
    },
    setCreateScheduledAt(state, action) {
      state.create.scheduledAt = action.payload
    },
    setCreateVoteEndTime(state, action) {
      state.create.voteEndTime = action.payload
    },
    setCreateClubId(state, action) {
      state.create.clubId = action.payload
    },
    setCreateMemberIds(state, action) {
      state.create.memberIds = action.payload
    },
    initUpdate(state) {
      Object.assign(state.update, initialState.update)
    },
    patchUpdate(state, action) {
      state.update.name = action.payload.name
      state.update.appointmentId = action.payload.appointmentId
      state.update.category = action.payload.category
      state.update.scheduledAt = action.payload.scheduledAt
      state.update.voteEndTime = action.payload.voteEndTime
    },
    setUpdateName(state, action) {
      state.update.name = action.payload
    },
    setUpdateCategory(state, action) {
      state.update.category = action.payload
    },
    setUpdateScheduledAt(state, action) {
      state.update.scheduledAt = action.payload
    },
    setUpdateVoteEndTime(state, action) {
      state.update.voteEndTime = action.payload
    },
    setUpdateAppointmentId(state, action) {
      state.update.appointmentId = action.payload
    },
    setCurrentVoteStatus(state, action) {
      state.currentVoteStatus = action.payload
    },

    setRecommandedPlace(state, action) {
      state.recommandedPlace = action.payload
    },
    setCreateVoteItemList(state, action) {
      state.createVoteItemList = action.payload
    },
    setStandardList(state, action) {
      state.standardList = action.payload
    },
    addStandardList(state, action) {
      state.standardList = [...state.standardList, ...action.payload]
    },
    setRecommandList(state, action) {
      state.recommandList = action.payload
    },
    setSelectedRecommandList(state, action) {
      state.selectedRecommandList = action.payload
    },
    updateRecommandList(state, action) {
      state.recommandList = state.recommandList.map((item) => {
        if (item.category_group_code === action.payload.category_group_code) {
          return action.payload
        } else {
          return item
        }
      })
    },
    fetchRecommendPlace(state, action) {
      state.recommandedPlace = action.payload
    },
    deleteRecommandStandard(state) {
      state.standardRecommandList = state.standardRecommandList.filter(
        (item) => item.standard.standardId != 0,
      )
    },
    updateRecommandedStandardCoordinates(state, action) {
      state.standardRecommandList = state.standardRecommandList.map((item) =>
        item.standard.standardId != 0
          ? {
              ...item,
              standard: {
                ...item.standard,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
              },
            }
          : item,
      )
    },
    resetRecommandStandard(state, action) {
      state.standardRecommandList = state.standardRecommandList.map((item) =>
        item?.standard?.standardId === action.payload?.standard?.standardId
          ? {
              recommandList: initialState.recommandList,
              standard: action.payload,
            }
          : item,
      )
    },
    updateLoading(state, action) {
      state.standardRecommandList = state.standardRecommandList.map((item) =>
        item.standard.standardId === action.payload.standardId
          ? {
              ...item,
              recommandList: item.recommandList.map((recommand) =>
                recommand.category_group_code ===
                action.payload.category_group_code
                  ? { ...recommand, loading: action.payload.loading }
                  : recommand,
              ),
            }
          : item,
      )
    },
    updateStandardRecommandList(state, action) {
      state.standardRecommandList = state.standardRecommandList.map((item) =>
        item.standard.standardId === action.payload.selectedStandard.standardId
          ? {
              standard: action.payload.selectedStandard,
              recommandList: {
                ...item.recommandList,
                loading: 1,
                recommand: action.payload.data,
              },
            }
          : item,
      )
    },
    updatePickList(state, action) {
      if (!action.payload?.standardId || !action.payload?.newPickedList) {
        return
      }

      state.standardRecommandList = state.standardRecommandList.map((item) => {
        if (item.standard.standardId !== action.payload.standardId) {
          return item
        }

        // recommandList가 없는 경우를 처리
        if (!item.recommandList) {
          return {
            ...item,
            recommandList: [
              {
                category_group_code:
                  action.payload.newPickedList.category_group_code,
                recommand: action.payload.newPickedList.recommand,
                loading: action.payload.newPickedList.loading,
              },
            ],
          }
        }

        // 기존 recommandList가 있는 경우
        const existingCategoryIndex = item.recommandList.findIndex(
          (r) =>
            r.category_group_code ===
            action.payload.newPickedList.category_group_code,
        )

        if (existingCategoryIndex === -1) {
          // 새로운 카테고리인 경우
          return {
            ...item,
            recommandList: [
              ...item.recommandList,
              action.payload.newPickedList,
            ],
          }
        }

        // 기존 카테고리 업데이트
        const updatedRecommandList = [...item.recommandList]
        updatedRecommandList[existingCategoryIndex] =
          action.payload.newPickedList

        return {
          ...item,
          recommandList: updatedRecommandList,
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecommendPlaceAsync.fulfilled, (state, action) => {
      state.recommandedPlace = action.payload
    })
  },
})

export const {
  initCreate,
  setCreateName,
  setCreateCategory,
  setCreateScheduledAt,
  setCreateVoteEndTime,
  setCreateClubId,
  setCreateMemberIds,
  setCurrentVoteStatus,
  setUpdateAppointmentId,
  setUpdateVoteEndTime,
  setUpdateScheduledAt,
  setUpdateCategory,
  setUpdateName,
  patchUpdate,
  initUpdate,
  setRecommandedPlace,
  setCreateVoteItemList,
  setStandardList,
  setRecommandList,
  setSelectedRecommandList,
  resetAppointmentState,
  updateRecommandList,
  setCreateAppointmentId,
  resetVote,
  updateRecommandedStandardCoordinates,
  addStandardRecommand,
  deleteRecommandStandard,
  resetRecommandStandard,
  updateLoading,
  updateStandardRecommandList,
  updatePickList,
} = appointmentSlice.actions

export const fetchRecommendPlaceAsync = createAsyncThunk(
  'appointment/fetchRecommendPlace',
  async (payload: number, { rejectWithValue }) => {
    console.log('📡 장소 추천 요청 시작:', payload)

    try {
      const response = await recommendPlace(payload)
      console.log('✅ 장소 추천 응답 수신:', response)
      return response.data // 성공 시 반환
    } catch (error: any) {
      console.error('❌ 장소 추천 실패:', error.message)
      return rejectWithValue(error.response?.data || '알 수 없는 오류') // 실패 시 처리
    }
  },
)

export default appointmentSlice.reducer
