-- Migration: Standardize Daily AI Insights Table
CREATE TABLE IF NOT EXISTS daily_ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_ai_insights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own insights
CREATE POLICY "Users can view their own insights" 
ON daily_ai_insights FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Automation/Service role can do everything (default for service_role)
-- But let's add a specific one if needed for the automation route
CREATE POLICY "Service role can insert insights" 
ON daily_ai_insights FOR INSERT 
WITH CHECK (true); 
