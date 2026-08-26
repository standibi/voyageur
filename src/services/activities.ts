import { createClient } from "@/utils/supabase/client";

export const activitiesService = {
  getByCityIds: async (cityIds: string[]) => {
    const supabase = createClient();
    return await supabase.from('activities').select('*').in('city_id', cityIds).order('sort_order', { ascending: true });
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('activities').insert(data).select().single();
  },
  update: async (id: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('activities').update(data).eq('id', id);
  },
  delete: async (id: string) => {
    const supabase = createClient();
    return await supabase.from('activities').delete().eq('id', id);
  }
};
