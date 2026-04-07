/**
 * PocketBase Collections Setup Script
 *
 * This script automatically creates all required collections in PocketBase
 * based on the Prisma schema.
 *
 * Usage:
 * 1. Make sure PocketBase is running (./pocketbase serve)
 * 2. Create an admin account at http://127.0.0.1:8090/_/
 * 3. Run: node setup-collections.js
 */

const fs = require('fs');
const path = require('path');

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  console.log('🚀 Starting PocketBase collections setup...\n');

  // Check if PocketBase is running
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error('PocketBase is not responding');
    }
    console.log('✅ PocketBase is running\n');
  } catch (error) {
    console.error('❌ Cannot connect to PocketBase. Make sure it is running at', POCKETBASE_URL);
    console.error('   Run: cd pocketbase && ./pocketbase serve');
    process.exit(1);
  }

  // Authenticate as admin
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Please set ADMIN_EMAIL and ADMIN_PASSWORD environment variables');
    console.error('   Example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword node setup-collections.js');
    process.exit(1);
  }

  let adminToken;
  try {
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      throw new Error('Authentication failed');
    }

    const authData = await authResponse.json();
    adminToken = authData.token;
    console.log('✅ Authenticated as admin\n');
  } catch (error) {
    console.error('❌ Admin authentication failed. Please check your credentials.');
    process.exit(1);
  }

  // Load collections schema
  const schemaPath = path.join(__dirname, 'collections-schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  // Create collections
  console.log('Creating collections...\n');

  for (const collection of schema.collections) {
    try {
      console.log(`📦 Creating collection: ${collection.name}`);

      const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken,
        },
        body: JSON.stringify(collection),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error, null, 2));
      }

      console.log(`   ✅ ${collection.name} created successfully`);
    } catch (error) {
      console.error(`   ⚠️  Failed to create ${collection.name}:`, error.message);
      console.log('   (This might be okay if the collection already exists)');
    }
  }

  console.log('\n✨ Collections setup complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Visit the PocketBase Admin UI: http://127.0.0.1:8090/_/');
  console.log('   2. Review the created collections');
  console.log('   3. Update your Next.js app to use PocketBase');
}

main().catch(console.error);
