-- Add specific RLS policies for email_subscribers table to match working off_market_signups structure

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON email_subscribers;
DROP POLICY IF EXISTS "Allow public reads" ON email_subscribers;
DROP POLICY IF EXISTS "Allow public email signups" ON email_subscribers;
DROP POLICY IF EXISTS "Allow public reads on email_subscribers" ON email_subscribers;

-- Create specific policies matching the working off_market_signups table
CREATE POLICY "Allow public inserts" ON email_subscribers
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public email signups" ON email_subscribers
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public reads" ON email_subscribers
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow public reads on email_subscribers" ON email_subscribers
    FOR SELECT TO public
    USING (true);

-- Ensure RLS is enabled
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
