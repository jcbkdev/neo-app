import { useEffect, useState } from "react";
import axios from "axios";

export interface NeoResponse {
  links: {
    next: string;
    previous: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: Neo[];
  };
}

export interface Neo {
  links: {
    self: string;
  };
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: EstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproach[];
  is_sentry_object: boolean;
}

interface EstimatedDiameter {
  kilometers: EstimatedDiameterRange;
  meters: EstimatedDiameterRange;
  miles: EstimatedDiameterRange;
  feet: EstimatedDiameterRange;
}

interface EstimatedDiameterRange {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

interface CloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: RealtiveVelocity;
  miss_distance: MissDistance;
  orbiting_body: string;
}

interface RealtiveVelocity {
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;
}

interface MissDistance {
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;
}

function isDateRangeValid(
  date1: Date,
  date2: Date,
  rangeDays: number,
): boolean {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());

  return diffInMs <= MS_PER_DAY * rangeDays;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export function useNeo(start_date: Date, end_date: Date) {
  const [neoData, setNeoData] = useState<NeoResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  if (start_date > end_date)
    throw new Error("start_date must not be past end_date");

  if (!isDateRangeValid(start_date, end_date, 7))
    throw new Error(
      "time difference between start_date and end_date must not exceed 7 days",
    );

  useEffect(() => {
    const controller = new AbortController();

    const fetchNeoData = async () => {
      try {
        setIsLoading(true);

        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}&api_key=${import.meta.env.VITE_API_KEY}`;

        const response = await axios.get(url, {
          signal: controller.signal,
        });

        console.log("data", response.data);
        setNeoData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Canceled");
        } else {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeoData();

    return () => controller.abort();
  }, []);

  return { data: neoData, isLoading, error };
}
