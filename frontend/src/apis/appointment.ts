import api from './api';
import handleApiError from '@/utils/errorHandler';
import { AppointmentCreateInfo } from '@/types/appointment';

interface GetAppointmentsParams {
  clubId: number;
  nextRange?: number;
  prevRange?: number;
}

// 약속 리스트 조회
export const getAppointments = async ({ clubId, nextRange = 4, prevRange = 4 }: GetAppointmentsParams) => {
  try {
    const response = await api.get(`/appointments`, {
      params: { clubId, nextRange, prevRange },
    });
    return response.data;

  } catch (error) {
    console.error('⛔ 약속 리스트 조회 실패:', handleApiError(error));
    return null;
  }
};
// 약속 생성
export const createAppointment = async (appointmentCreateInfo: AppointmentCreateInfo) => {
  try {
    const response = await api.post(`/appointments`, appointmentCreateInfo);
    return response.data
  } catch (error) {
    console.error('⛔ 약속 리스트 조회 실패:', handleApiError(error));
    return null;
  }
};

// 약속 상세 조회
// 투표 방의 투표 항목 조회
// 투표 방의 투표 항목 생성
// 투표하기 (다중 투표 가능)