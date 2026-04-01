import AsteroidsTable from "./components/asteroidsTable/AsteroidsTable";
import { useNeo, type Neo } from "./hooks/useNeo";

function App() {
  const neo = useNeo(new Date("2025-08-01"), new Date("2025-08-08"));

  if (neo.isLoading) return <div>Loading data...</div>;
  if (neo.error) return <div>Error</div>;
  if (!neo.data) return <div>No data available</div>;

  return <AsteroidsTable asteroids={neo.data.near_earth_objects} />;
}

export default App;
