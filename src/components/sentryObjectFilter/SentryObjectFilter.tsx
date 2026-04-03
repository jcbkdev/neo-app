import "./style.css";
import type React from "react";

export type SentryObjectFilterOption = "show" | "highlight" | "hide" | "only";

interface Props {
  setSentryObjectFilterOption: (value: SentryObjectFilterOption) => void;
}

export default function SentryObjectFilter(props: Props) {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as SentryObjectFilterOption;
    props.setSentryObjectFilterOption(value);
  };

  return (
    <div className="sentry-filter">
      <h3>Sentry objects</h3>
      <select
        id="sentry-filter-select"
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
