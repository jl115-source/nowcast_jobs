-- Create off-market job signups table
CREATE TABLE IF NOT EXISTS off_market_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('talent', 'recruiter')),
  
  -- Common fields
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  industries TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Talent-specific fields
  experience_level VARCHAR(50),
  current_role VARCHAR(255),
  skills TEXT[],
  location VARCHAR(255),
  remote_preference VARCHAR(20),
  salary_expectation VARCHAR(100),
  
  -- Recruiter-specific fields
  company_name VARCHAR(255),
  company_size VARCHAR(50),
  website VARCHAR(255),
  linkedin_profile VARCHAR(255),
  typical_roles TEXT[],
  hiring_volume VARCHAR(50)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_off_market_user_type ON off_market_signups(user_type);
CREATE INDEX IF NOT EXISTS idx_off_market_email ON off_market_signups(email);
CREATE INDEX IF NOT EXISTS idx_off_market_industries ON off_market_signups USING GIN(industries);

-- Enable Row Level Security
ALTER TABLE off_market_signups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public inserts" ON off_market_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public reads" ON off_market_signups
  FOR SELECT USING (true);
