-- Fix RLS policy for email_subscribers table
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public inserts" ON email_subscribers;

-- Create policy to allow public inserts
CREATE POLICY "Allow public inserts" ON email_subscribers
FOR INSERT 
TO public 
WITH CHECK (true);

-- Grant insert permissions
GRANT INSERT ON email_subscribers TO anon;
GRANT INSERT ON email_subscribers TO authenticated;
