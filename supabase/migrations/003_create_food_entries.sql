-- MenuMate Database Migration
-- Migration: 003_create_food_entries
-- Description: Create food_entries table for daily food journal
-- Dependencies: 002_create_profiles

-- ============================================
-- FOOD ENTRIES TABLE
-- ============================================

CREATE TABLE public.food_entries (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Entry date and meal type
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type meal_type_enum NOT NULL,
    
    -- Food information
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0 AND calories <= 10000),
    
    -- Macronutrients (optional)
    protein_g NUMERIC(6,2) CHECK (protein_g IS NULL OR (protein_g >= 0 AND protein_g <= 1000)),
    carbs_g NUMERIC(6,2) CHECK (carbs_g IS NULL OR (carbs_g >= 0 AND carbs_g <= 1000)),
    fat_g NUMERIC(6,2) CHECK (fat_g IS NULL OR (fat_g >= 0 AND fat_g <= 1000)),
    
    -- Portion information
    portion_size NUMERIC(8,2) NOT NULL DEFAULT 100 CHECK (portion_size > 0 AND portion_size <= 10000),
    portion_unit TEXT NOT NULL DEFAULT 'g',
    
    -- Data source
    source food_source_enum NOT NULL DEFAULT 'manual',
    
    -- Optional metadata
    image_url TEXT,
    barcode TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for daily queries (most common query pattern)
CREATE INDEX idx_food_entries_user_date 
    ON public.food_entries(user_id, date DESC);

-- Index for meal grouping
CREATE INDEX idx_food_entries_user_date_meal 
    ON public.food_entries(user_id, date, meal_type);

-- Index for barcode lookups
CREATE INDEX idx_food_entries_barcode 
    ON public.food_entries(barcode) 
    WHERE barcode IS NOT NULL;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;

-- Users can only view their own entries
CREATE POLICY "Users can view own food entries"
    ON public.food_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own food entries"
    ON public.food_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own food entries"
    ON public.food_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own food entries"
    ON public.food_entries
    FOR DELETE
    USING (auth.uid() = user_id);
