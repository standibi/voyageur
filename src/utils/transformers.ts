import { CityData, Hotel, Activity, TimelineDay, ExpenseBreakdown } from "@/types";

export function transformTripData(
  cities: any[],
  hotels: any[],
  activities: any[],
  expenses: any[]
): Record<string, CityData> {
  const formattedData: Record<string, CityData> = {};

  cities.forEach(city => {
    const cityHotels = hotels?.filter(h => h.city_id === city.id) || [];
    const hotel = cityHotels.length > 0 ? cityHotels[0] : { name: 'No Hotel Selected', price_total: 0, stars: 0, address: '', check_in: '', check_out: '', img_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' };
    
    const cityActivities = activities?.filter(a => a.city_id === city.id) || [];
    const cityExpenses = expenses?.filter(e => e.city_id === city.id) || [];

    const timelineMap = new Map();
    cityActivities.forEach(act => {
      const key = `${act.date}|${act.day_title}`;
      if (!timelineMap.has(key)) timelineMap.set(key, { dayTitle: act.day_title, date: act.date, activities: [] });
      timelineMap.get(key).activities.push({ ...act, icon: act.icon_name, color: act.color_class, bg: act.bg_class, desc: act.description });
    });

    const timeline = Array.from(timelineMap.values());
    const breakdown = { stay: 0, act: 0, food: 0, transport: 0, misc: 0, activity: 0 };
    
    cityExpenses.forEach(exp => {
      if (breakdown[exp.category as keyof typeof breakdown] !== undefined) {
        breakdown[exp.category as keyof typeof breakdown] += Number(exp.amount);
      }
    });

    formattedData[city.id] = {
      id: city.id,
      trip_id: city.trip_id,
      name: city.name,
      dates: city.dates,
      nights: city.nights,
      totalBudget: Number(city.allocated_budget),
      img: city.img_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80',
      breakdown,
      hotel,
      timeline,
      rawActivities: cityActivities,
      rawExpenses: cityExpenses
    };
  });

  return formattedData;
}
