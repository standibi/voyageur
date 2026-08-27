# Supabase Project Details

- **Name:** Voyageur
- **Project Ref / ID:** kzlbrcbnddyocbpmqlic
- **Organization:** StanCorp (mlgboldevedusqymuqfd)
- **Region:** eu-west-3 (Paris)

## Proposed Database Schema (To be implemented later)

1. **`trips`**:
   - `id` (uuid)
   - `name` (text)
   - `created_at` (timestamp)

2. **`cities`**:
   - `id` (uuid)
   - `trip_id` (uuid)
   - `name` (text)
   - `dates` (text)
   - `nights` (int)
   - `budget` (numeric)
   - `img_url` (text)

3. **`hotels`**:
   - `id` (uuid)
   - `city_id` (uuid)
   - `name` (text)
   - `stars` (int)
   - `address` (text)
   - `price_total` (numeric)
   - `img_url` (text)
   - `check_in` (text)
   - `check_out` (text)

4. **`activities`**:
   - `id` (uuid)
   - `city_id` (uuid)
   - `day_title` (text)
   - `date` (text)
   - `time` (text)
   - `name` (text)
   - `description` (text)
   - `price` (numeric)
   - `icon_name` (text)
   - `color_class` (text)
   - `bg_class` (text)
