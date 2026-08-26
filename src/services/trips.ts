import { createClient } from "@/utils/supabase/client";
import { Trip } from "@/types";

export const tripsService = {
  getAll: async () => {
    const supabase = createClient();
    return await supabase.from('trips').select('*').order('created_at', { ascending: true });
  },
  getById: async (id: string) => {
    const supabase = createClient();
    return await supabase.from('trips').select('*').eq('id', id).single();
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('trips').insert(data);
  },
  update: async (id: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('trips').update(data).eq('id', id);
  },
  delete: async (id: string) => {
    const supabase = createClient();
    return await supabase.from('trips').delete().eq('id', id);
  }
};
