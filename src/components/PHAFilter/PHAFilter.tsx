import "./style.css";
import type React from "react";

export type PHAFilterOption = "show" | "highlight" | "hide" | "only";

interface Props {
  setPHAFilterOption: (value: PHAFilterOption) => void;
}

export default function PHAFilter(props: Props) {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as PHAFilterOption;
    props.setPHAFilterOption(value);
  };

  return (
    <div className="pha-filter">
      <h3>Potentially hazardous asteroid</h3>
      <select
        id="pha-filter-select"
        defaultValue={"show"}
        onChange={handleSelect}
      >
        <option value="show">Show</option>
        <option value="highlight">Highlight</option>
        <option value="only">Only</option>
        <option value="hide">Hide</option>
      </select>
    </div>
  );
}
