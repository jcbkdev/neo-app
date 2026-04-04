import "./style.css";
import { useMemo } from "react";
import type { NeoHookResponse, NeoResponse } from "../../hooks/useNeo";
import NeoActivity from "../neoActivity/neoActivity";

interface Props {
  neoResponse: NeoHookResponse;
}

export default function Analytics(props: Props) {
  if (!props.neoResponse) return;
  if (!props.neoResponse.data) return;

  const neo = props.neoResponse.data;

  const parseData = (data: NeoResponse) => {
    const asteroids = Object.entries(data.near_earth_objects).flatMap(
      ([date, asteroids]) =>
        asteroids.map((asteroid) => {
          return {
            asteroid: asteroid,
            date: new Date(date),
          };
        }),
    );

    return asteroids;
  };

  const data = useMemo(() => parseData(neo), [neo]);

  return (
    <div className="analytics">
      <h2 className="analytics-title">Analytics</h2>
      <div className="analytics-container">
        <NeoActivity asteroids={data} />
      </div>
    </div>
  );
}
