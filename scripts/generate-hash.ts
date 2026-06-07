/**
 * Generates a bcrypt hash for an admin password.
 *
 * Usage:
 *   npx tsx scripts/generate-hash.ts <your-password>
 *
 * Then add the output to .env.local:
 *   ADMIN_PASSWORD_HASH=<the hash>
 */

import bcrypt from 'bcryptjs'

async function main() {
  const password = process.argv[2]

  if (!password) {
    console.error('\n❌  No password provided.\n')
    console.error('Usage: npx tsx scripts/generate-hash.ts <your-password>\n')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('\n⚠️  Password must be at least 8 characters.\n')
    process.exit(1)
  }

  console.log('\n🔐  Generating hash (this takes a moment)…\n')
  const hash = await bcrypt.hash(password, 12)

  console.log('✅  Hash generated successfully!\n')
  console.log('Add these lines to your .env.local:\n')
  console.log(`ADMIN_EMAIL=your@email.com`)
  console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  console.log('\nAlso add a random secret (run once):')
  console.log('NEXTAUTH_SECRET=<output of: openssl rand -base64 32>\n')
}

main().catch(console.error)
