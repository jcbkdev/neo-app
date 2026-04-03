import "./style.css";

interface Props {
  setDiameterMax: (newValue: number | undefined) => void;
  setDiameterMin: (newValue: number | undefined) => void;
}

export default function EstimatedDiameterRange(props: Props) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      props.setDiameterMin(undefined);
    } else {
      props.setDiameterMin(Number(val));
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      props.setDiameterMax(undefined);
    } else {
      props.setDiameterMax(Number(val));
    }
  };

  return (
    <div className="diameter-range">
      <h3>Est. diameter</h3>
      <div className="diameter-input-wrapper">
        <div className="diameter-input-container">
          <h4>Min</h4>
          <input
            id="diameter_min"
            type="number"
            step={0.001}
            min={0}
            placeholder="unset"
            onChange={handleMinChange}
          />
        </div>
        <div className="diameter-input-container">
          <h4>Max</h4>
          <input
            id="diameter_max"
            type="number"
            step={0.001}
            min={0}
            placeholder="unset"
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
}
