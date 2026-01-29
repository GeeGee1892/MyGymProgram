#!/usr/bin/env node

/**
 * Automatic Exercise Database Updater
 * Adds media paths to your exercise database
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔧 Exercise Database Updater\n');
  console.log('Adding media paths to your exercise database...\n');
  
  // Load mapping
  const mappingPath = path.join(__dirname, 'exercise-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.error('❌ Error: exercise-mapping.json not found!');
    process.exit(1);
  }
  
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const exercises = Object.keys(mapping);
  
  console.log(`✓ Found ${exercises.length} exercises with images\n`);
  
  // Find exercises.js
  const exercisesPath = path.join(__dirname, 'src', 'data', 'exercises.js');
  if (!fs.existsSync(exercisesPath)) {
    console.error('❌ Error: src/data/exercises.js not found!');
    console.log('Make sure you\'re running this from your project root.\n');
    process.exit(1);
  }
  
  console.log('✓ Found exercises.js\n');
  
  // Read file
  let content = fs.readFileSync(exercisesPath, 'utf8');
  
  // Create backup
  const backupPath = exercisesPath + '.backup';
  fs.writeFileSync(backupPath, content);
  console.log('✓ Created backup: exercises.js.backup\n');
  
  let updated = 0;
  let skipped = 0;
  
  // Update each exercise
  for (const [exerciseId, data] of Object.entries(mapping)) {
    // Get file extension
    const ext = path.extname(data.destination);
    
    // Determine category from destination path
    const categoryMatch = data.destination.match(/exercises\/([^/]+)\//);
    const category = categoryMatch ? categoryMatch[1] : 'unknown';
    
    // Create media path
    const mediaPath = `require('../../assets/exercises/${category}/${exerciseId}${ext}')`;
    
    // Check if exercise exists and doesn't have media
    const exerciseRegex = new RegExp(`(${exerciseId}:\\s*{[^}]*?)(})`, 's');
    const match = content.match(exerciseRegex);
    
    if (match) {
      const exerciseBlock = match[1];
      
      // Check if already has media
      if (exerciseBlock.includes('media:')) {
        console.log(`⊘ ${exerciseId} - already has media`);
        skipped++;
      } else {
        // Add media property before closing brace
        const updated_block = exerciseBlock + `\n    media: ${mediaPath},\n  `;
        content = content.replace(exerciseRegex, updated_block + '}');
        console.log(`✓ ${exerciseId} - added media path`);
        updated++;
      }
    } else {
      console.log(`⚠ ${exerciseId} - not found in database`);
      skipped++;
    }
  }
  
  // Write updated content
  fs.writeFileSync(exercisesPath, content);
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total exercises: ${exercises.length}`);
  console.log(`✓ Updated: ${updated}`);
  console.log(`⊘ Skipped: ${skipped}`);
  console.log(`\n✅ Database updated!\n`);
  console.log('📁 File: src/data/exercises.js');
  console.log('💾 Backup: src/data/exercises.js.backup\n');
  console.log('🎉 Your app now has exercise images!\n');
  console.log('Next: Start your app and see the images:');
  console.log('  npm start\n');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
