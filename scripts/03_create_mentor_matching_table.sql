-- Create mentor matching table
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_type VARCHAR(20) NOT NULL CHECK (profile_type IN ('mentor', 'mentee')),
  
  -- Basic info
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  industries TEXT[] NOT NULL DEFAULT '{}',
  experience_level VARCHAR(50) NOT NULL,
  current_role VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  
  -- Mentor-specific fields
  years_experience INTEGER,
  expertise_areas TEXT[],
  mentoring_capacity INTEGER DEFAULT 1,
  
  -- Mentee-specific fields
  career_goals TEXT,
  specific_interests TEXT[],
  preferred_mentor_level VARCHAR(50),
  
  -- Common fields
  bio TEXT,
  linkedin_profile VARCHAR(255),
  availability VARCHAR(100),
  communication_preference VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create mentor-mentee matches table
CREATE TABLE IF NOT EXISTS mentor_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES mentor_profiles(id),
  mentee_id UUID REFERENCES mentor_profiles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'completed', 'cancelled')),
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_type ON mentor_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_email ON mentor_profiles(email);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_industries ON mentor_profiles USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_mentor_matches_status ON mentor_matches(status);

-- Enable Row Level Security
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_matches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public inserts" ON mentor_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public reads" ON mentor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" ON mentor_matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public reads" ON mentor_matches
  FOR SELECT USING (true);
