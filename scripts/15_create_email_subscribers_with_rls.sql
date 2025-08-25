-- Create email_subscribers table based on mentor_profiles structure
CREATE TABLE IF NOT EXISTS public.email_subscribers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    
    -- Industry preferences (boolean columns)
    academia_research BOOLEAN DEFAULT FALSE,
    banking_finance BOOLEAN DEFAULT FALSE,
    climate_science BOOLEAN DEFAULT FALSE,
    energy_renewables BOOLEAN DEFAULT FALSE,
    geospatial_gis BOOLEAN DEFAULT FALSE,
    geophysics_geology BOOLEAN DEFAULT FALSE,
    insurance_reinsurance BOOLEAN DEFAULT FALSE,
    tech_data_science BOOLEAN DEFAULT FALSE,
    weather_meteorology BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON public.email_subscribers
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public reads (for admin access)
CREATE POLICY "Allow public reads" ON public.email_subscribers
    FOR SELECT USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_frequency ON public.email_subscribers(frequency);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_created_at ON public.email_subscribers(created_at);
