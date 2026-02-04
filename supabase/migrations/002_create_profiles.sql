-- MenuMate Database Migration
-- Migration: 002_create_profiles
-- Description: Create profiles table (1:1 with auth.users)
-- Dependencies: 001_create_enums

-- ============================================
-- PROFILES TABLE
-- ============================================

CREATE TABLE public.profiles (
    -- Primary key, references Supabase auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- User display information
    display_name TEXT,
    
    -- Personal data for TDEE calculation
    gender gender_enum,
    birth_date DATE,
    height_cm INTEGER CHECK (height_cm IS NULL OR (height_cm >= 100 AND height_cm <= 250)),
    
    -- Activity and goals
    activity_level activity_level_enum,
    goal goal_enum,
    
    -- Calorie and macro goals
    daily_calorie_goal INTEGER CHECK (daily_calorie_goal IS NULL OR (daily_calorie_goal >= 500 AND daily_calorie_goal <= 10000)),
    protein_goal_g INTEGER CHECK (protein_goal_g IS NULL OR (protein_goal_g >= 0 AND protein_goal_g <= 500)),
    carbs_goal_g INTEGER CHECK (carbs_goal_g IS NULL OR (carbs_goal_g >= 0 AND carbs_goal_g <= 1000)),
    fat_goal_g INTEGER CHECK (fat_goal_g IS NULL OR (fat_goal_g >= 0 AND fat_goal_g <= 500)),
    
    -- Onboarding status
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- No additional indexes needed for profiles (id is PK)

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
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

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
