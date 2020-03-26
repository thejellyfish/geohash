# GeoHash encode/decode

Largely inspired from https://github.com/sunng87/node-geohash.   
More infos about GeoHash https://en.wikipedia.org/wiki/Geohash   

For convenience in some of my codes, allow differents format of location to encode/decode GeoHash

- GeoJson of type 'Point' also used by MongoDB https://docs.mongodb.com/manual/reference/geojson/#point   
- GeoPoint from elasticsearch https://www.elastic.co/guide/en/elasticsearch/reference/7.6/geo-point.html
- { longitude, latitude} object from some react native location packages

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
      type: 'Point',
      coordinates: [longitude, latitude]
    }, 7);

    // Encode an Elasticsearch GeoPoint as an object
    GeoHash.encode({
      lon: longitude,
      lat: latitude,
    }, 7);

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
    GeoHash.encode(location, len) // return the GeoHash of len chars
    GeoHash.decode(hash) // return GeoJson { type: 'Point', coordinates: [lon, lat] }
```
