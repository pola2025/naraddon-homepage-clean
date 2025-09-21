#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const password = process.env.EXPERT_SERVICES_ADMIN_PASSWORD;
  if (!password) {
    console.error(
      '[seed-expert-examiners] Missing EXPERT_SERVICES_ADMIN_PASSWORD environment variable.'
    );
    process.exit(1);
  }

  const baseUrl = process.env.EXPERT_SERVICES_BASE_URL || 'http://localhost:3000';
  const dataPath = path.join(process.cwd(), 'data', 'expertProfiles.json');

  let raw;
  try {
    raw = fs.readFileSync(dataPath, 'utf8');
  } catch (error) {
    console.error(`[seed-expert-examiners] Failed to read ${dataPath}:`, error);
    process.exit(1);
  }

  let records;
  try {
    records = JSON.parse(raw);
  } catch (error) {
    console.error('[seed-expert-examiners] expertProfiles.json is not valid JSON:', error);
    process.exit(1);
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.error('[seed-expert-examiners] No records found in expertProfiles.json.');
    process.exit(1);
  }

  const failures = [];

  for (const [index, record] of records.entries()) {
    const payload = {
      password,
      name: record.name || '',
      position: record.position || '',
      companyName: record.companyName || '',
      specialties: Array.isArray(record.specialties) ? record.specialties : [],
      imageUrl: record.imageUrl || '',
      imageAlt: record.imageAlt || '',
      sortOrder: typeof record.sortOrder === 'number' ? record.sortOrder : index,
      isPublished: record.isPublished !== false,
    };

    try {
      const response = await fetch(`${baseUrl}/api/expert-services/examiners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => response.statusText);
        failures.push({ name: record.name, status: response.status, message });
        console.warn(
          `[seed-expert-examiners] Failed to create ${record.name ?? 'unknown'} (${response.status}): ${message}`
        );
      } else {
        console.log(`[seed-expert-examiners] Created ${record.name ?? 'unknown'}.`);
      }
    } catch (error) {
      failures.push({ name: record.name, error });
      console.warn(`[seed-expert-examiners] Request error for ${record.name ?? 'unknown'}:`, error);
    }
  }

  if (failures.length > 0) {
    console.log(`\n[seed-expert-examiners] Completed with ${failures.length} failures.`);
    process.exitCode = 1;
  } else {
    console.log('\n[seed-expert-examiners] Completed successfully.');
  }
}

main();
