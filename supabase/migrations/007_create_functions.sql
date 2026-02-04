-- MenuMate Database Migration
-- Migration: 007_create_functions
-- Description: Create database helper functions
-- Dependencies: All tables must exist

-- ============================================
-- DAILY STATS CALCULATION
-- ============================================

-- Calculate daily nutritional totals for a user
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
        COALESCE(SUM(fe.calories), 0)::INTEGER AS total_calories,
        COALESCE(SUM(fe.protein_g), 0) AS total_protein,
        COALESCE(SUM(fe.carbs_g), 0) AS total_carbs,
        COALESCE(SUM(fe.fat_g), 0) AS total_fat,
        COUNT(*)::INTEGER AS entry_count
    FROM public.food_entries fe
    WHERE fe.user_id = p_user_id AND fe.date = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MEAL STATS CALCULATION
-- ============================================

-- Calculate stats per meal type for a specific date
CREATE OR REPLACE FUNCTION calculate_meal_stats(p_user_id UUID, p_date DATE)
RETURNS TABLE (
    meal_type meal_type_enum,
    total_calories INTEGER,
    total_protein NUMERIC,
    total_carbs NUMERIC,
    total_fat NUMERIC,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fe.meal_type,
        COALESCE(SUM(fe.calories), 0)::INTEGER AS total_calories,
        COALESCE(SUM(fe.protein_g), 0) AS total_protein,
        COALESCE(SUM(fe.carbs_g), 0) AS total_carbs,
        COALESCE(SUM(fe.fat_g), 0) AS total_fat,
        COUNT(*)::INTEGER AS entry_count
    FROM public.food_entries fe
    WHERE fe.user_id = p_user_id AND fe.date = p_date
    GROUP BY fe.meal_type
    ORDER BY 
        CASE fe.meal_type
            WHEN 'breakfast' THEN 1
            WHEN 'lunch' THEN 2
            WHEN 'dinner' THEN 3
            WHEN 'snack' THEN 4
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- LEVEL CALCULATION
-- ============================================

-- Calculate level based on total points
CREATE OR REPLACE FUNCTION calculate_level(p_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE
        WHEN p_points >= 10000 THEN 10  -- MenuMate Pro
        WHEN p_points >= 6000 THEN 9    -- Legend
        WHEN p_points >= 4000 THEN 8    -- Champion
        WHEN p_points >= 2500 THEN 7    -- Master
        WHEN p_points >= 1500 THEN 6    -- Expert
        WHEN p_points >= 1000 THEN 5    -- Committed
        WHEN p_points >= 600 THEN 4     -- Dedicated
        WHEN p_points >= 300 THEN 3     -- Regular
        WHEN p_points >= 100 THEN 2     -- Newcomer
        ELSE 1                          -- Beginner
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- ADD POINTS FUNCTION
-- ============================================

-- Add points to a user and update their gamification stats
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
    -- Get current stats
    SELECT total_points, current_level 
    INTO v_current_points, v_current_level
    FROM public.user_gamification
    WHERE user_id = p_user_id;
    
    -- Calculate new values
    v_new_points := GREATEST(0, v_current_points + p_points);
    v_new_level := calculate_level(v_new_points);
    
    -- Insert point transaction
    INSERT INTO public.point_transactions (user_id, points, reason, description)
    VALUES (p_user_id, p_points, p_reason, p_description);
    
    -- Update gamification
    UPDATE public.user_gamification
    SET 
        total_points = v_new_points,
        current_level = v_new_level,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Return results
    new_total_points := v_new_points;
    new_level := v_new_level;
    level_up := v_new_level > v_current_level;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE STREAK FUNCTION
-- ============================================

-- Update user's streak based on activity
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
    -- Get current streak data
    SELECT last_activity_date, current_streak, longest_streak
    INTO v_last_date, v_current_streak, v_longest_streak
    FROM public.user_gamification
    WHERE user_id = p_user_id;
    
    -- Calculate new streak
    IF v_last_date IS NULL OR p_activity_date - v_last_date > 1 THEN
        -- First activity or streak broken
        v_new_streak := 1;
    ELSIF p_activity_date - v_last_date = 1 THEN
        -- Consecutive day
        v_new_streak := v_current_streak + 1;
    ELSIF p_activity_date = v_last_date THEN
        -- Same day, no change
        v_new_streak := v_current_streak;
    ELSE
        -- Activity date is in the past, no change
        v_new_streak := v_current_streak;
    END IF;
    
    -- Update gamification
    UPDATE public.user_gamification
    SET 
        current_streak = v_new_streak,
        longest_streak = GREATEST(longest_streak, v_new_streak),
        last_activity_date = GREATEST(last_activity_date, p_activity_date),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Return results
    new_streak := v_new_streak;
    is_new_record := v_new_streak > v_longest_streak;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GET USER STATS FUNCTION
-- ============================================

-- Get complete user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_points INTEGER,
    current_level INTEGER,
    current_streak INTEGER,
    longest_streak INTEGER,
    total_entries BIGINT,
    total_days_logged BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ug.total_points,
        ug.current_level,
        ug.current_streak,
        ug.longest_streak,
        (SELECT COUNT(*) FROM public.food_entries WHERE user_id = p_user_id) AS total_entries,
        (SELECT COUNT(DISTINCT date) FROM public.food_entries WHERE user_id = p_user_id) AS total_days_logged
    FROM public.user_gamification ug
    WHERE ug.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- WEIGHT PROGRESS FUNCTION
-- ============================================

-- Get weight progress for a user
CREATE OR REPLACE FUNCTION get_weight_progress(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    weight_kg NUMERIC,
    change_from_previous NUMERIC,
    change_from_start NUMERIC
) AS $$
DECLARE
    v_start_weight NUMERIC;
BEGIN
    -- Get the starting weight (first entry in range)
    SELECT wl.weight_kg INTO v_start_weight
    FROM public.weight_logs wl
    WHERE wl.user_id = p_user_id
      AND wl.date >= CURRENT_DATE - p_days
    ORDER BY wl.date ASC
    LIMIT 1;
    
    RETURN QUERY
    SELECT
        wl.date,
        wl.weight_kg,
        wl.weight_kg - LAG(wl.weight_kg) OVER (ORDER BY wl.date) AS change_from_previous,
        wl.weight_kg - v_start_weight AS change_from_start
    FROM public.weight_logs wl
    WHERE wl.user_id = p_user_id
      AND wl.date >= CURRENT_DATE - p_days
    ORDER BY wl.date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
