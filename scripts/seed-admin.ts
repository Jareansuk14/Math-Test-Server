import { connectDatabase } from '../src/config/db';
import { AdminUser } from '../src/models/AdminUser';
import { hashPassword } from '../src/utils/password';

async function main() {
  await connectDatabase();
  const email = process.env.SEED_ADMIN_EMAIL || 'jitsrinuttida@gmail.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'MathM3@';
  const exists = await AdminUser.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
  } else {
    const passwordHash = await hashPassword(password);
    await AdminUser.create({ email, passwordHash, role: 'admin' });
    console.log('Created admin:', email, 'password:', password);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
