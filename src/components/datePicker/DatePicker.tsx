import { formatDate } from "../../utils/formatDate";
import "./style.css";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<any>>;
  setEndDate: Dispatch<SetStateAction<any>>;
}

export default function DatePicker(props: Props) {
  return (
    <div className="date-picker">
      <h3>Date</h3>
      <h4>Since</h4>
      <input
        id="start_date"
        type="date"
        value={formatDate(props.startDate)}
        onChange={(e) => props.setStartDate(new Date(e.currentTarget.value))}
      />
      <h4>To</h4>
      <input
        id="end_date"
        type="date"
        onChange={(e) => props.setEndDate(new Date(e.currentTarget.value))}
      />
    </div>
  );
}
