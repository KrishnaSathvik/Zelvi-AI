#!/bin/bash

# Zelvi AI - Edge Functions Deployment Script
# This script deploys all Edge Functions to Supabase

PROJECT_REF="xpmpplxjmmcxyrvrryqo"

echo "🚀 Deploying Zelvi AI Edge Functions..."
echo "Project Ref: $PROJECT_REF"
echo ""

# Deploy all functions
echo "📦 Deploying functions..."
echo ""

echo "1️⃣  Deploying ai-coach..."
supabase functions deploy ai-coach --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ ai-coach deployed"
else
  echo "   ❌ ai-coach deployment failed"
fi
echo ""

echo "2️⃣  Deploying ai-weekly-summary..."
supabase functions deploy ai-weekly-summary --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ ai-weekly-summary deployed"
else
  echo "   ❌ ai-weekly-summary deployment failed"
fi
echo ""

echo "3️⃣  Deploying ai-notes..."
supabase functions deploy ai-notes --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ ai-notes deployed"
else
  echo "   ❌ ai-notes deployment failed"
fi
echo ""

echo "4️⃣  Deploying export-data..."
supabase functions deploy export-data --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ export-data deployed"
else
  echo "   ❌ export-data deployment failed"
fi
echo ""

echo "5️⃣  Deploying delete-account..."
supabase functions deploy delete-account --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ delete-account deployed"
else
  echo "   ❌ delete-account deployment failed"
fi
echo ""

echo "6️⃣  Deploying upgrade-guest..."
supabase functions deploy upgrade-guest --project-ref $PROJECT_REF
if [ $? -eq 0 ]; then
  echo "   ✅ upgrade-guest deployed"
else
  echo "   ❌ upgrade-guest deployment failed"
fi
echo ""

echo "✨ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify ALLOWED_ORIGINS secret is set in Supabase Dashboard"
echo "   2. Test AI Coach in the app"
echo "   3. Test Weekly Summary generation"
echo "   4. Test AI Notes (transcription and chat)"
echo "   5. Verify Profile page features work"
echo "   6. Check rate limiting headers in responses"

