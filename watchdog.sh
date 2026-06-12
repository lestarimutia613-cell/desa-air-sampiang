#!/bin/bash
cd /home/z/my-project

STARTUP_COUNT=0
while true; do
  STARTUP_COUNT=$((STARTUP_COUNT + 1))
  echo "[watchdog] $(date) Starting server (attempt #$STARTUP_COUNT)..."
  
  NODE_OPTIONS="--max-old-space-size=64" \
  NODE_ENV=production \
  bun .next/standalone/server.js &
  SERVER_PID=$!
  
  # Wait for server ready
  for i in $(seq 1 10); do
    if curl -s http://localhost:3000/ > /dev/null 2>&1; then
      echo "[watchdog] $(date) Server ready (PID: $SERVER_PID)"
      break
    fi
    sleep 1
  done
  
  # Monitor server health
  FAIL_COUNT=0
  while kill -0 $SERVER_PID 2>/dev/null; do
    # Check if server responds
    if ! curl -s -o /dev/null -w "" http://localhost:3000/ 2>/dev/null; then
      FAIL_COUNT=$((FAIL_COUNT + 1))
      if [ $FAIL_COUNT -ge 3 ]; then
        echo "[watchdog] $(date) Server not responding, restarting..."
        kill $SERVER_PID 2>/dev/null
        break
      fi
    else
      FAIL_COUNT=0
    fi
    sleep 5
  done
  
  echo "[watchdog] $(date) Server died, waiting 3s before restart..."
  wait $SERVER_PID 2>/dev/null
  sleep 3
done
