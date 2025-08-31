-- Add new industry columns to email_subscribers table
ALTER TABLE email_subscribers 
ADD COLUMN IF NOT EXISTS phd boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS professor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trading_commodities_weather_energy boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS postdoc boolean DEFAULT false;

-- Add new industry columns to mentor_profiles table  
ALTER TABLE mentor_profiles
ADD COLUMN IF NOT EXISTS phd boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS professor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trading_commodities_weather_energy boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS postdoc boolean DEFAULT false;

-- Add new industry columns to off_market_signups table
ALTER TABLE off_market_signups
ADD COLUMN IF NOT EXISTS phd boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS professor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trading_commodities_weather_energy boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS postdoc boolean DEFAULT false;
