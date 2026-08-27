/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { CityData, Trip } from "@/types";
import { tripsService } from "@/services/trips";
import { citiesService } from "@/services/cities";
import { hotelsService } from "@/services/hotels";
import { activitiesService } from "@/services/activities";
import { expensesService } from "@/services/expenses";
import { checklistService } from "@/services/checklist";
import { transformTripData } from "@/utils/transformers";

export function useTripData(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripData, setTripData] = useState<Record<string, CityData>>({});
  const [currentCityId, setCurrentCityId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (preserveCityId = false) => {
    setIsLoading(true);
    
    // Fetch the trip metadata
    const { data: tripMeta } = await tripsService.getById(tripId);
    if (tripMeta) setTrip(tripMeta);

    const { data: cities } = await citiesService.getByTripId(tripId);
    
    if (!cities || cities.length === 0) {
      setTripData({});
      setCurrentCityId(null);
      setChecklist([]);
      setIsLoading(false);
      return;
    }

    const cityIds = cities.map((c: any) => c.id);
    const { data: hotels } = await hotelsService.getByCityIds(cityIds);
    const { data: activities } = await activitiesService.getByCityIds(cityIds);
    const { data: expenses } = await expensesService.getByCityIds(cityIds);
    const { data: checklistItems } = await checklistService.getByTripId(tripId);

    if (checklistItems) setChecklist(checklistItems);

    const formattedData = transformTripData(
      cities,
      hotels || [],
      activities || [],
      expenses || []
    );

    setTripData(formattedData);
    
    // Only update currentCityId if we are not preserving it, or if it's currently null
    if (!preserveCityId || !currentCityId || !formattedData[currentCityId]) {
      // Automatically select the first city on desktop screens (>= 768px)
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        setCurrentCityId(cities[0].id);
      } else {
        setCurrentCityId(null);
      }
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (tripId) fetchData();
  }, [tripId]);

  return {
    trip,
    tripData,
    currentCityId,
    setCurrentCityId,
    checklist,
    isLoading,
    fetchData
  };
}
