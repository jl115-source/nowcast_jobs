-- Add missing columns to off_market_signups table for new industries
ALTER TABLE off_market_signups 
ADD COLUMN IF NOT EXISTS post_doc BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS professor BOOLEAN DEFAULT FALSE;

-- Update existing records to set default values
UPDATE off_market_signups 
SET post_doc = FALSE, professor = FALSE 
WHERE post_doc IS NULL OR professor IS NULL;
