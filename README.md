[![Version](https://img.shields.io/npm/v/@jollie/geohash)](https://www.npmjs.com/package/@jollie/geohash)
[![Licence](https://img.shields.io/npm/l/@jollie/geohash)](https://en.wikipedia.org/wiki/MIT_license)
[![Build](https://img.shields.io/travis/thejellyfish/geohash)](https://travis-ci.org/github/thejellyfish/geohash)
[![Coverage](https://img.shields.io/codecov/c/github/thejellyfish/geohash)](https://codecov.io/gh/thejellyfish/geohash)
[![Downloads](https://img.shields.io/npm/dt/@jollie/geohash)](https://www.npmjs.com/package/@jollie/geohash)

# GeoHash encode/decode

More infos about GeoHash https://en.wikipedia.org/wiki/Geohash

GeoHash encode/decode with support of MongoDB, ElasticSearch and GeoJSON formats :

- GeoJSON https://en.wikipedia.org/wiki/GeoJSON
- MongoDB https://docs.mongodb.com/manual/reference/geojson/#point
- Elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/7.6/geo-point.html
- `{ longitude, latitude }` object commonly used in some packages

[See list of supported formats](#supported-formats)

_Inspired by https://github.com/sunng87/node-geohash._


### Install
```bash
yarn add @jollie/geohash
```
or
```bash
npm install @jollie/geohash
```
### Usage
```javascript
import GeoHash from '@jollie/geohash';

// ... coordinates example
const longitude = 4.2122126;
const latitude = 36.4511093;

// Encode a GeoJSON Point
GeoHash.encode({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [4.2122126, 36.4511093]
  },
}, 7);

// Encode a MongoDB GeoJSON Point
GeoHash.encode({
  type: 'Point',
  coordinates: [4.2122126, 36.4511093]
}, 7);

// Encode an Elasticsearch GeoPoint as an object
GeoHash.encode({ lon: 4.2122126, lat: 36.4511093 }, 7);

// Encode an Elasticsearch GeoPoint as string
GeoHash.encode('36.4511093,4.2122126', 7);

// Encode an Elasticsearch GeoPoint as an array
GeoHash.encode([4.2122126, 36.4511093], 7);

// Encode an Elasticsearch GeoPoint as WKT POINT primitive
GeoHash.encode('POINT (4.2122126 36.4511093)', 7);

// Encode { longitude, latitude } object
GeoHash.encode({ longitude: 4.2122126, latitude: 36.4511093 }, 7);

// Decode
GeoHash.decode('sn6zrge');
// Return
// {
//   type: 'Feature',
//   geometry: {
//     type: 'Point',
//     coordinates: [ 4.2125701904296875, 36.45057678222656 ]
//   },
//   properties: {
//     longitude_error: 0.0006866455078125,
//     latitude_error: 0.0006866455078125
//   }
// }

// Neightbors
GeoHash.neighbors('sndbuh');
// Return array of 8 neightbors n, ne, e, se, s, sw, w, nw 
// ['sndbuj','sndbum','sndbuk','sndbu7','sndbu5','sndbgg','sndbgu','sndbgv']

// Bbox
GeoHash.bbox('sndbuh');
// Return 4 coordinates of bbox

```
### Params

```javascript
GeoHash.encode(location, len);
```

| Prop       | Type                            |  Note                                                               |
|------------|---------------------------------|---------------------------------------------------------------------|
| `location` | `object` or `array` or `string` | [See list of supported formats](#supported-formats)                 |
| `len`      | `string`                        | geohash length<br >_(affect the precision of geohash)_              |

_Return a GeoHash of length chars_    
     
---
    

```javascript
GeoHash.decode(hash);
```

| Prop   | Type     |  Note             |
|--------|----------|-------------------|
| `hash` | `string` | Geohash to decode |

_Return a GeoJSON_

```
{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [lon, lat],  // Coordinates decoded
  },
  properties: {
   longitude_error,  // Longitude error
   latitude_error,   // Latitude error
  },
}
```

### Exception

Throw TypeError if bad location parameter

### <a name="supported-formats"></a>Supported formats

GeoJSON :
```
{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
}
```

GeoJSON Point (specially used in MongoDB) :
```
{
  type: 'Point',
  coordinates: [longitude, latitude]
}
```

Elasticsearch GeoPoint as an object :
```
{
  lon: longitude,
  lat: latitude,
}
```

Elasticsearch GeoPoint as string :
```
'latitude,longitude'
```

Elasticsearch GeoPoint as array :
```
[longitude, latitude]
```

Elasticsearch GeoPoint as WKT POINT primitive :
```
'POINT (longitude,latitude)'
```

object :
```
{
  longitude,
  latitude,
}
```
