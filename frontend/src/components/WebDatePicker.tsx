import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'
import { subDays } from 'date-fns';
import {ko } from 'date-fns/locale/ko';
interface WebDatePickerProps {
  date: Date;
  handleConfirm: (date: Date) => void;
}

const WebDatePicker = ({ date, handleConfirm }: WebDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(date)
    const selectDate = (date: Date | null) => {  
        if (date) {
            setSelectedDate(date)
            handleConfirm(date)
        }
    }
    
    return (
      <DatePicker
        dateFormat='PPP p'
        selected={selectedDate} 
        onChange={(d) => selectDate(d)} 
        showTimeSelect
        minDate={new Date()}
        minTime={selectedDate?.toDateString() === new Date().toDateString() ? new Date() : new Date(0)}
        maxTime={new Date(new Date().setHours(23, 59, 59))}
        locale={ko}
      />
    )
}

export default WebDatePicker;
