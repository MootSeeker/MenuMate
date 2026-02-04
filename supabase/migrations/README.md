# Supabase Migrations

This folder contains SQL migrations for the MenuMate database.

## Migration Files

| File | Description |
|------|-------------|
| `000_full_migration.sql` | **Complete migration** - Run this single file in Supabase SQL Editor |
| `001_create_enums.sql` | Enum types (gender, activity_level, goal, meal_type, etc.) |
| `002_create_profiles.sql` | Profiles table with RLS and auto-create trigger |
| `003_create_food_entries.sql` | Food entries (journal) table |
| `004_create_custom_foods.sql` | User's custom foods table |
| `005_create_weight_logs.sql` | Weight tracking table |
| `006_create_gamification.sql` | Gamification tables (points, levels, streaks) |
| `007_create_functions.sql` | Helper functions for stats calculation |

## How to Apply Migrations

### Option 1: Full Migration (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `000_full_migration.sql`
5. Paste into the editor
6. Click **Run**

### Option 2: Individual Migrations

Run migrations in order (001 → 007) if you need more control:

```bash
# In Supabase SQL Editor, run each file in sequence
001_create_enums.sql
002_create_profiles.sql
003_create_food_entries.sql
004_create_custom_foods.sql
005_create_weight_logs.sql
006_create_gamification.sql
007_create_functions.sql
```

## Verification

After running migrations, verify with:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected output:
-- custom_foods
-- food_entries
-- point_transactions
-- profiles
-- user_gamification
-- weight_logs
```

## Tables Overview

```
┌─────────────────────┐
│    auth.users       │ (Supabase managed)
└─────────┬───────────┘
          │ 1:1 (auto-created)
          ▼
┌─────────────────────┐
│     profiles        │
└─────────┬───────────┘
          │ 1:n
          ├─────────────────┬─────────────────┬─────────────────┐
          ▼                 ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  food_entries   │ │  custom_foods   │ │  weight_logs    │ │user_gamification│
└─────────────────┘ └─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                                     │ 1:n
                                                                     ▼
                                                          ┌─────────────────────┐
                                                          │ point_transactions  │
                                                          └─────────────────────┘
```

## Security

All tables have **Row Level Security (RLS)** enabled:
- Users can only access their own data
- Cascading deletes when user is removed
- Auto-creation of profile and gamification on signup

## Functions

| Function | Description |
|----------|-------------|
| `calculate_daily_stats(user_id, date)` | Get daily nutritional totals |
| `calculate_level(points)` | Calculate level from points |
| `add_points(user_id, points, reason)` | Award/deduct points |
| `update_streak(user_id, date)` | Update activity streak |
