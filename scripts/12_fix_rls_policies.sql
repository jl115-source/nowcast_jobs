-- Fix Row Level Security policies to allow public inserts for all form tables

-- Allow public inserts to contact_submissions table
DROP POLICY IF EXISTS "Allow public contact submissions" ON contact_submissions;
CREATE POLICY "Allow public contact submissions" ON contact_submissions
FOR INSERT WITH CHECK (true);

-- Allow public inserts to mentor_profiles table  
DROP POLICY IF EXISTS "Allow public mentor signups" ON mentor_profiles;
CREATE POLICY "Allow public mentor signups" ON mentor_profiles
FOR INSERT WITH CHECK (true);

-- Allow public inserts to email_subscribers table
DROP POLICY IF EXISTS "Allow public email subscriptions" ON email_subscribers;
CREATE POLICY "Allow public email subscriptions" ON email_subscribers
FOR INSERT WITH CHECK (true);

-- Allow public inserts to off_market_signups table
DROP POLICY IF EXISTS "Allow public off market signups" ON off_market_signups;
CREATE POLICY "Allow public off market signups" ON off_market_signups
FOR INSERT WITH CHECK (true);

-- Allow public reads for all tables (optional, for admin access)
DROP POLICY IF EXISTS "Allow public reads on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public reads on contact_submissions" ON contact_submissions
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on mentor_profiles" ON mentor_profiles;
CREATE POLICY "Allow public reads on mentor_profiles" ON mentor_profiles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on email_subscribers" ON email_subscribers;
CREATE POLICY "Allow public reads on email_subscribers" ON email_subscribers
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public reads on off_market_signups" ON off_market_signups;
CREATE POLICY "Allow public reads on off_market_signups" ON off_market_signups
FOR SELECT USING (true);
