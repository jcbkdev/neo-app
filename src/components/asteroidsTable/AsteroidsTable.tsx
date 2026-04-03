import { useMemo } from "react";
import type { DisplayFilters } from "../../App";
import type { NeoHookResponse } from "../../hooks/useNeo";
import "./style.css";

interface Props {
  neoResponse?: NeoHookResponse;
  displayFilters: DisplayFilters;
}

export default function AsteroidsTable(props: Props) {
  if (!props.neoResponse) return <div>Enter date</div>;
  if (props.neoResponse.isLoading) return <div>Loading data...</div>;
  if (props.neoResponse.error) return <div>Error</div>;
  if (!props.neoResponse.data) return <div>No data available</div>;

  const neo = props.neoResponse.data.near_earth_objects;

  console.log(
    "Component is rendering! Current Max Filter is:",
    props.displayFilters.velocityMax,
  );

  const displayedAsteroids = useMemo(() => {
    let allAsteroids = Object.entries(neo).flatMap(([date, asteroids]) =>
      asteroids.map((asteroid) => ({
        ...asteroid,
        approachDate: date,
      })),
    );

    if (props.displayFilters.velocityMin) {
      allAsteroids = allAsteroids.filter(
        (a) =>
          Number(
            a.close_approach_data[0].relative_velocity.kilometers_per_hour,
          ) >= props.displayFilters.velocityMin!,
      );
    }

    if (props.displayFilters.velocityMax) {
      allAsteroids = allAsteroids.filter(
        (a) =>
          Number(
            a.close_approach_data[0].relative_velocity.kilometers_per_hour,
          ) <= props.displayFilters.velocityMax!,
      );
    }

    return allAsteroids;
  }, [neo, props.displayFilters]);

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
        {displayedAsteroids.map((asteroid) => (
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
            <td scope="row">{asteroid.approachDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
