#!/bin/bash

# MyGymProgram Repo Cleanup Script
# Run this from the root of your MyGymProgram repo

echo "🧹 Starting MyGymProgram cleanup..."

# 1. Remove duplicate nested folder
if [ -d "MyGymProgram" ]; then
    echo "📁 Removing duplicate MyGymProgram/ folder..."
    rm -rf MyGymProgram/
    echo "   ✅ Removed"
else
    echo "   ℹ️  MyGymProgram/ folder not found (already clean)"
fi

# 2. Remove node_modules from git tracking (not from disk)
if [ -d "node_modules" ]; then
    echo "📦 Removing node_modules/ from git tracking..."
    git rm -r --cached node_modules/ 2>/dev/null || true
    echo "   ✅ Removed from git (kept on disk for local dev)"
fi

# 3. Remove malformed {src folder if it exists
if [ -d "{src" ]; then
    echo "📁 Removing malformed {src/ folder..."
    rm -rf "{src/"
    echo "   ✅ Removed"
fi

# 4. Remove .DS_Store files
echo "🗑️  Removing .DS_Store files..."
find . -name ".DS_Store" -delete 2>/dev/null
git rm --cached -r "*.DS_Store" 2>/dev/null || true
echo "   ✅ Removed"

# 5. Remove backup files
echo "🗑️  Removing backup files..."
find . -name "*.backup" -delete 2>/dev/null
git rm --cached "*.backup" 2>/dev/null || true
echo "   ✅ Removed"

# 6. Remove dist folder from git (build output)
if [ -d "dist" ]; then
    echo "📁 Removing dist/ from git tracking..."
    git rm -r --cached dist/ 2>/dev/null || true
    echo "   ✅ Removed from git"
fi

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Copy the new files from the fixes folder"
echo "2. Run: git add -A"
echo "3. Run: git commit -m 'Clean up repo structure, fix imports'"
echo "4. Run: git push"
echo ""
echo "This should fix your Render build! 🚀"
