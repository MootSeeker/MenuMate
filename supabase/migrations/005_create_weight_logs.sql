-- MenuMate Database Migration
-- Migration: 005_create_weight_logs
-- Description: Create weight_logs table for weight tracking
-- Dependencies: 002_create_profiles

-- ============================================
-- WEIGHT LOGS TABLE
-- ============================================

CREATE TABLE public.weight_logs (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Weight data
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg >= 20 AND weight_kg <= 500),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Optional notes
    notes TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: one weight entry per user per day
    CONSTRAINT unique_weight_per_day UNIQUE (user_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for weight history queries
CREATE INDEX idx_weight_logs_user_date 
    ON public.weight_logs(user_id, date DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own weight logs
CREATE POLICY "Users can view own weight logs"
    ON public.weight_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own weight logs
CREATE POLICY "Users can insert own weight logs"
    ON public.weight_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own weight logs
CREATE POLICY "Users can update own weight logs"
    ON public.weight_logs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own weight logs
CREATE POLICY "Users can delete own weight logs"
    ON public.weight_logs
    FOR DELETE
    USING (auth.uid() = user_id);
