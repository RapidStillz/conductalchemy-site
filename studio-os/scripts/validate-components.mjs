import fs from 'node:fs';
import path from 'node:path';

const registryPath = path.resolve(process.cwd(), 'component-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const allowed = new Set(registry.policy?.allowedStatuses ?? []);
const errors = [];

if (registry.schemaVersion !== 1) errors.push('Unsupported or missing schemaVersion.');
if (!Array.isArray(registry.components) || registry.components.length === 0) errors.push('No component candidates registered.');

const ids = new Set();
for (const component of registry.components ?? []) {
  const prefix = component?.id ? `[${component.id}]` : '[unknown]';
  if (!component?.id) errors.push(`${prefix} id is required.`);
  if (ids.has(component?.id)) errors.push(`${prefix} duplicate id.`);
  ids.add(component?.id);

  for (const field of ['name','category','source','license','status','capabilityGap','whyCandidate','costPosition','test','owner']) {
    if (!component?.[field] || String(component[field]).trim() === '') errors.push(`${prefix} ${field} is required.`);
  }
  if (!allowed.has(component?.status)) errors.push(`${prefix} invalid status: ${component?.status}`);
  if (!Array.isArray(component?.risks) || component.risks.length === 0) errors.push(`${prefix} at least one risk is required.`);
  if (!Array.isArray(component?.acceptance) || component.acceptance.length === 0) errors.push(`${prefix} acceptance criteria are required.`);

  if (['approved_for_test','testing','adopted'].includes(component?.status)) {
    if (/UNVERIFIED|VERIFY_BEFORE_ADOPTION/i.test(component?.license ?? '')) {
      errors.push(`${prefix} cannot be ${component.status} with an unverified license.`);
    }
    if (!/^https:\/\//.test(component?.source ?? '')) {
      errors.push(`${prefix} cannot be ${component.status} without a canonical HTTPS source.`);
    }
  }

  if (component?.status === 'adopted') {
    for (const field of ['securityEvidence','testEvidence','rollbackPlan','integrationEvidence']) {
      if (!component?.[field] || String(component[field]).trim() === '') {
        errors.push(`${prefix} adopted components require ${field}.`);
      }
    }
  }
}

if (errors.length) {
  console.error('Component governance validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Component governance OK: ${registry.components.length} candidates checked; no unverified component is marked adopted.`);
