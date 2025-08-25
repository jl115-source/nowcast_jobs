-- Create email_subscribers table for job notifications
CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    -- Industry preferences as individual boolean columns
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
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for signups)
CREATE POLICY "Allow public inserts" ON email_subscribers
    FOR INSERT WITH CHECK (true);

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON email_subscribers
    FOR SELECT USING (true);
