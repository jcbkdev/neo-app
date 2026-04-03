import { useState } from "react";
import "./App.css";
import AsteroidsTable from "./components/asteroidsTable/AsteroidsTable";
import FiltersPanel from "./components/filtersPanel/FiltersPanel";
import { useNeo } from "./hooks/useNeo";
import DatePicker from "./components/datePicker/DatePicker";

function App() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>();
  const neoResponse = useNeo(startDate, endDate);

  return (
    <>
      <div className="main-box">
        <FiltersPanel>
          <DatePicker
            startDate={startDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </FiltersPanel>
        {!neoResponse.data && neoResponse.message ? (
          <div role="alert">{neoResponse.message}</div>
        ) : (
          <AsteroidsTable neoResponse={neoResponse} />
        )}
      </div>
    </>
  );
}

export default App;
