import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Catch from '../models/Catch.js';

// Try multiple env file loading strategies
try {
  dotenv.config({ path: '.env.local' });
  if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env' });
  }
  if (!process.env.MONGODB_URI) {
    dotenv.config();
  }
} catch (error) {
  console.log('Using fallback env loading...');
  dotenv.config();
}

// Debug output
console.log('🔧 Current working directory:', process.cwd());
console.log('🔧 MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Sample catch data
const sampleCatches = [
  {
    catchName: 'Largemouth Bass',
    catchWeight: 8.5,
    catchLength: 24,
    catchLocation: 'Lake Tohopekaliga, FL',
    catchComment: 'Beautiful morning catch! Used a spinnerbait near the lily pads.',
    caughtAt: new Date('2025-07-15T08:30:00Z')
  },
  {
    catchName: 'Snook',
    catchWeight: 12.2,
    catchLength: 28,
    catchLocation: 'Indian River, FL',
    catchComment: 'Great fight on light tackle! Perfect slot fish.',
    caughtAt: new Date('2025-07-10T18:45:00Z')
  },
  {
    catchName: 'Redfish',
    catchWeight: 6.8,
    catchLength: 22,
    catchLocation: 'Mosquito Lagoon, FL',
    catchComment: 'Perfect slot fish - catch and release as always!',
    caughtAt: new Date('2025-07-08T07:15:00Z')
  },
  {
    catchName: 'Tarpon',
    catchWeight: 45.0,
    catchLength: 48,
    catchLocation: 'Boca Grande Pass, FL',
    catchComment: 'Silver king! What an incredible experience - released after photos.',
    caughtAt: new Date('2025-07-05T16:20:00Z')
  },
  {
    catchName: 'Peacock Bass',
    catchWeight: 4.2,
    catchLength: 18,
    catchLocation: 'Miami Canal, FL',
    catchComment: 'Invasive species removal - made for a delicious dinner!',
    caughtAt: new Date('2025-07-03T12:30:00Z')
  },
  {
    catchName: 'Spotted Seatrout',
    catchWeight: 3.5,
    catchLength: 20,
    catchLocation: 'Tampa Bay, FL',
    catchComment: 'Perfect size for fish tacos - great day on the water!',
    caughtAt: new Date('2025-07-01T14:00:00Z')
  }
];

async function seedUserCatches() {
  try {
    const userEmail = process.argv[2];
    
    if (!userEmail) {
      console.error('❌ Please provide a user email as an argument');
      console.log('Usage: node scripts/seedCatches.js user@example.com');
      process.exit(1);
    }

    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Make sure you have a .env.local file with MONGODB_URI in your backend directory');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.error(`❌ User with email ${userEmail} not found`);
      process.exit(1);
    }

    if (!user.isEmailVerified) {
      console.error(`❌ User ${userEmail} email is not verified. Please verify email first.`);
      process.exit(1);
    }

    console.log(`✅ Found verified user: ${user.firstName} ${user.lastName} (${user.email})`);

    const existingCatches = await Catch.find({ userId: user._id });
    if (existingCatches.length > 0) {
      console.log(`⚠️  User already has ${existingCatches.length} catches. Adding more...`);
    }

    const catchRecords = sampleCatches.map(catchData => ({
      ...catchData,
      userId: user._id
    }));

    const insertedCatches = await Catch.insertMany(catchRecords);
    console.log(`🎣 Successfully seeded ${insertedCatches.length} catches for ${user.email}`);

    const newTotalCatches = await Catch.countDocuments({ userId: user._id });
    await User.findByIdAndUpdate(user._id, { totalCatches: newTotalCatches });
    console.log(`📊 Updated user's total catch count to ${newTotalCatches}`);

    console.log('\n🐟 Seeded Catches Summary:');
    insertedCatches.forEach((catchRecord, index) => {
      console.log(`  ${index + 1}. ${catchRecord.catchName} - ${catchRecord.catchWeight}lbs - ${catchRecord.catchLocation}`);
    });

    console.log('\n✨ Seeding complete! Perfect for your Thursday demo! 🎣');

  } catch (error) {
    console.error('❌ Error seeding catches:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedUserCatches();