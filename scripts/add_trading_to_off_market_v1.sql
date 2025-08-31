-- Add Trading column to off_market_signups table
ALTER TABLE off_market_signups 
ADD COLUMN trading_commodities_weather_energy BOOLEAN DEFAULT FALSE;

-- Update existing records to set default value
UPDATE off_market_signups 
SET trading_commodities_weather_energy = FALSE 
WHERE trading_commodities_weather_energy IS NULL;
