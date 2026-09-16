const Event = require('../models/Event');

// Helper to extract city name cleanly from Google Places prediction
const parseCityFromPrediction = (prediction) => {
  const terms = prediction.terms || [];
  if (terms.length >= 3) {
    const potentialCity = terms[terms.length - 3]?.value;
    if (potentialCity && potentialCity.length > 2) return potentialCity;
  }
  if (terms.length >= 2) {
    const potentialCity = terms[terms.length - 2]?.value;
    if (potentialCity && potentialCity.length > 2) return potentialCity;
  }
  if (prediction.structured_formatting?.secondary_text) {
    const parts = prediction.structured_formatting.secondary_text.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim();
    }
    return parts[0].trim();
  }
  return '';
};

// @desc    Get live Google Places Autocomplete location recommendations
// @route   GET /api/locations/autocomplete
// @access  Public
exports.getLocationAutocomplete = async (req, res, next) => {
  try {
    const { input } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;

    // No predefined static options when input is empty
    if (!input || input.trim().length === 0) {
      return res.status(200).json({
        success: true,
        predictions: []
      });
    }

    const queryClean = input.trim();
    let googlePredictions = [];

    // 1. Fetch live Google Places API predictions if API key is configured
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          queryClean
        )}&key=${apiKey}&types=establishment|geocode`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.status === 'OK' && data.predictions) {
          googlePredictions = data.predictions.map((p) => {
            const city = parseCityFromPrediction(p);
            return {
              description: p.description,
              mainText: p.structured_formatting?.main_text || p.description,
              secondaryText: p.structured_formatting?.secondary_text || '',
              city: city || p.structured_formatting?.secondary_text || '',
              placeId: p.place_id,
              isVenue: p.types?.includes('establishment') || false,
              source: 'google'
            };
          });
        }
      } catch (apiErr) {
        console.warn('[Google Places API Warning]:', apiErr.message);
      }
    }

    // 2. Also search dynamic active Event cities and locations in MongoDB database
    const dbEvents = await Event.find({
      status: 'approved',
      $or: [
        { city: { $regex: queryClean, $options: 'i' } },
        { location: { $regex: queryClean, $options: 'i' } },
        { title: { $regex: queryClean, $options: 'i' } }
      ]
    })
      .limit(5)
      .select('city location title');

    const dbPredictions = dbEvents.map((e) => ({
      description: `${e.location}, ${e.city}`,
      mainText: e.location || e.city,
      secondaryText: e.city,
      city: e.city,
      isVenue: true,
      source: 'database'
    }));

    // Combine Google predictions with DB predictions (deduplicated)
    const combined = [...googlePredictions, ...dbPredictions];
    const uniqueMap = new Map();
    combined.forEach((item) => {
      if (!uniqueMap.has(item.mainText.toLowerCase())) {
        uniqueMap.set(item.mainText.toLowerCase(), item);
      }
    });

    const finalPredictions = Array.from(uniqueMap.values());

    res.status(200).json({
      success: true,
      predictions: finalPredictions
    });
  } catch (error) {
    next(error);
  }
};
