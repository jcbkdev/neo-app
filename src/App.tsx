import { useState } from "react";
import "./App.css";
import AsteroidsTable from "./components/asteroidsTable/AsteroidsTable";
import FiltersPanel from "./components/filtersPanel/FiltersPanel";
import { useNeo } from "./hooks/useNeo";
import DatePicker from "./components/datePicker/DatePicker";
import VelocityRange from "./components/velocityRange/VelocityRange";
import EstimatedDiameterRange from "./components/estimatedDiameterRange/EstimatedDiameterRange";
import SentryObjectFilter, {
  type SentryObjectFilterOption,
} from "./components/sentryObjectFilter/SentryObjectFilter";

export interface DisplayFilters {
  velocity?: {
    min?: number;
    max?: number;
  };
  diameter?: {
    min?: number;
    max?: number;
  };
  sentryObjectFilterOption: SentryObjectFilterOption;
}

function App() {
  const [displayFilters, setDisplayFilters] = useState<DisplayFilters>({
    sentryObjectFilterOption: "show",
  });
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
                velocity: {
                  ...prev.velocity,
                  min: newValue,
                },
              }));
            }}
            setVelocityMax={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                velocity: {
                  ...prev.velocity,
                  max: newValue,
                },
              }));
            }}
          />
          <EstimatedDiameterRange
            setDiameterMin={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                diameter: {
                  ...prev.diameter,
                  min: newValue,
                },
              }));
            }}
            setDiameterMax={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                diameter: {
                  ...prev.diameter,
                  max: newValue,
                },
              }));
            }}
          />
          <SentryObjectFilter
            setSentryObjectFilterOption={(newValue) => {
              setDisplayFilters((prev) => ({
                ...prev,
                sentryObjectFilterOption: newValue,
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
