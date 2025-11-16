# ============================================================================
# ORB Webhook Test Script (PowerShell)
# Tests the Supabase Edge Function with sample ORB alert payloads
# ============================================================================

# CONFIGURATION - Update these values
$SUPABASE_URL = "https://aihoazkzytaprtcpgfwx.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaG9hemt6eXRhcHJ0Y3BnZnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyNzE1OCwiZXhwIjoyMDc2MzAzMTU4fQ.qvSfLB8v8P8SwB1OoVr1QTzxTiq4Y4g9u3TEFfb0DeQ"
$WEBHOOK_ENDPOINT = "$SUPABASE_URL/functions/v1/orb-webhook"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Failure {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-InfoMsg {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Payload
    )
    
    Write-Host ""
    Write-Header "Test: $TestName"
    Write-Host "Payload:"
    $Payload | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        }
        
        $response = Invoke-RestMethod -Uri $WEBHOOK_ENDPOINT -Method Post -Headers $headers -Body $Payload -ErrorAction Stop
        
        Write-Host "Response:"
        $response | ConvertTo-Json -Depth 10
        
        if ($response.success -eq $true) {
            Write-Success "Test passed: $TestName"
        } else {
            Write-Failure "Test failed: $TestName"
            Write-Host "Error: $($response.error)" -ForegroundColor Red
        }
    }
    catch {
        Write-Failure "Test failed: $TestName"
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# ============================================================================
# VALIDATE CONFIGURATION
# ============================================================================

Write-Header "ORB Webhook Test Suite"

if ($SUPABASE_URL -eq "https://YOUR-PROJECT.supabase.co") {
    Write-Failure "Please update SUPABASE_URL in the script"
    exit 1
}

if ($SUPABASE_ANON_KEY -eq "YOUR_ANON_KEY") {
    Write-Failure "Please update SUPABASE_ANON_KEY in the script"
    exit 1
}

Write-InfoMsg "Endpoint: $WEBHOOK_ENDPOINT"
Write-Host ""

# ============================================================================
# TEST 1: ORB Breakout Up (SPY)
# ============================================================================

$payload1 = @'
{
  "alert_type": "orb",
  "event_timestamp": 1730736600000,
  "ticker": "SPY",
  "chart_timeframe": "5",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 575.82,
  "orb_high": 575.50,
  "orb_low": 574.20,
  "orb_midpoint": 574.85,
  "orb_size": 1.30,
  "orb_size_percent": 0.23,
  "breakout_distance": 0.32,
  "breakout_distance_percent": 24.62,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 1250000.50,
  "breakout_up_occurred": true,
  "breakout_down_occurred": false,
  "retest_up_confirmed": false,
  "retest_down_confirmed": false,
  "scanner_symbol_count": 12
}
'@

Test-Endpoint -TestName "ORB Breakout Up - SPY" -Payload $payload1

# ============================================================================
# TEST 2: ORB Breakout Down (QQQ)
# ============================================================================

$payload2 = @'
{
  "alert_type": "orb",
  "event_timestamp": 1730737200000,
  "ticker": "QQQ",
  "chart_timeframe": "5",
  "event_type": "orb_breakout_down",
  "direction": "SHORT",
  "current_price": 488.15,
  "orb_high": 489.80,
  "orb_low": 488.50,
  "orb_midpoint": 489.15,
  "orb_size": 1.30,
  "orb_size_percent": 0.27,
  "breakout_distance": 0.35,
  "breakout_distance_percent": 26.92,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 2150000.75,
  "breakout_up_occurred": false,
  "breakout_down_occurred": true,
  "retest_up_confirmed": false,
  "retest_down_confirmed": false,
  "scanner_symbol_count": 12
}
'@

Test-Endpoint -TestName "ORB Breakout Down - QQQ" -Payload $payload2

# ============================================================================
# TEST 3: ORB Retest Up Confirmed (IWM)
# ============================================================================

$payload3 = @'
{
  "alert_type": "orb",
  "event_timestamp": 1730738400000,
  "ticker": "IWM",
  "chart_timeframe": "5",
  "event_type": "orb_retest_up_confirmed",
  "direction": "LONG",
  "current_price": 219.85,
  "orb_high": 219.50,
  "orb_low": 218.80,
  "orb_midpoint": 219.15,
  "orb_size": 0.70,
  "orb_size_percent": 0.32,
  "breakout_distance": 0.35,
  "breakout_distance_percent": 50.00,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 850000.25,
  "breakout_up_occurred": true,
  "breakout_down_occurred": false,
  "retest_up_confirmed": true,
  "retest_down_confirmed": false,
  "scanner_symbol_count": 12
}
'@

Test-Endpoint -TestName "ORB Retest Up Confirmed - IWM" -Payload $payload3

# ============================================================================
# TEST 4: ORB Retest Down Confirmed (DIA)
# ============================================================================

$payload4 = @'
{
  "alert_type": "orb",
  "event_timestamp": 1730739000000,
  "ticker": "DIA",
  "chart_timeframe": "5",
  "event_type": "orb_retest_down_confirmed",
  "direction": "SHORT",
  "current_price": 432.10,
  "orb_high": 433.50,
  "orb_low": 432.80,
  "orb_midpoint": 433.15,
  "orb_size": 0.70,
  "orb_size_percent": 0.16,
  "breakout_distance": 0.70,
  "breakout_distance_percent": 100.00,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 450000.00,
  "breakout_up_occurred": false,
  "breakout_down_occurred": true,
  "retest_up_confirmed": false,
  "retest_down_confirmed": true,
  "scanner_symbol_count": 12
}
'@

Test-Endpoint -TestName "ORB Retest Down Confirmed - DIA" -Payload $payload4

# ============================================================================
# TEST 5: Invalid Payload (Missing Required Field)
# ============================================================================

$payload5 = @'
{
  "alert_type": "orb",
  "event_timestamp": 1730739000000,
  "chart_timeframe": "5",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 100.00
}
'@

Test-Endpoint -TestName "Invalid Payload - Missing ticker" -Payload $payload5

# ============================================================================
# TEST 6: Invalid Alert Type
# ============================================================================

$payload6 = @'
{
  "alert_type": "invalid",
  "event_timestamp": 1730739000000,
  "ticker": "TEST",
  "chart_timeframe": "5",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 100.00
}
'@

Test-Endpoint -TestName "Invalid Alert Type" -Payload $payload6

# ============================================================================
# SUMMARY
# ============================================================================

Write-Header "Test Suite Complete"
Write-InfoMsg "Check Supabase Dashboard → Edge Functions → Logs for detailed logs"
Write-InfoMsg "Check Supabase Dashboard → Table Editor → orb_alerts for inserted data"
Write-Host ""

