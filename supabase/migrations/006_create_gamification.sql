-- MenuMate Database Migration
-- Migration: 006_create_gamification
-- Description: Create user_gamification and point_transactions tables
-- Dependencies: 002_create_profiles

-- ============================================
-- USER GAMIFICATION TABLE
-- ============================================

CREATE TABLE public.user_gamification (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles (1:1 relationship)
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Points and level
    total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 10),
    
    -- Streak tracking
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_activity_date DATE,
    
    -- Timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- POINT TRANSACTIONS TABLE
-- ============================================

CREATE TABLE public.point_transactions (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key to profiles
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Transaction data
    points INTEGER NOT NULL, -- Can be negative for decay
    reason point_reason_enum NOT NULL,
    description TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for user gamification lookup
CREATE INDEX idx_user_gamification_user 
    ON public.user_gamification(user_id);

-- Index for point transaction history
CREATE INDEX idx_point_transactions_user_date 
    ON public.point_transactions(user_id, created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_user_gamification_updated_at
    BEFORE UPDATE ON public.user_gamification
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE GAMIFICATION ON PROFILE CREATE
-- ============================================

-- Modify handle_new_user to also create gamification record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    
    -- Create gamification record
    INSERT INTO public.user_gamification (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY - USER GAMIFICATION
-- ============================================

ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Users can only view their own gamification data
CREATE POLICY "Users can view own gamification"
    ON public.user_gamification
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own gamification data
CREATE POLICY "Users can update own gamification"
    ON public.user_gamification
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- System inserts gamification records (via trigger)
-- No direct INSERT policy needed for users

-- ============================================
-- ROW LEVEL SECURITY - POINT TRANSACTIONS
-- ============================================

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own point transactions
CREATE POLICY "Users can view own point transactions"
    ON public.point_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own point transactions
CREATE POLICY "Users can insert own point transactions"
    ON public.point_transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Point transactions are immutable (no UPDATE/DELETE policies)
