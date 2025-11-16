-- ============================================================================
-- ORB Alerts Table for Supabase
-- Project: aihoazkzytaprtcpgfwx
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor
-- 2. Click "SQL Editor" → "New Query"
-- 3. Copy and paste this entire file
-- 4. Click "Run" (or press F5)
-- 5. You should see: "Success. No rows returned"
--
-- ============================================================================

-- Drop table if it exists (only if you want to start fresh)
-- DROP TABLE IF EXISTS public.orb_alerts CASCADE;

-- Create main alerts table
CREATE TABLE IF NOT EXISTS public.orb_alerts (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_timestamp BIGINT NOT NULL,
    ticker VARCHAR(20) NOT NULL,
    chart_timeframe VARCHAR(10) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    
    -- Price Data
    current_price DECIMAL(12, 4) NOT NULL,
    orb_high DECIMAL(12, 4) NOT NULL,
    orb_low DECIMAL(12, 4) NOT NULL,
    orb_midpoint DECIMAL(12, 4) NOT NULL,
    orb_size DECIMAL(12, 6) NOT NULL,
    orb_size_percent DECIMAL(8, 4),
    
    -- Breakout Metrics
    breakout_distance DECIMAL(12, 6),
    breakout_distance_percent DECIMAL(8, 4),
    
    -- ORB Configuration
    orb_duration_minutes INTEGER NOT NULL,
    session_start VARCHAR(4) NOT NULL,
    
    -- Additional Context
    volume DECIMAL(20, 2),
    breakout_up_occurred BOOLEAN DEFAULT FALSE,
    breakout_down_occurred BOOLEAN DEFAULT FALSE,
    retest_up_confirmed BOOLEAN DEFAULT FALSE,
    retest_down_confirmed BOOLEAN DEFAULT FALSE,
    scanner_symbol_count INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    raw_payload JSONB,
    
    -- Constraints
    CONSTRAINT orb_alerts_event_timestamp_check CHECK (event_timestamp > 0),
    CONSTRAINT orb_alerts_direction_check CHECK (direction IN ('LONG', 'SHORT'))
);

-- ============================================================================
-- INDEXES for Fast Queries
-- ============================================================================

-- Drop existing indexes if recreating
DROP INDEX IF EXISTS idx_orb_alerts_ticker;
DROP INDEX IF EXISTS idx_orb_alerts_event_timestamp;
DROP INDEX IF EXISTS idx_orb_alerts_event_type;
DROP INDEX IF EXISTS idx_orb_alerts_direction;
DROP INDEX IF EXISTS idx_orb_alerts_created_at;
DROP INDEX IF EXISTS idx_orb_alerts_ticker_timestamp;
DROP INDEX IF EXISTS idx_orb_alerts_ticker_event_type;
DROP INDEX IF EXISTS idx_orb_alerts_direction_timestamp;
DROP INDEX IF EXISTS idx_orb_alerts_raw_payload;

-- Create indexes
CREATE INDEX idx_orb_alerts_ticker ON public.orb_alerts(ticker);
CREATE INDEX idx_orb_alerts_event_timestamp ON public.orb_alerts(event_timestamp DESC);
CREATE INDEX idx_orb_alerts_event_type ON public.orb_alerts(event_type);
CREATE INDEX idx_orb_alerts_direction ON public.orb_alerts(direction);
CREATE INDEX idx_orb_alerts_created_at ON public.orb_alerts(created_at DESC);

-- Composite indexes for common query combinations
CREATE INDEX idx_orb_alerts_ticker_timestamp ON public.orb_alerts(ticker, event_timestamp DESC);
CREATE INDEX idx_orb_alerts_ticker_event_type ON public.orb_alerts(ticker, event_type);
CREATE INDEX idx_orb_alerts_direction_timestamp ON public.orb_alerts(direction, event_timestamp DESC);

-- JSONB index for flexible raw_payload queries
CREATE INDEX idx_orb_alerts_raw_payload ON public.orb_alerts USING GIN(raw_payload);

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Latest ORB alerts per ticker (last 24 hours)
CREATE OR REPLACE VIEW public.orb_alerts_latest AS
SELECT DISTINCT ON (ticker)
    id,
    ticker,
    event_type,
    direction,
    current_price,
    orb_high,
    orb_low,
    breakout_distance_percent,
    event_timestamp,
    created_at
FROM public.orb_alerts
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY ticker, event_timestamp DESC;

-- View: Breakout summary statistics
CREATE OR REPLACE VIEW public.orb_breakout_stats AS
SELECT
    ticker,
    DATE(TO_TIMESTAMP(event_timestamp / 1000)) as trade_date,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_up') as breakouts_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_down') as breakouts_down,
    COUNT(*) FILTER (WHERE event_type = 'orb_retest_up_confirmed') as retests_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_retest_down_confirmed') as retests_down,
    AVG(orb_size_percent) as avg_orb_size_percent,
    AVG(breakout_distance_percent) as avg_breakout_distance_percent
FROM public.orb_alerts
GROUP BY ticker, DATE(TO_TIMESTAMP(event_timestamp / 1000))
ORDER BY trade_date DESC, ticker;

-- ============================================================================
-- ROW LEVEL SECURITY (Optional - Enable if needed)
-- ============================================================================

-- Uncomment the lines below if you want to enable RLS:

-- ALTER TABLE public.orb_alerts ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow service role full access"
-- ON public.orb_alerts
-- FOR ALL
-- TO service_role
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated users to read"
-- ON public.orb_alerts
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- CREATE POLICY "Allow anon read recent"
-- ON public.orb_alerts
-- FOR SELECT
-- TO anon
-- USING (created_at > NOW() - INTERVAL '7 days');

-- ============================================================================
-- TEST DATA (Optional - Insert sample data for testing)
-- ============================================================================

-- Uncomment to insert test data:

-- INSERT INTO public.orb_alerts (
--     event_timestamp, ticker, chart_timeframe, event_type, direction,
--     current_price, orb_high, orb_low, orb_midpoint, orb_size, orb_size_percent,
--     breakout_distance, breakout_distance_percent, orb_duration_minutes, session_start,
--     volume, breakout_up_occurred, breakout_down_occurred, retest_up_confirmed, retest_down_confirmed,
--     scanner_symbol_count, raw_payload
-- ) VALUES (
--     1730736600000, 'SPY', '5', 'orb_breakout_up', 'LONG',
--     575.82, 575.50, 574.20, 574.85, 1.30, 0.23,
--     0.32, 24.62, 30, '0930',
--     1250000.50, true, false, false, false,
--     12, '{"test": true}'::jsonb
-- );

-- ============================================================================
-- VERIFY INSTALLATION
-- ============================================================================

-- Run this to verify table was created successfully:
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orb_alerts'
ORDER BY ordinal_position;

-- Check indexes:
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'orb_alerts';

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- If you see the table structure and indexes above, you're ready to go!
-- 
-- Next steps:
-- 1. Deploy Edge Function: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions
-- 2. Test webhook: Run test-webhook.ps1
-- 3. Configure TradingView alert
-- 
-- Webhook URL: https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook
-- ============================================================================

