const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// .env.local 파일 읽기
const envFile = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envFile, 'utf-8');

// 환경변수 파싱
const envVars = {};
envContent.split('\n').forEach(line => {
  // 주석이나 빈 줄 제외
  if (line.trim() && !line.trim().startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log(`Found ${Object.keys(envVars).length} environment variables`);

// 각 환경변수를 Vercel에 추가
Object.entries(envVars).forEach(([key, value]) => {
  try {
    console.log(`Adding ${key}...`);
    // production, preview, development 모든 환경에 추가
    const command = `echo "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} production`;
    execSync(command, { stdio: 'pipe' });

    const command2 = `echo "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} preview`;
    execSync(command2, { stdio: 'pipe' });

    const command3 = `echo "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} development`;
    execSync(command3, { stdio: 'pipe' });

    console.log(`✅ ${key} added successfully`);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`⏭️  ${key} already exists, skipping...`);
    } else {
      console.error(`❌ Failed to add ${key}: ${error.message}`);
    }
  }
});

console.log('\nDone! You may need to redeploy for changes to take effect.');