#!/bin/bash
cd /home/z/my-project

# Build first if standalone doesn't exist
if [ ! -f ".next/standalone/server.js" ]; then
  echo "[$(date)] Building production..."
  npx next build 2>&1
  cp -r .next/static .next/standalone/.next/
  cp -r public .next/standalone/
fi

while true; do
  echo "[$(date)] Starting Next.js production server..."
  NODE_OPTIONS='--max-old-space-size=256' NODE_ENV=production node .next/standalone/server.js 2>&1
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT, restarting in 3s..."
  sleep 3
done
