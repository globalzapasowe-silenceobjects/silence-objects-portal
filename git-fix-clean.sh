#!/data/data/com.termux/files/usr/bin/bash
# GIT REMOTE FIX - CLEAN VERSION

set -e

echo "=== CURRENT DIRECTORY ==="
pwd
echo ""

echo "=== GIT REMOTE STATUS ==="
git remote -v || echo "No remote configured"
echo ""

echo "=== CURRENT BRANCH ==="
BRANCH=$(git branch --show-current)
echo "Branch: $BRANCH"
echo ""

echo "=== FIXING REMOTE ==="
if git remote get-url origin >/dev/null 2>&1; then
    echo "Remote exists:"
    git remote get-url origin
else
    echo "Adding remote..."
    git remote add origin git@github.com:globalzapasowe-silenceobjects/silence-objects-framework.git
    echo "Remote added"
fi
echo ""

echo "=== SETTING UPSTREAM ==="
if [ -n "$BRANCH" ]; then
    git branch --set-upstream-to=origin/$BRANCH $BRANCH || echo "Will set on first push"
fi
echo ""

echo "=== READY TO PUSH ==="
echo "Run: git push"
