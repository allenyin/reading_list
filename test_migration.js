#!/usr/bin/env node

/**
 * Test script to verify Eleventy migration configuration
 * Run this after installing dependencies to test the setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Eleventy Migration Configuration...\n');

// Test 1: Check if .eleventy.js exists
if (fs.existsSync('.eleventy.js')) {
  console.log('✅ .eleventy.js configuration file exists');
} else {
  console.log('❌ .eleventy.js not found');
}

// Test 2: Check if package.json exists
if (fs.existsSync('package.json')) {
  console.log('✅ package.json exists');
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.dependencies && pkg.dependencies['@11ty/eleventy']) {
      console.log('✅ Eleventy dependency configured');
    } else {
      console.log('❌ Eleventy dependency not found in package.json');
    }
  } catch (e) {
    console.log('❌ Error reading package.json:', e.message);
  }
} else {
  console.log('❌ package.json not found');
}

// Test 3: Check _posts directory
if (fs.existsSync('_posts')) {
  const posts = fs.readdirSync('_posts').filter(f => f.endsWith('.md'));
  console.log(`✅ _posts directory exists with ${posts.length} markdown files`);
  
  // Test a few posts for date extraction
  const testPosts = posts.slice(0, 3);
  testPosts.forEach(post => {
    const dateMatch = post.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      console.log(`  📅 ${post}: Date extractable from filename`);
    } else {
      console.log(`  📅 ${post}: No date in filename (will use front matter)`);
    }
  });
} else {
  console.log('❌ _posts directory not found');
}

// Test 4: Check layouts and includes
if (fs.existsSync('_layouts')) {
  const layouts = fs.readdirSync('_layouts');
  console.log(`✅ _layouts directory exists with: ${layouts.join(', ')}`);
} else {
  console.log('❌ _layouts directory not found');
}

if (fs.existsSync('_includes')) {
  const includes = fs.readdirSync('_includes');
  console.log(`✅ _includes directory exists with: ${includes.join(', ')}`);
} else {
  console.log('❌ _includes directory not found');
}

console.log('\n🚀 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build');
console.log('3. Run: npm run serve (to test locally)');
console.log('\n📝 Migration Features:');
console.log('- ✅ Existing posts: Dates extracted from filenames');
console.log('- ✅ Future posts: Dates from front matter');
console.log('- ✅ Permalink support for easy cross-referencing');
console.log('- ✅ LaTeX math rendering with $$...$$ blocks');
console.log('- ✅ Automatic tag generation');
console.log('- ✅ Syntax highlighting with Prism.js');
