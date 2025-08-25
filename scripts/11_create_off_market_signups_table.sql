-- Create off_market_signups table with individual columns for each industry
CREATE TABLE IF NOT EXISTS off_market_signups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('talent', 'recruiter')),
    company TEXT,
    skills TEXT,
    bio TEXT,
    -- Industry columns (boolean for each industry)
    climate_science BOOLEAN DEFAULT FALSE,
    tech_data_science BOOLEAN DEFAULT FALSE,
    energy_renewables BOOLEAN DEFAULT FALSE,
    weather_meteorology BOOLEAN DEFAULT FALSE,
    academia_research BOOLEAN DEFAULT FALSE,
    geospatial_gis BOOLEAN DEFAULT FALSE,
    geophysics_geology BOOLEAN DEFAULT FALSE,
    insurance_reinsurance BOOLEAN DEFAULT FALSE,
    banking_finance BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE off_market_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts
CREATE POLICY "Allow public inserts" ON off_market_signups
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public reads (optional, for admin purposes)
CREATE POLICY "Allow public reads" ON off_market_signups
    FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_off_market_signups_email ON off_market_signups(email);
CREATE INDEX IF NOT EXISTS idx_off_market_signups_type ON off_market_signups(type);
CREATE INDEX IF NOT EXISTS idx_off_market_signups_created_at ON off_market_signups(created_at);
