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

  const displayedAsteroids = useMemo(() => {
    let allAsteroids = Object.entries(neo).flatMap(([date, asteroids]) =>
      asteroids.map((asteroid) => ({
        ...asteroid,
        approachDate: date,
        highlight: false,
        highlightType: "",
      })),
    );

    if (props.displayFilters.velocity) {
      if (props.displayFilters.velocity.min) {
        allAsteroids = allAsteroids.filter(
          (a) =>
            Number(
              a.close_approach_data[0].relative_velocity.kilometers_per_hour,
            ) >= props.displayFilters.velocity!.min!,
        );
      }

      if (props.displayFilters.velocity.max) {
        allAsteroids = allAsteroids.filter(
          (a) =>
            Number(
              a.close_approach_data[0].relative_velocity.kilometers_per_hour,
            ) <= props.displayFilters.velocity!.max!,
        );
      }
    }

    if (props.displayFilters.diameter) {
      if (props.displayFilters.diameter.min) {
        allAsteroids = allAsteroids.filter(
          (a) =>
            Number(a.estimated_diameter.kilometers.estimated_diameter_max) >=
            props.displayFilters.diameter!.min!,
        );
      }

      if (props.displayFilters.diameter.max) {
        allAsteroids = allAsteroids.filter(
          (a) =>
            Number(a.estimated_diameter.kilometers.estimated_diameter_max) <=
            props.displayFilters.diameter!.max!,
        );
      }
    }

    switch (props.displayFilters.PHAFilterOption) {
      case "show":
        break;
      case "highlight":
        allAsteroids.filter((a) => {
          if (a.is_potentially_hazardous_asteroid) {
            a.highlight = true;
            a.highlightType = "warn";
          }
        });
        break;
      case "only":
        allAsteroids = allAsteroids.filter(
          (a) => a.is_potentially_hazardous_asteroid,
        );
        break;
      case "hide":
        allAsteroids = allAsteroids.filter(
          (a) => !a.is_potentially_hazardous_asteroid,
        );
        break;
      default:
        throw new Error("Invalid PHAFilterOption value");
        break;
    }

    switch (props.displayFilters.sentryObjectFilterOption) {
      case "show":
        break;
      case "highlight":
        allAsteroids.filter((a) => {
          if (a.is_sentry_object) {
            a.highlight = true;
            a.highlightType = "crit";
          }
        });
        break;
      case "only":
        allAsteroids = allAsteroids.filter((a) => a.is_sentry_object);
        break;
      case "hide":
        allAsteroids = allAsteroids.filter((a) => !a.is_sentry_object);
        break;
      default:
        throw new Error("Invalid sentryObjectFilterOption value");
        break;
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
          <tr
            className={
              asteroid.highlight
                ? `row-highlight-${asteroid.highlightType}`
                : ""
            }
            key={asteroid.id}
          >
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
