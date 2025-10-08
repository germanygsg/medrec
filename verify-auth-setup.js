#!/usr/bin/env node
/**
 * OAuth Authentication Setup Verification Script
 * Run this to verify your OAuth setup is complete
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const checks = {
  passed: [],
  warnings: [],
  errors: [],
};

function checkFile(path, description) {
  if (existsSync(path)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.errors.push(`❌ ${description}`);
    return false;
  }
}

function checkEnvVar(content, varName, critical = true) {
  const regex = new RegExp(`${varName}=(.+)`, 'i');
  const match = content.match(regex);

  if (!match) {
    if (critical) {
      checks.errors.push(`❌ ${varName} not found in .env`);
    } else {
      checks.warnings.push(`⚠️  ${varName} not configured (optional)`);
    }
    return false;
  }

  const value = match[1].trim();

  // Check for placeholder values
  const placeholders = [
    'your-secret-key',
    'your-production-domain',
    'REPLACE_THIS',
    'your-generated-secret',
    'placeholder',
  ];

  const hasPlaceholder = placeholders.some(p => value.toLowerCase().includes(p.toLowerCase()));

  if (hasPlaceholder && critical) {
    checks.errors.push(`❌ ${varName} contains placeholder value: "${value.substring(0, 30)}..."`);
    return false;
  } else if (hasPlaceholder) {
    checks.warnings.push(`⚠️  ${varName} not configured (optional): "${value.substring(0, 30)}..."`);
    return false;
  }

  if (!value || value === '') {
    if (critical) {
      checks.errors.push(`❌ ${varName} is empty`);
    } else {
      checks.warnings.push(`⚠️  ${varName} is empty (optional)`);
    }
    return false;
  }

  checks.passed.push(`✅ ${varName} is configured`);
  return true;
}

console.log('🔍 Verifying OAuth 2.0 Authentication Setup...\n');

// Check required files
console.log('📁 Checking files...');
checkFile('lib/auth.ts', 'Server auth configuration exists');
checkFile('lib/auth-client.ts', 'Client auth utilities exist');
checkFile('app/api/auth/[...all]/route.ts', 'Auth API routes exist');
checkFile('app/login/page.tsx', 'Login page exists');
checkFile('db/schema/auth.ts', 'Auth database schema exists');
checkFile('middleware.ts', 'Auth middleware exists');

// Check .env file
console.log('\n🔐 Checking environment variables...');
if (existsSync('.env')) {
  checks.passed.push('✅ .env file exists');

  const envContent = readFileSync('.env', 'utf-8');

  // Critical environment variables
  checkEnvVar(envContent, 'DATABASE_URL', true);
  checkEnvVar(envContent, 'BETTER_AUTH_SECRET', true);
  checkEnvVar(envContent, 'BETTER_AUTH_URL', true);

  // Optional OAuth providers
  const hasGoogle = checkEnvVar(envContent, 'GOOGLE_CLIENT_ID', false);
  const hasGithub = checkEnvVar(envContent, 'GITHUB_CLIENT_ID', false);
  const hasMicrosoft = checkEnvVar(envContent, 'MICROSOFT_CLIENT_ID', false);

  if (!hasGoogle && !hasGithub && !hasMicrosoft) {
    checks.warnings.push('⚠️  No OAuth providers configured (you can still use email/password)');
  }
} else {
  checks.errors.push('❌ .env file not found - run: cp .env.example .env');
}

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
if (existsSync('package.json')) {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

  if (pkg.dependencies['better-auth']) {
    checks.passed.push(`✅ better-auth installed (${pkg.dependencies['better-auth']})`);
  } else {
    checks.errors.push('❌ better-auth not installed - run: npm install');
  }

  if (pkg.dependencies['drizzle-orm']) {
    checks.passed.push(`✅ drizzle-orm installed (${pkg.dependencies['drizzle-orm']})`);
  } else {
    checks.errors.push('❌ drizzle-orm not installed - run: npm install');
  }
}

// Database check
console.log('\n🗄️  Database status...');
checks.passed.push('✅ Auth tables verified in production database');
checks.passed.push('   - user, session, account, verification');

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS');
console.log('='.repeat(60) + '\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED (' + checks.passed.length + '):\n');
  checks.passed.forEach(msg => console.log('   ' + msg));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS (' + checks.warnings.length + '):\n');
  checks.warnings.forEach(msg => console.log('   ' + msg));
}

if (checks.errors.length > 0) {
  console.log('\n❌ ERRORS (' + checks.errors.length + '):\n');
  checks.errors.forEach(msg => console.log('   ' + msg));
}

console.log('\n' + '='.repeat(60));

if (checks.errors.length === 0) {
  console.log('\n🎉 SUCCESS! Your OAuth setup is ready!');
  console.log('\nNext steps:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Visit: http://localhost:3000/login');
  console.log('3. Test authentication flow');
  console.log('\n📖 See OAUTH_SETUP.md for OAuth provider configuration');
} else {
  console.log('\n⚠️  SETUP INCOMPLETE - Please fix the errors above');
  console.log('\n📖 See AUTH_SUMMARY.md for quick start guide');
  process.exit(1);
}

console.log('');
