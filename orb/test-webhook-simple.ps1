# Simple ORB Webhook Test
# Project: aihoazkzytaprtcpgfwx

$url = "https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook"
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaG9hemt6eXRhcHJ0Y3BnZnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyNzE1OCwiZXhwIjoyMDc2MzAzMTU4fQ.qvSfLB8v8P8SwB1OoVr1QTzxTiq4Y4g9u3TEFfb0DeQ"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ORB Webhook Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing: $url" -ForegroundColor Yellow
Write-Host ""

# Test 1: Valid ORB Breakout Up
Write-Host "Test 1: ORB Breakout Up (SPY)" -ForegroundColor White
Write-Host "------------------------------" -ForegroundColor Gray

$payload1 = @{
    alert_type = "orb"
    event_timestamp = 1730736600000
    ticker = "SPY"
    chart_timeframe = "5"
    event_type = "orb_breakout_up"
    direction = "LONG"
    current_price = 575.82
    orb_high = 575.50
    orb_low = 574.20
    orb_midpoint = 574.85
    orb_size = 1.30
    orb_size_percent = 0.23
    breakout_distance = 0.32
    breakout_distance_percent = 24.62
    orb_duration_minutes = 30
    session_start = "0930"
    volume = 1250000.50
    breakout_up_occurred = $true
    breakout_down_occurred = $false
    retest_up_confirmed = $false
    retest_down_confirmed = $false
    scanner_symbol_count = 12
} | ConvertTo-Json -Depth 10

try {
    $response1 = Invoke-RestMethod -Uri $url -Method Post `
        -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $key"} `
        -Body $payload1
    
    Write-Host "✓ SUCCESS" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response1 | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Valid ORB Breakout Down
Write-Host "Test 2: ORB Breakout Down (QQQ)" -ForegroundColor White
Write-Host "------------------------------" -ForegroundColor Gray

$payload2 = @{
    alert_type = "orb"
    event_timestamp = 1730737200000
    ticker = "QQQ"
    chart_timeframe = "5"
    event_type = "orb_breakout_down"
    direction = "SHORT"
    current_price = 488.15
    orb_high = 489.80
    orb_low = 488.50
    orb_midpoint = 489.15
    orb_size = 1.30
    orb_size_percent = 0.27
    breakout_distance = 0.35
    breakout_distance_percent = 26.92
    orb_duration_minutes = 30
    session_start = "0930"
    volume = 2150000.75
    breakout_up_occurred = $false
    breakout_down_occurred = $true
    retest_up_confirmed = $false
    retest_down_confirmed = $false
    scanner_symbol_count = 12
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri $url -Method Post `
        -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $key"} `
        -Body $payload2
    
    Write-Host "✓ SUCCESS" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response2 | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "✗ FAILED" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Invalid payload (should fail validation)
Write-Host "Test 3: Invalid Payload (Missing ticker)" -ForegroundColor White
Write-Host "------------------------------" -ForegroundColor Gray

$payload3 = @{
    alert_type = "orb"
    event_timestamp = 1730739000000
    chart_timeframe = "5"
    event_type = "orb_breakout_up"
    direction = "LONG"
    current_price = 100.00
} | ConvertTo-Json -Depth 10

try {
    $response3 = Invoke-RestMethod -Uri $url -Method Post `
        -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $key"} `
        -Body $payload3
    
    Write-Host "Response:" -ForegroundColor Gray
    $response3 | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "✓ CORRECTLY REJECTED (Expected)" -ForegroundColor Yellow
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Check your Supabase dashboard:" -ForegroundColor Yellow
Write-Host "https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run this query to see the data:" -ForegroundColor Yellow
Write-Host 'SELECT * FROM orb_alerts ORDER BY created_at DESC LIMIT 10;' -ForegroundColor White
Write-Host ""

