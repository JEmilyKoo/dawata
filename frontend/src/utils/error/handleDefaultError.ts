import { setErrorModal } from '@/store/slices/errorModalSlice'
import store from '@/store/store'

export const handleDefaultError = (error: any) => {
  let status = error.response?.status
  switch (status) {
    case 400:
    case 404:
    case 500:
    case 999:
      store.dispatch(
        setErrorModal({
          modalTitle: `error.${status}.title`,
          modalContent: `error.${status}.content`,
          primaryButtonType: 'confirm',
          secondaryButtonType: 'goToHome',
          isVisible: true,
        }),
      )
      break
    default:
      break
  }
  return Promise.reject(error)
}
