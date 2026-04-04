import { useMemo, useState } from "react";
import type { DisplayFilters } from "../../App";
import type { NeoHookResponse } from "../../hooks/useNeo";
import "./style.css";

const TABLE_COLUMNS = [
  {
    id: "name",
    label: "name",
  },
  {
    id: "velocity",
    label: "velocity",
  },
  {
    id: "diameter",
    label: "est. diameter",
  },
  {
    id: "distance",
    label: "distance",
  },
  {
    id: "date",
    label: "date",
  },
];

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

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState(1);
  const displayedAsteroids = useMemo(() => {
    let allAsteroids = Object.entries(neo).flatMap(([date, asteroids]) =>
      asteroids.map((asteroid) => ({
        ...asteroid,
        approachDate: date,
        highlight: false,
        highlightType: "",
      })),
    );

    //filtering
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

    //sorting
    switch (sortBy) {
      case "name":
        allAsteroids = [...allAsteroids].sort(
          (a, b) => sortOrder * a.name.localeCompare(b.name),
        );
        break;
      case "velocity":
        allAsteroids = [...allAsteroids].sort(
          (a, b) =>
            sortOrder *
            (Number(
              a.close_approach_data[0].relative_velocity.kilometers_per_hour,
            ) -
              Number(
                b.close_approach_data[0].relative_velocity.kilometers_per_hour,
              )),
        );
        break;
      case "diameter":
        allAsteroids = [...allAsteroids].sort(
          (a, b) =>
            sortOrder *
            (Number(a.estimated_diameter.kilometers.estimated_diameter_max) -
              Number(b.estimated_diameter.kilometers.estimated_diameter_max)),
        );
        break;
      case "distance":
        allAsteroids = [...allAsteroids].sort(
          (a, b) =>
            sortOrder *
            (Number(a.close_approach_data[0].miss_distance.kilometers) -
              Number(b.close_approach_data[0].miss_distance.kilometers)),
        );
        break;
      case "date":
        allAsteroids = [...allAsteroids].sort(
          (a, b) =>
            sortOrder *
            (new Date(a.approachDate).getTime() -
              new Date(b.approachDate).getTime()),
        );
        break;
      default:
        break;
    }

    return allAsteroids;
  }, [neo, props.displayFilters, sortBy, sortOrder]);

  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortOrder((prev) => prev * -1);
    } else {
      setSortOrder(1);
      setSortBy(columnName);
    }
  };

  return (
    <table className="asteroids-table">
      <thead>
        <tr>
          {TABLE_COLUMNS.map((col) => {
            const isActive = col.id === sortBy;
            const sortOrderStr = sortOrder === 1 ? "asc" : "desc";

            return (
              <th scope="col" key={col.id}>
                <button
                  className="th-button"
                  onClick={() => handleSort(col.id)}
                >
                  {col.label}
                  {isActive && (
                    <img
                      src="/sort_arrow.svg"
                      className={`sort-arrow-${sortOrderStr}`}
                      alt=""
                    />
                  )}
                </button>
              </th>
            );
          })}
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
