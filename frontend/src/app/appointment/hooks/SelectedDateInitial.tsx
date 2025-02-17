import { AppointmentInfo } from '@/types/appointment'

const formatDate = (dateString: string) => dateString.split('T')[0] // YYYY-MM-DD 형식 변환

export function getSelectedDate(
  appointments: AppointmentInfo[],
): string | null {
  if (appointments.length === 0) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()

  const futureAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt) >= today,
  )
  const pastAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt) < today,
  )

  if (
    futureAppointments.some(
      (a) => formatDate(a.scheduledAt) === formatDate(todayStr),
    )
  ) {
    return todayStr
  }

  if (futureAppointments.length > 0) {
    return futureAppointments.sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )[0].scheduledAt
  }

  return pastAppointments.sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
  )[0].scheduledAt
}

export default getSelectedDate
