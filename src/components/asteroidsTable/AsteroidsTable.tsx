import type { Neo, NeoHookResponse, NeoResponse } from "../../hooks/useNeo";
import "./style.css";

interface Props {
  neoResponse?: NeoHookResponse;
}

export default function AsteroidsTable(props: Props) {
  if (!props.neoResponse) return <div>Enter date</div>;
  if (props.neoResponse.isLoading) return <div>Loading data...</div>;
  if (props.neoResponse.error) return <div>Error</div>;
  if (!props.neoResponse.data) return <div>No data available</div>;

  const neo = props.neoResponse.data.near_earth_objects;

  return (
    <table className="asteroids-table">
      <thead>
        <tr>
          <th scope="col">name</th>
          <th scope="col">velocity</th>
          <th scope="col">est. diameter</th>
          <th scope="col">distance</th>
          <th scope="col">date</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(neo).map(([date, asteroids]: [string, Neo[]]) =>
          asteroids.map((asteroid) => (
            <tr key={asteroid.id}>
              <td scope="row">{asteroid.name}</td>
              <td scope="row">
                {
                  asteroid.close_approach_data[0].relative_velocity
                    .kilometers_per_hour
                }
              </td>
              <td scope="row">
                {asteroid.estimated_diameter.kilometers.estimated_diameter_max}
              </td>
              <td scope="row">
                {asteroid.close_approach_data[0].miss_distance.kilometers}
              </td>
              <td scope="row">{date}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}
