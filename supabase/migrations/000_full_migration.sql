-- MenuMate Database Migration
-- Master migration file - Run all migrations in order
-- This file combines all migrations for easy execution in Supabase SQL Editor

-- ============================================
-- IMPORTANT: Run this file in the Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- ############################################
-- MIGRATION 001: CREATE ENUM TYPES
-- ############################################

-- Gender enum for BMR calculation
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'diverse');

-- Activity level for TDEE calculation
CREATE TYPE activity_level_enum AS ENUM (
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active'
);

-- Weight/fitness goal
CREATE TYPE goal_enum AS ENUM ('lose', 'maintain', 'gain');

-- Meal type for food entries
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Source of food data
CREATE TYPE food_source_enum AS ENUM ('manual', 'openfoodfacts', 'ai_scan', 'custom');

-- Reason for point transaction
CREATE TYPE point_reason_enum AS ENUM ('meal_logged', 'goal_reached', 'streak_bonus', 'weight_logged', 'decay');


-- ############################################
-- MIGRATION 002: CREATE PROFILES TABLE
-- ############################################

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    gender gender_enum,
    birth_date DATE,
    height_cm INTEGER CHECK (height_cm IS NULL OR (height_cm >= 100 AND height_cm <= 250)),
    activity_level activity_level_enum,
    goal goal_enum,
    daily_calorie_goal INTEGER CHECK (daily_calorie_goal IS NULL OR (daily_calorie_goal >= 500 AND daily_calorie_goal <= 10000)),
    protein_goal_g INTEGER CHECK (protein_goal_g IS NULL OR (protein_goal_g >= 0 AND protein_goal_g <= 500)),
    carbs_goal_g INTEGER CHECK (carbs_goal_g IS NULL OR (carbs_goal_g >= 0 AND carbs_goal_g <= 1000)),
    fat_goal_g INTEGER CHECK (fat_goal_g IS NULL OR (fat_goal_g >= 0 AND fat_goal_g <= 500)),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);


-- ############################################
-- MIGRATION 003: CREATE FOOD ENTRIES TABLE
-- ############################################

CREATE TABLE public.food_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type meal_type_enum NOT NULL,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0 AND calories <= 10000),
    protein_g NUMERIC(6,2) CHECK (protein_g IS NULL OR (protein_g >= 0 AND protein_g <= 1000)),
    carbs_g NUMERIC(6,2) CHECK (carbs_g IS NULL OR (carbs_g >= 0 AND carbs_g <= 1000)),
    fat_g NUMERIC(6,2) CHECK (fat_g IS NULL OR (fat_g >= 0 AND fat_g <= 1000)),
    portion_size NUMERIC(8,2) NOT NULL DEFAULT 100 CHECK (portion_size > 0 AND portion_size <= 10000),
    portion_unit TEXT NOT NULL DEFAULT 'g',
    source food_source_enum NOT NULL DEFAULT 'manual',
    image_url TEXT,
    barcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_food_entries_user_date ON public.food_entries(user_id, date DESC);
CREATE INDEX idx_food_entries_user_date_meal ON public.food_entries(user_id, date, meal_type);
CREATE INDEX idx_food_entries_barcode ON public.food_entries(barcode) WHERE barcode IS NOT NULL;

ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food entries" ON public.food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries" ON public.food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries" ON public.food_entries
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries" ON public.food_entries
    FOR DELETE USING (auth.uid() = user_id);


-- ############################################
-- MIGRATION 004: CREATE CUSTOM FOODS TABLE
-- ############################################

CREATE TABLE public.custom_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    calories_per_100g INTEGER NOT NULL CHECK (calories_per_100g >= 0 AND calories_per_100g <= 1000),
    protein_per_100g NUMERIC(6,2) CHECK (protein_per_100g IS NULL OR (protein_per_100g >= 0 AND protein_per_100g <= 100)),
    carbs_per_100g NUMERIC(6,2) CHECK (carbs_per_100g IS NULL OR (carbs_per_100g >= 0 AND carbs_per_100g <= 100)),
    fat_per_100g NUMERIC(6,2) CHECK (fat_per_100g IS NULL OR (fat_per_100g >= 0 AND fat_per_100g <= 100)),
    default_portion_size NUMERIC(8,2) DEFAULT 100 CHECK (default_portion_size IS NULL OR (default_portion_size > 0 AND default_portion_size <= 10000)),
    default_portion_unit TEXT DEFAULT 'g',
    barcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_foods_user ON public.custom_foods(user_id);
CREATE INDEX idx_custom_foods_user_name ON public.custom_foods(user_id, name);
CREATE UNIQUE INDEX idx_custom_foods_user_barcode ON public.custom_foods(user_id, barcode) WHERE barcode IS NOT NULL;

CREATE TRIGGER update_custom_foods_updated_at
    BEFORE UPDATE ON public.custom_foods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.custom_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custom foods" ON public.custom_foods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom foods" ON public.custom_foods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom foods" ON public.custom_foods
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom foods" ON public.custom_foods
    FOR DELETE USING (auth.uid() = user_id);


-- ############################################
-- MIGRATION 005: CREATE WEIGHT LOGS TABLE
-- ############################################

CREATE TABLE public.weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg >= 20 AND weight_kg <= 500),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_weight_per_day UNIQUE (user_id, date)
);

CREATE INDEX idx_weight_logs_user_date ON public.weight_logs(user_id, date DESC);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight logs" ON public.weight_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" ON public.weight_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs" ON public.weight_logs
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs" ON public.weight_logs
    FOR DELETE USING (auth.uid() = user_id);


-- ############################################
-- MIGRATION 006: CREATE GAMIFICATION TABLES
-- ############################################

CREATE TABLE public.user_gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 10),
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_activity_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason point_reason_enum NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_gamification_user ON public.user_gamification(user_id);
CREATE INDEX idx_point_transactions_user_date ON public.point_transactions(user_id, created_at DESC);

CREATE TRIGGER update_user_gamification_updated_at
    BEFORE UPDATE ON public.user_gamification
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile and gamification on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id);
    INSERT INTO public.user_gamification (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- RLS for gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification" ON public.user_gamification
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification" ON public.user_gamification
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own point transactions" ON public.point_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own point transactions" ON public.point_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ############################################
-- MIGRATION 007: CREATE HELPER FUNCTIONS
-- ############################################

-- Calculate daily nutritional totals
CREATE OR REPLACE FUNCTION calculate_daily_stats(p_user_id UUID, p_date DATE)
RETURNS TABLE (
    total_calories INTEGER,
    total_protein NUMERIC,
    total_carbs NUMERIC,
    total_fat NUMERIC,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(fe.calories), 0)::INTEGER,
        COALESCE(SUM(fe.protein_g), 0),
        COALESCE(SUM(fe.carbs_g), 0),
        COALESCE(SUM(fe.fat_g), 0),
        COUNT(*)::INTEGER
    FROM public.food_entries fe
    WHERE fe.user_id = p_user_id AND fe.date = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate level from points
CREATE OR REPLACE FUNCTION calculate_level(p_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE
        WHEN p_points >= 10000 THEN 10
        WHEN p_points >= 6000 THEN 9
        WHEN p_points >= 4000 THEN 8
        WHEN p_points >= 2500 THEN 7
        WHEN p_points >= 1500 THEN 6
        WHEN p_points >= 1000 THEN 5
        WHEN p_points >= 600 THEN 4
        WHEN p_points >= 300 THEN 3
        WHEN p_points >= 100 THEN 2
        ELSE 1
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add points to user
CREATE OR REPLACE FUNCTION add_points(
    p_user_id UUID,
    p_points INTEGER,
    p_reason point_reason_enum,
    p_description TEXT DEFAULT NULL
)
RETURNS TABLE (
    new_total_points INTEGER,
    new_level INTEGER,
    level_up BOOLEAN
) AS $$
DECLARE
    v_current_points INTEGER;
    v_current_level INTEGER;
    v_new_points INTEGER;
    v_new_level INTEGER;
BEGIN
    SELECT total_points, current_level INTO v_current_points, v_current_level
    FROM public.user_gamification WHERE user_id = p_user_id;
    
    v_new_points := GREATEST(0, v_current_points + p_points);
    v_new_level := calculate_level(v_new_points);
    
    INSERT INTO public.point_transactions (user_id, points, reason, description)
    VALUES (p_user_id, p_points, p_reason, p_description);
    
    UPDATE public.user_gamification
    SET total_points = v_new_points, current_level = v_new_level, updated_at = NOW()
    WHERE user_id = p_user_id;
    
    new_total_points := v_new_points;
    new_level := v_new_level;
    level_up := v_new_level > v_current_level;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID, p_activity_date DATE)
RETURNS TABLE (
    new_streak INTEGER,
    is_new_record BOOLEAN
) AS $$
DECLARE
    v_last_date DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
    v_new_streak INTEGER;
BEGIN
    SELECT last_activity_date, current_streak, longest_streak
    INTO v_last_date, v_current_streak, v_longest_streak
    FROM public.user_gamification WHERE user_id = p_user_id;
    
    IF v_last_date IS NULL OR p_activity_date - v_last_date > 1 THEN
        v_new_streak := 1;
    ELSIF p_activity_date - v_last_date = 1 THEN
        v_new_streak := v_current_streak + 1;
    ELSE
        v_new_streak := v_current_streak;
    END IF;
    
    UPDATE public.user_gamification
    SET current_streak = v_new_streak,
        longest_streak = GREATEST(longest_streak, v_new_streak),
        last_activity_date = GREATEST(last_activity_date, p_activity_date),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    new_streak := v_new_streak;
    is_new_record := v_new_streak > v_longest_streak;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ############################################
-- MIGRATION COMPLETE
-- ############################################

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
