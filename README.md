![Version](https://img.shields.io/npm/v/@thejellyfish/geohash)
![Licence](https://img.shields.io/npm/l/@thejellyfish/geohash)
![Build](https://img.shields.io/travis/thejellyfish/geohash)
![Coverage](https://img.shields.io/codecov/c/github/thejellyfish/geohash)
![Downloads](https://img.shields.io/npm/dt/@thejellyfish/geohash)

# GeoHash encode/decode

More infos about GeoHash https://en.wikipedia.org/wiki/Geohash   

For convenience in some of my codes, different location formats are supported :

- GeoJSON
- MongoDB https://docs.mongodb.com/manual/reference/geojson/#point   
- Elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/7.6/geo-point.html
- `{ longitude, latitude }` object from some packages

[See list of supported formats](#supported-formats)

_Inspired from https://github.com/sunng87/node-geohash._  


### Install
```bash
yarn add @thejellyfish/geohash
```
or
```bash
npm install @thejellyfish/geohash
```
### Usage
```javascript
import GeoHash from '@thejellyfish/geohash';

// ... coordinates in example
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

```

### Return values
```javascript
GeoHash.encode(location, len);
// Return the GeoHash of len chars
```

```javascript
GeoHash.decode(hash); 
// Return a GeoJSON :
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
[latitude, longitude]
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
