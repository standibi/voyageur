/* eslint-disable react-hooks/set-state-in-effect */


import { useState, useEffect } from "react";
import { Trip } from "@/types";
import { tripsService } from "@/services/trips";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrips = async () => {
    setIsLoading(true);
    const { data } = await tripsService.getAll();
    setTrips(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    isLoading,
    fetchTrips
  };
}
