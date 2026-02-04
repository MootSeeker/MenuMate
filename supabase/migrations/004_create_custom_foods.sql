-- MenuMate Database Migration
-- Migration: 004_create_custom_foods
-- Description: Create custom_foods table for user-created food items
-- Dependencies: 002_create_profiles

-- ============================================
-- CUSTOM FOODS TABLE
-- ============================================

CREATE TABLE public.custom_foods (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Food information
    name TEXT NOT NULL,
    brand TEXT,
    
    -- Nutritional values per 100g/ml
    calories_per_100g INTEGER NOT NULL CHECK (calories_per_100g >= 0 AND calories_per_100g <= 1000),
    protein_per_100g NUMERIC(6,2) CHECK (protein_per_100g IS NULL OR (protein_per_100g >= 0 AND protein_per_100g <= 100)),
    carbs_per_100g NUMERIC(6,2) CHECK (carbs_per_100g IS NULL OR (carbs_per_100g >= 0 AND carbs_per_100g <= 100)),
    fat_per_100g NUMERIC(6,2) CHECK (fat_per_100g IS NULL OR (fat_per_100g >= 0 AND fat_per_100g <= 100)),
    
    -- Default portion
    default_portion_size NUMERIC(8,2) DEFAULT 100 CHECK (default_portion_size IS NULL OR (default_portion_size > 0 AND default_portion_size <= 10000)),
    default_portion_unit TEXT DEFAULT 'g',
    
    -- Optional barcode
    barcode TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for user's food list
CREATE INDEX idx_custom_foods_user 
    ON public.custom_foods(user_id);

-- Index for search by name
CREATE INDEX idx_custom_foods_user_name 
    ON public.custom_foods(user_id, name);

-- Unique constraint: one barcode per user
CREATE UNIQUE INDEX idx_custom_foods_user_barcode 
    ON public.custom_foods(user_id, barcode) 
    WHERE barcode IS NOT NULL;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_custom_foods_updated_at
    BEFORE UPDATE ON public.custom_foods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.custom_foods ENABLE ROW LEVEL SECURITY;

-- Users can only view their own custom foods
CREATE POLICY "Users can view own custom foods"
    ON public.custom_foods
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own custom foods
CREATE POLICY "Users can insert own custom foods"
    ON public.custom_foods
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own custom foods
CREATE POLICY "Users can update own custom foods"
    ON public.custom_foods
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own custom foods
CREATE POLICY "Users can delete own custom foods"
    ON public.custom_foods
    FOR DELETE
    USING (auth.uid() = user_id);
