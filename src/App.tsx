import { useState } from "react";
import "./App.css";
import AsteroidsTable from "./components/asteroidsTable/AsteroidsTable";
import FiltersPanel from "./components/filtersPanel/FiltersPanel";
import { useNeo } from "./hooks/useNeo";
import DatePicker from "./components/datePicker/DatePicker";
import VelocityRange from "./components/velocityRange/VelocityRange";

export interface DisplayFilters {
  velocityMax?: number;
  velocityMin?: number;
}

function App() {
  const [displayFilters, setDisplayFilters] = useState<DisplayFilters>({});
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
          <VelocityRange
            setVelocityMin={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                velocityMin: newValue,
              }));
            }}
            setVelocityMax={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                velocityMax: newValue,
              }));
            }}
          />
        </FiltersPanel>
        {!neoResponse.data && neoResponse.message ? (
          <div role="alert">{neoResponse.message}</div>
        ) : (
          <AsteroidsTable
            displayFilters={displayFilters}
            neoResponse={neoResponse}
          />
        )}
      </div>
    </>
  );
}

export default App;
