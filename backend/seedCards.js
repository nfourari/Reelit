// backend/seedCards.js

require('dotenv').config();
const mongoose = require ('mongoose');
const Card = require('./models/Card');

const cardList = [
    'Roy Campanella', 'Paul Molitor', 'Tony Gwynn',
    'Dennis Eckersley', 'Reggie Jackson', 'Gaylord Perry',
    'Buck Leonard', 'Rollie Fingers', 'Charlie Gehringer',
    'Wade Boggs', 'Carl Hubbell', 'Dave Winfield',
    'Jackie Robinson', 'Ken Griffey, Jr.', 'Al Simmons',
    'Chuck Klein', 'Mel Ott', 'Mark McGwire', 'Nolan Ryan',
    'Ralph Kiner', 'Yogi Berra',
    'Goose Goslin',
    'Greg Maddux',
    'Frankie Frisch',
    'Ernie Banks',
    'Ozzie Smith',
    'Hank Greenberg',
    'Kirby Puckett',
    'Bob Feller',
    'Dizzy Dean',
    'Joe Jackson',
    'Sam Crawford',
    'Barry Bonds',
    'Duke Snider',
    'George Sisler',
    'Ed Walsh',
    'Tom Seaver',
    'Willie Stargell',
    'Bob Gibson',
    'Brooks Robinson',
    'Steve Carlton',
    'Joe Medwick',
    'Nap Lajoie',
    'Cal Ripken, Jr.',
    'Mike Schmidt',
    'Eddie Murray',
    'Tris Speaker',
    'Al Kaline',
    'Sandy Koufax',
    'Willie Keeler',
    'Pete Rose',
    'Robin Roberts',
    'Eddie Collins',
    'Lefty Gomez',
    'Lefty Grove',
    'Carl Yastrzemski',
    'Frank Robinson',
    'Juan Marichal',
    'Warren Spahn',
    'Pie Traynor',
    'Roberto Clemente',
    'Harmon Killebrew',
    'Satchel Paige',
    'Eddie Plank',
    'Josh Gibson',
    'Oscar Charleston',
    'Mickey Mantle',
    'Cool Papa Bell',
    'Johnny Bench',
    'Mickey Cochrane',
    'Jimmie Foxx',
    'Jim Palmer',
    'Cy Young',
    'Eddie Mathews',
    'Honus Wagner',
    'Paul Waner',
    'Grover Alexander',
    'Rod Carew',
    'Joe DiMaggio',
    'Joe Morgan',
    'Stan Musial',
    'Bill Terry',
    'Rogers Hornsby',
    'Lou Brock',
    'Ted Williams',
    'Bill Dickey',
    'Christy Mathewson',
    'Willie McCovey',
    'Lou Gehrig',
    'George Brett',
    'Hank Aaron',
    'Harry Heilmann',
    'Walter Johnson',
    'Roger Clemens',
    'Ty Cobb',
    'Whitey Ford',
    'Willie Mays',
    'Rickey Henderson',
    'Babe Ruth'
];

async function run()
{
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log(`✅ MongoDB connected`))
      .catch(err => console.error(`❌ MongoDB error:`, err));

    console.log('🗄️ Connected, seeding Cards…');

   // await Card.DeleteMany({});

   // Build documents & insert cards
   const docs = cardList.map(name => ( { userID: 1, card: name} ));
   const inserted = await Card.insertMany(docs);
   console.log(`✅ Inserted ${inserted.length} cards`);

   await mongoose.disconnect();
   process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});