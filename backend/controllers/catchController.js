// All catch-related database work lives here: creating a new catch (& increment user catch count)
// and listing all of a user's catches

import Catch from '../models/Catch.js';
import User from '../models/User.js';
import cloudinary from '../services/cloudinary.js';

/**
 * POST /api/catches
 * Creates a new Catch tied to the user, then increments their totalCatches.
 */
export async function createCatch(request, response) {
  try {
    const userId = request.user.id;
    const { species, weight, length, comment, location } = request.body;

    let imageUrl = null;

    // If an image file is present in the request, upload it to Cloudinary
    if (request.file) {
      console.log("Uploading image to Cloudinary...");

      // Wrap upload stream in a promise so we can await the result
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shuzzy' },
          (error, result) => {
            if (error) return reject(error);
            imageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(request.file.buffer);
      });

      console.log("Image uploaded successfully:", imageUrl);
    }

    console.log("Incoming request body:", request.body);
    console.log("Parsed imageUrl:", imageUrl);

    const catchRecord = await Catch.create({
      userId,
      catchName: species,
      catchWeight: weight,
      catchLength: length,
      catchLocation: location,
      catchComment: comment,
      imageUrl: imageUrl, // This will be null if no image was uploaded
      caughtAt: new Date()
    });

    // Increment user's total catches
    await User.findByIdAndUpdate(userId, { $inc: { totalCatches: 1 } });

    return response.status(201).json({ success: true, data: catchRecord });
  } catch (error) {
    console.error('Error adding catch:', error);
    return response.status(500).json({ success: false, message: 'Server error adding catch.' });
  }
}

/**
 * GET /api/catches
 * Returns all catches for the authenticated user.
 */
export async function listCatches(request, response) {
  try {
    const userId = request.user.id;

    const catches = await Catch.find({ userId }).sort({ caughtAt: -1 }); // newest first

    return response.status(200).json({ success: true, data: catches });
  } catch (error) {
    console.error('Error listing catches:', error);
    return response.status(500).json({ success: false, message: 'Server error listing catches.' });
  }
}
