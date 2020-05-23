# GeoHash encode/decode

More infos about GeoHash https://en.wikipedia.org/wiki/Geohash   

For convenience in some of my codes, different location formats are supported :

- GeoJSON
- MongoDB https://docs.mongodb.com/manual/reference/geojson/#point   
- Elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/7.6/geo-point.html
- `{ longitude, latitude }` object from some packages

[See list of supported formats](#Supported formats)

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

// ... random location (*_*)
const longitude = 4.2122126;
const latitude = 36.4511093;

// Encode a GeoJSON Point
GeoHash.encode({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
}, 7);

// Encode a MongoDB GeoJSON Point
GeoHash.encode({
  type: 'Point',
  coordinates: [longitude, latitude]
}, 7);

// Encode an Elasticsearch GeoPoint as an object
GeoHash.encode({ lon: longitude, lat: latitude }, 7);

// Encode an Elasticsearch GeoPoint as string
GeoHash.encode(`${latitude},${longitude}`, 7);

// Encode an Elasticsearch GeoPoint as an array
GeoHash.encode([longitude, latitude], 7);

// Encode an Elasticsearch GeoPoint as WKT POINT primitive
GeoHash.encode(`POINT (${longitude} ${latitude})`, 7);

// Encode { longitude, latitude } object
GeoHash.encode({ longitude, latitude }, 7);
```

### Return values
```javascript
GeoHash.encode(location, len); // return the GeoHash of len chars

GeoHash.decode(hash); 
// return GeoJSON feature
// {
//    type: 'Feature',
//    geometry: {
//      type: 'Point',
//      coordinates: [lon, lat],
//    },
//    properties: {
//      longitude_error,
//      latitude_error,
//    },
//  }
```

### Exception

Throw TypeError if bad location parameter

### Supported formats

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
