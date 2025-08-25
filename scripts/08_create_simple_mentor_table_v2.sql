-- Drop existing table and create simple mentor table with individual columns
DROP TABLE IF EXISTS mentor_profiles;

CREATE TABLE mentor_profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role_type TEXT NOT NULL, -- 'mentor' or 'mentee'
    bio TEXT,
    -- Individual columns for each industry
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

-- Enable RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public inserts" ON mentor_profiles FOR INSERT WITH CHECK (true);
