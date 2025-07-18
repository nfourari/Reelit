// Keeps external API logic separate
// Sole functions are fetching and shaping FishBase data.


import  axios  from 'axios';

/**
 * GET /api/species/:species
 * Proxies a lookup to FishBase and returns key fields.
 */
export async function lookupSpecies(request, response)
{
  const { species } = request.params;
  const apiUrl = `https://fishbase.ropensci.org/species?genus_species=${encodeURIComponent(species)}`;

  try
  {
    const response = await axios.get(apiUrl);
    const fish = response.data.data?.[0];
    if (!fish)
    {
      return response.status(404).json({ success: false, message: 'Species not found.' });
    }

    return response.json({
      success:      true,
      species:      `${fish.Genus} ${fish.Species}`,
      commonName:   fish.FBname,
      status:       fish.IUCN,
      habitat:      fish.Habitats,
      distribution: fish.Distribution
    });
  }

  catch (error)
  {
    console.error('Species lookup error:', error);
    response.status(500).json({ success: false, message: 'Server error fetching species.' });
  }
};