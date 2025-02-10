import api from './api'

// /appointments/{appointmentId}/vote-items/votes
// {
//     "voteInfos": [
//       {
//         "voteItemId": 1,
//         "isSelected": true
//       }
//     ]
//   }

interface ToggleVoteSelectionParams {
  voteInfos: {
    voteItemId: number
    isSelected: boolean
  }[]
}

export const toggleVoteSelection = async (
  appointmentId: number,
  params: ToggleVoteSelectionParams,
) => {
  const response = await api.post(
    `/appointments/${appointmentId}/vote-items/votes`,
    params,
  )
  return response.data
}
