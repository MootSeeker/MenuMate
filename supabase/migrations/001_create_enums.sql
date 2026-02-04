-- MenuMate Database Migration
-- Migration: 001_create_enums
-- Description: Create all enum types for the MenuMate database
-- Run this first before creating any tables

-- ============================================
-- ENUM TYPES
-- ============================================

-- Gender enum for BMR calculation
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'diverse');

-- Activity level for TDEE calculation
CREATE TYPE activity_level_enum AS ENUM (
    'sedentary',        -- 1.2 - Little or no exercise
    'lightly_active',   -- 1.375 - Light exercise 1-3 days/week
    'moderately_active', -- 1.55 - Moderate exercise 3-5 days/week
    'very_active',      -- 1.725 - Intense exercise 6-7 days/week
    'extremely_active'  -- 1.9 - Very intense exercise, physical labor
);

-- Weight/fitness goal
CREATE TYPE goal_enum AS ENUM (
    'lose',     -- TDEE - 500 kcal
    'maintain', -- TDEE
    'gain'      -- TDEE + 300 kcal
);

-- Meal type for food entries
CREATE TYPE meal_type_enum AS ENUM (
    'breakfast',
    'lunch',
    'dinner',
    'snack'
);

-- Source of food data
CREATE TYPE food_source_enum AS ENUM (
    'manual',        -- Manually entered
    'openfoodfacts', -- From OpenFoodFacts API
    'ai_scan',       -- AI recognition (Gemini)
    'custom'         -- From user's custom foods
);

-- Reason for point transaction
CREATE TYPE point_reason_enum AS ENUM (
    'meal_logged',   -- +5 points
    'goal_reached',  -- +20 points
    'streak_bonus',  -- +50/100/500 points
    'weight_logged', -- +10 points
    'decay'          -- -5 points per day of inactivity
);
