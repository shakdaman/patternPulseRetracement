#!/bin/bash
# ============================================================================
# ORB Webhook Test Script
# Tests the Supabase Edge Function with sample ORB alert payloads
# ============================================================================

# CONFIGURATION - Update these values
SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
SUPABASE_ANON_KEY="YOUR_ANON_KEY"
WEBHOOK_ENDPOINT="${SUPABASE_URL}/functions/v1/orb-webhook"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

test_endpoint() {
    local test_name=$1
    local payload=$2
    
    echo ""
    print_header "Test: $test_name"
    echo "Payload:"
    echo "$payload" | jq '.'
    echo ""
    
    response=$(curl -s -X POST "$WEBHOOK_ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -d "$payload")
    
    echo "Response:"
    echo "$response" | jq '.'
    
    # Check if successful
    success=$(echo "$response" | jq -r '.success')
    if [ "$success" == "true" ]; then
        print_success "Test passed: $test_name"
    else
        print_error "Test failed: $test_name"
        error_msg=$(echo "$response" | jq -r '.error')
        echo "Error: $error_msg"
    fi
    
    echo ""
}

# ============================================================================
# VALIDATE CONFIGURATION
# ============================================================================

print_header "ORB Webhook Test Suite"

if [[ "$SUPABASE_URL" == "https://YOUR-PROJECT.supabase.co" ]]; then
    print_error "Please update SUPABASE_URL in the script"
    exit 1
fi

if [[ "$SUPABASE_ANON_KEY" == "YOUR_ANON_KEY" ]]; then
    print_error "Please update SUPABASE_ANON_KEY in the script"
    exit 1
fi

print_info "Endpoint: $WEBHOOK_ENDPOINT"
echo ""

# ============================================================================
# TEST 1: ORB Breakout Up (SPY)
# ============================================================================

test_endpoint "ORB Breakout Up - SPY" '{
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
}'

# ============================================================================
# TEST 2: ORB Breakout Down (QQQ)
# ============================================================================

test_endpoint "ORB Breakout Down - QQQ" '{
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
}'

# ============================================================================
# TEST 3: ORB Retest Up Confirmed (IWM)
# ============================================================================

test_endpoint "ORB Retest Up Confirmed - IWM" '{
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
}'

# ============================================================================
# TEST 4: ORB Retest Down Confirmed (DIA)
# ============================================================================

test_endpoint "ORB Retest Down Confirmed - DIA" '{
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
}'

# ============================================================================
# TEST 5: Invalid Payload (Missing Required Field)
# ============================================================================

test_endpoint "Invalid Payload - Missing ticker" '{
  "alert_type": "orb",
  "event_timestamp": 1730739000000,
  "chart_timeframe": "5",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 100.00
}'

# ============================================================================
# TEST 6: Invalid Alert Type
# ============================================================================

test_endpoint "Invalid Alert Type" '{
  "alert_type": "invalid",
  "event_timestamp": 1730739000000,
  "ticker": "TEST",
  "chart_timeframe": "5",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 100.00
}'

# ============================================================================
# SUMMARY
# ============================================================================

print_header "Test Suite Complete"
print_info "Check Supabase Dashboard → Edge Functions → Logs for detailed logs"
print_info "Check Supabase Dashboard → Table Editor → orb_alerts for inserted data"
echo ""

