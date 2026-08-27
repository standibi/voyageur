/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

/**
 * Utility to wrap Supabase (or any) promise-based mutations with automatic toast notifications.
 * 
 * PATTERN DOCUMENTATION:
 * When extracting the service layer, wrap your Supabase calls with `withToast` so that 
 * callers get automatic UI feedback without manual state management.
 * 
 * Example usage:
 * return withToast(
 *   supabase.from('cities').insert(...),
 *   { success: 'City added!', error: 'Failed to add city.' }
 * );
 */
export async function withToast<T>(
  promise: PromiseLike<{ data: T | null; error: any }>,
  messages: { loading?: string; success: string; error: string }
): Promise<{ data: T | null; error: any }> {
  // Convert PromiseLike to a native Promise to satisfy toast.promise
  const wrappedPromise = new Promise<{ data: T | null; error: any }>((resolve, reject) => {
    promise.then((res) => {
      if (res.error) {
        reject(new Error(res.error.message || messages.error));
      } else {
        resolve(res);
      }
    }, reject);
  });

  return toast.promise(wrappedPromise, {
    loading: messages.loading || 'Saving...',
    success: messages.success,
    error: (err: any) => err.message || messages.error,
  });
}
