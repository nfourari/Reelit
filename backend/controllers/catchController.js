
// All catch-related database work lives here: creating a new catch (& increment user catch count)
// and listing all of a user's catches

// import { TextQueryHandler } from 'puppeteer';
import Catch from '../models/Catch.js';
import  User  from '../models/User.js';


/*
 * POST /api/catches
 * Creates a new Catch tied to the user, then increments their totalCatches.
 */
export async function createCatch(request, response)
{
  try
  {
    const userId = request.user.id;
    const { species, weight, length, comment, location, imageUrl } = request.body;

    const catchRecord = await Catch.create({
      userId,
      catchName:      species,
      catchWeight:    weight,
      catchLength:    length,
      catchLocation:  location, 
      catchComment:   comment,
      imageUrl,
      caughtAt:       new Date()
    });

    // Increment user's total catches
    await User.findByIdAndUpdate(userId, { $inc: { totalCatches: 1 } })

    return response.status(201).json({ success: true, data: catchRecord });
  }

  catch (error)
  {
    console.error('Error adding catch:', error);
    return response.status(500).json({ success: false, message: 'Server error adding catch.' });
  }
};




/*
 * GET /api/catches
 * Returns all Catch documents belonging to the current user.
 */
export async function listCatches(request, response)
{
  try
  {
    const catches = await Catch
      .find({ userId: request.user.id })
      .sort({ caughtAt: -1 });
    
    return response.json({ success: true, data: catches });
  }

  catch (error)
  {
    console.error('Error fetching catches:', error);
    response.status(500).json({ success: false, message: 'Server error fetching all user catches.' });
  }
};

