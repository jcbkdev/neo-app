import { useEffect, useState } from "react";
import axios from "axios";
import { isDateRangeValid } from "../utils/isDateRangeValid";
import { formatDate } from "../utils/formatDate";

export interface NeoHookResponse {
  data: NeoResponse | undefined;
  isLoading: boolean;
  error: any;
  message?: string;
}

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

export function useNeo(
  start_date: Date | undefined,
  end_date: Date | undefined,
): NeoHookResponse {
  const [neoData, setNeoData] = useState<NeoResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setNeoData(undefined);
    setMessage(undefined);
    setError(null);

    if (!start_date || !end_date) {
      setMessage("Set date range");
      return;
    }

    if (start_date > end_date) {
      setMessage("Start date must not be past end date");
      setError(new Error("start_date must not be past end_date"));
      return;
    }

    if (!isDateRangeValid(start_date, end_date, 7)) {
      setMessage(
        "Time difference between start date and end date must not exceed 7 days",
      );
      setError(
        new Error(
          "time difference between start_date and end_date must not exceed 7 days",
        ),
      );
      return;
    }

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
  }, [start_date, end_date]);

  return { data: neoData, isLoading, error, message };
}
