// Returns WS-Services' Google reviews via the Places API (New).
// Key lives in the GOOGLE_PLACES_API_KEY env var; optional GOOGLE_PLACE_ID skips the lookup.
const API = 'https://places.googleapis.com/v1';

exports.handler = async function () {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return respond(500, { error: 'missing key' }, 60);

  try {
    let placeId = process.env.GOOGLE_PLACE_ID;

    if (!placeId) {
      const search = await fetch(API + '/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.id,places.displayName'
        },
        body: JSON.stringify({ textQuery: 'WS-Services plumbing heating 07444 254393', regionCode: 'GB' })
      });
      const found = await search.json();
      const match = (found.places || []).find(function (p) {
        return /ws[\s-]*services/i.test(p.displayName && p.displayName.text);
      });
      if (!match) return respond(200, { reviews: [] }, 3600);
      placeId = match.id;
    }

    const res = await fetch(API + '/places/' + placeId, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews'
      }
    });
    if (!res.ok) return respond(502, { error: 'places error' }, 300);
    const place = await res.json();

    const reviews = (place.reviews || [])
      .map(function (r) {
        return {
          author: r.authorAttribution && r.authorAttribution.displayName,
          rating: r.rating,
          text: (r.originalText && r.originalText.text) || (r.text && r.text.text) || '',
          when: r.relativePublishTimeDescription
        };
      })
      .filter(function (r) { return r.rating >= 4 && r.text; });

    return respond(200, {
      placeId: place.id,
      name: place.displayName && place.displayName.text,
      rating: place.rating,
      total: place.userRatingCount,
      url: place.googleMapsUri,
      reviews: reviews
    }, 86400);
  } catch (e) {
    return respond(502, { error: 'fetch failed' }, 300);
  }
};

function respond(status, body, ttl) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=' + ttl
    },
    body: JSON.stringify(body)
  };
}
