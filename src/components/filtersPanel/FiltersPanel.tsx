import "./style.css";

interface Props {
  children?: React.ReactNode;
}

export default function FiltersPanel(props: Props) {
  return (
    <div className="filters">
      <h2>Filters</h2>
      <div>{props.children}</div>
    </div>
  );
}
