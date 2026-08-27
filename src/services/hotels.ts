/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";

export const hotelsService = {
  getByCityIds: async (cityIds: string[]) => {
    const supabase = createClient();
    return await supabase.from('hotels').select('*').in('city_id', cityIds);
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('hotels').insert(data).select().single();
  },
  update: async (id: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('hotels').update(data).eq('id', id);
  }
};
