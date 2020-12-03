//-------
// Inspired by https://github.com/sunng87/node-geohash
// ... minor changes for convenience in my codes
// Geohash.encode : support MongoDB, ElasticSearch and GeoJSON formats
// Geohash.decode : result to normalized GeoJSON format
//-------

const BASE32_CODES = '0123456789bcdefghjkmnpqrstuvwxyz';
const BASE32_CODES_DICT = {};
for (let i = 0; i < BASE32_CODES.length; i += 1) {
  BASE32_CODES_DICT[BASE32_CODES.charAt(i)] = i;
}

const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LON = -180;
const MAX_LON = 180;

//-------
// For convenience, support different formats of location
// -
// Ex:
//  · GeoJSON (mean { type: 'Feature', geometry: { type: 'Point': coordinates: [lon, lat] } } })
//  · GeoJSON of type 'Point' also used by MongoDB https://docs.mongodb.com/manual/reference/geojson/#point
//  · GeoPoint from elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/7.6/geo-point.html
//  · { longitude, latitude} object commonly used in some packages
//-------
function extractLonLat(location) {
  // Array ? (Specially from elasticsearch GeoPoint)
  if (Array.isArray(location)) {
    return { longitude: location[0], latitude: location[1] };
  }

  // String ? (Specially from elasticsearch GeoPoint)
  if (typeof location === 'string' || location instanceof String) {
    // Init var
    let matches;

    // Geo-point as a string ?
    matches = location.match(/^([+-]?(?:\d*\.)?\d+),([+-]?(?:\d*\.)?\d+)$/);
    if (matches) {
      return { longitude: parseFloat(matches[2]), latitude: parseFloat(matches[1]) };
    }

    // Geo-point as a WKT POINT primitive ?
    matches = location.match(/^POINT \(([+-]?(?:\d*\.)?\d+) ([+-]?(?:\d*\.)?\d+)\)$/);
    if (matches) {
      return { longitude: parseFloat(matches[1]), latitude: parseFloat(matches[2]) };
    }

    throw TypeError(`No pattern match for location "${location}" ...`);
  }

  // GeoJSON Point ? (Specially from MongoDB)
  if (location.type === 'Point') {
    return { longitude: location.coordinates[0], latitude: location.coordinates[1] };
  }

  // GeoJSON
  if (location.type === 'Feature') {
    return extractLonLat(location.geometry);
  }

  // Has lon/lat properties (Specially from elasticsearch GeoPoint)
  if (location.lon !== undefined && location.lat !== undefined) {
    return { longitude: location.lon, latitude: location.lat };
  }

  // Has longitude/latitude properties (Specially from some react native location packages)
  if (location.longitude !== undefined && location.latitude !== undefined) {
    return location;
  }

  throw TypeError('Invalid location parameter ...');
}

//-------
// Encode
//-------
function encode(location, numberOfChars = 9) {
  const chars = [];
  let bits = 0;
  let bitsTotal = 0;
  let hash_value = 0;
  let maxLat = MAX_LAT;
  let minLat = MIN_LAT;
  let maxLon = MAX_LON;
  let minLon = MIN_LON;
  let mid;

  const { longitude, latitude } = extractLonLat(location);

  while (chars.length < numberOfChars) {
    if (bitsTotal % 2 === 0) {
      mid = (maxLon + minLon) / 2;
      if (longitude > mid) {
        hash_value = (hash_value << 1) + 1;
        minLon = mid;
      } else {
        hash_value = (hash_value << 1) + 0;
        maxLon = mid;
      }
    } else {
      mid = (maxLat + minLat) / 2;
      if (latitude > mid) {
        hash_value = (hash_value << 1) + 1;
        minLat = mid;
      } else {
        hash_value = (hash_value << 1) + 0;
        maxLat = mid;
      }
    }

    bits += 1;
    bitsTotal += 1;
    if (bits === 5) {
      chars.push(BASE32_CODES[hash_value]);
      bits = 0;
      hash_value = 0;
    }
  }
  return chars.join('');
}

//-------
// Decode
//-------
function decode(hash_string) {
  let isLon = true;
  let maxLat = MAX_LAT;
  let minLat = MIN_LAT;
  let maxLon = MAX_LON;
  let minLon = MIN_LON;
  let mid;

  let hashValue = 0;
  for (let i = 0, l = hash_string.length; i < l; i += 1) {
    const code = hash_string[i].toLowerCase();
    hashValue = BASE32_CODES_DICT[code];

    for (let bits = 4; bits >= 0; bits -= 1) {
      const bit = (hashValue >> bits) & 1;
      if (isLon) {
        mid = (maxLon + minLon) / 2;
        if (bit === 1) {
          minLon = mid;
        } else {
          maxLon = mid;
        }
      } else {
        mid = (maxLat + minLat) / 2;
        if (bit === 1) {
          minLat = mid;
        } else {
          maxLat = mid;
        }
      }
      isLon = !isLon;
    }
  }

  const lat = (minLat + maxLat) / 2;
  const lon = (minLon + maxLon) / 2;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat],
    },
    properties: {
      longitude_error: maxLon - lon,
      latitude_error: maxLat - lat,
    },
  };
}

//-------
// ensure_valid_lon
//-------
function ensure_valid_lon(lon) {
  if (lon > MAX_LON) {
    return MIN_LON + lon % MAX_LON;
  }

  if (lon < MIN_LON) {
    return MAX_LON + lon % MAX_LON;
  }

  return lon;
};

//-------
// ensure_valid_lat
//-------
function ensure_valid_lat(lat) {
  if (lat > MAX_LAT) {
    return MAX_LAT;
  }

  if (lat < MIN_LAT) {
    return MIN_LAT;
  }

  return lat;
};

//-------
// Neighbor
//-------
function neighborCoordinates(decoded, direction) {
  return [
    ensure_valid_lon(decoded.geometry.coordinates[0] + direction[0] * decoded.properties.longitude_error * 2),
    ensure_valid_lat(decoded.geometry.coordinates[1] + direction[1] * decoded.properties.latitude_error * 2),
  ];
}

//-------
// Neighbors
//-------
function neighbors(hash) {
  // Decode hash
  const decoded = decode(hash);

  // Return 8 neighbors
  return [
    encode(neighborCoordinates(decoded, [0, 1]), hash.length), // top
    encode(neighborCoordinates(decoded, [1, 1]), hash.length), // topleft
    encode(neighborCoordinates(decoded, [1, 0]), hash.length), // left
    encode(neighborCoordinates(decoded, [1, -1]), hash.length), // bottomleft
    encode(neighborCoordinates(decoded, [0, -1]), hash.length), // bottom
    encode(neighborCoordinates(decoded, [-1, -1]), hash.length), // bottomright
    encode(neighborCoordinates(decoded, [-1, 0]), hash.length), // right
    encode(neighborCoordinates(decoded, [-1, 1]), hash.length), // topright
  ]
}

//-------
// bbox
//-------
function bbox(hash) {
  // Decode hash
  const decoded = decode(hash);

  // Return 4 coordinates of box
  return [
    [
      ensure_valid_lon(decoded.geometry.coordinates[0] - decoded.properties.longitude_error),
      ensure_valid_lat(decoded.geometry.coordinates[1] - decoded.properties.latitude_error),
    ],
    [
      ensure_valid_lon(decoded.geometry.coordinates[0] - decoded.properties.longitude_error),
      ensure_valid_lat(decoded.geometry.coordinates[1] + decoded.properties.latitude_error),
    ],
    [
      ensure_valid_lon(decoded.geometry.coordinates[0] + decoded.properties.longitude_error),
      ensure_valid_lat(decoded.geometry.coordinates[1] + decoded.properties.latitude_error),
    ],
    [
      ensure_valid_lon(decoded.geometry.coordinates[0] + decoded.properties.longitude_error),
      ensure_valid_lat(decoded.geometry.coordinates[1] - decoded.properties.latitude_error),
    ],
  ];
}


//-------
// Export module
//-------
module.exports = { encode, decode, neighbors, bbox };
