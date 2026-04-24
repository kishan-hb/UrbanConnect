const mongoose = require('mongoose');
const { mongoUri } = require('../config');
const User = require('../models/user');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--email') args.email = argv[i + 1];
    if (item === '--clerkId') args.clerkId = argv[i + 1];
  }
  return args;
}

async function main() {
  const { email, clerkId } = parseArgs(process.argv.slice(2));

  if (!mongoUri) {
    console.error('Missing MONGO_URI in environment.');
    process.exit(1);
  }

  if (!email && !clerkId) {
    console.error('Usage: node scripts/promoteUserToAdmin.js --email <user@email.com> OR --clerkId <clerk_user_id>');
    process.exit(1);
  }

  const query = email ? { email } : { clerkId };

  await mongoose.connect(mongoUri);

  try {
    const user = await User.findOne(query);

    if (!user) {
      console.error('User not found for query:', query);
      process.exitCode = 1;
      return;
    }
    
    if (user.role === 'provider') {
      console.log('User is already an admin:', {
        id: user._id.toString(),
        email: user.email,
        clerkId: user.clerkId
      });
      return;
    } 

    user.role = 'provider';
    user.approvedByAdmin = true;
    user.backgroundCheckStatus = 'approved';
    user.isActive = true;

    await user.save();

    console.log('Provider role granted successfully:', {
      id: user._id.toString(),
      email: user.email,
      clerkId: user.clerkId,
      role: user.role
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(async (err) => {
  console.error('Failed to promote user to provider:', err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
