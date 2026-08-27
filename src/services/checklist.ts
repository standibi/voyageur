/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/client";

export const checklistService = {
  getByTripId: async (tripId: string) => {
    const supabase = createClient();
    return await supabase.from('checklist_items').select('*').eq('trip_id', tripId).order('created_at', { ascending: true });
  },
  create: async (data: any) => {
    const supabase = createClient();
    return await supabase.from('checklist_items').insert(data);
  },
  update: async (id: string, data: any) => {
    const supabase = createClient();
    return await supabase.from('checklist_items').update(data).eq('id', id);
  },
  delete: async (id: string) => {
    const supabase = createClient();
    return await supabase.from('checklist_items').delete().eq('id', id);
  }
};
