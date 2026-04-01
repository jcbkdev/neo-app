import "./App.css";
import { useNeo, type Neo } from "./hooks/useNeo";

function App() {
  const neo = useNeo(new Date("2025-08-01"), new Date("2025-08-08"));

  if (neo.isLoading) return <div>Loading data...</div>;
  if (neo.error) return <div>Error</div>;
  if (!neo.data) return <div>No data available</div>;

  return (
    <div>
      {Object.entries(neo.data.near_earth_objects).map(
        ([date, asteroids]: [string, Neo[]]) =>
          asteroids.map((asteroid) => <div>{asteroid.name}</div>),
      )}
    </div>
  );
}

export default App;
