import "./style.css";

interface Props {
  setVelocityMax: (newValue: number | undefined) => void;
  setVelocityMin: (newValue: number | undefined) => void;
}

export default function VelocityRange(props: Props) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      props.setVelocityMin(undefined);
    } else {
      props.setVelocityMin(Number(val));
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      props.setVelocityMax(undefined);
    } else {
      props.setVelocityMax(Number(val));
    }
  };

  return (
    <div className="velocity-range">
      <h3>Velocity</h3>
      <div className="velocity-input-wrapper">
        <div className="velocity-input-container">
          <h4>Min</h4>
          <input
            id="velocity_min"
            type="number"
            step={0.01}
            min={0}
            placeholder="unset"
            onChange={handleMinChange}
          />
        </div>
        <div className="velocity-input-container">
          <h4>Max</h4>
          <input
            id="velocity_max"
            type="number"
            step={0.01}
            min={0}
            placeholder="unset"
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
}
