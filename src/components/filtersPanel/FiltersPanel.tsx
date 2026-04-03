import "./style.css";

interface Props {
  children?: React.ReactNode;
}

export default function FiltersPanel(props: Props) {
  return (
    <div className="filters">
      <h2 className="filters-title">Filters</h2>
      <div className="filters-container">{props.children}</div>
    </div>
  );
}
