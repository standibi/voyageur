import { createClient } from "@/utils/supabase/client";

export const expensesService = {
  getByCityIds: async (cityIds: string[]) => {
    const supabase = createClient();
    return await supabase.from('expenses').select('*').in('city_id', cityIds);
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('expenses').insert(data);
  },
  updateByHotelId: async (hotelId: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('expenses').update(data).eq('related_hotel_id', hotelId);
  },
  updateByActivityId: async (activityId: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('expenses').update(data).eq('related_activity_id', activityId);
  },
  deleteByActivityId: async (activityId: string) => {
    const supabase = createClient();
    return await supabase.from('expenses').delete().eq('related_activity_id', activityId);
  }
};
