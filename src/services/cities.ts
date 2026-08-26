import { createClient } from "@/utils/supabase/client";

export const citiesService = {
  getByTripId: async (tripId: string) => {
    const supabase = createClient();
    return await supabase.from('cities').select('*').eq('trip_id', tripId).order('created_at', { ascending: true });
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('cities').insert(data).select().single();
  },
  update: async (id: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('cities').update(data).eq('id', id);
  },
  delete: async (id: string) => {
    const supabase = createClient();
    return await supabase.from('cities').delete().eq('id', id);
  }
};
