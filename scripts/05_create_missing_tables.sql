-- Create off_market_signups table
CREATE TABLE IF NOT EXISTS public.off_market_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('talent', 'recruiter')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    industries TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    experience_level VARCHAR(50),
    location VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    website_url VARCHAR(500),
    company_size VARCHAR(50),
    hiring_volume VARCHAR(50),
    budget_range VARCHAR(100),
    additional_info TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'matched'))
);

-- Create mentor_profiles table
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('mentor', 'mentee')),
    industry VARCHAR(100) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    bio TEXT,
    goals TEXT,
    availability VARCHAR(100),
    preferred_communication VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'matched'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_off_market_signups_type ON public.off_market_signups(type);
CREATE INDEX IF NOT EXISTS idx_off_market_signups_industries ON public.off_market_signups USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_off_market_signups_email ON public.off_market_signups(email);

CREATE INDEX IF NOT EXISTS idx_mentor_profiles_role_type ON public.mentor_profiles(role_type);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_industry ON public.mentor_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_email ON public.mentor_profiles(email);

-- Enable Row Level Security
ALTER TABLE public.off_market_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public signups
CREATE POLICY "Allow public signups for off_market_signups" ON public.off_market_signups
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public signups for mentor_profiles" ON public.mentor_profiles
    FOR INSERT WITH CHECK (true);

-- Allow service role to read all data
CREATE POLICY "Allow service role to read off_market_signups" ON public.off_market_signups
    FOR SELECT USING (true);

CREATE POLICY "Allow service role to read mentor_profiles" ON public.mentor_profiles
    FOR SELECT USING (true);
