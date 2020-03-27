const { encode, decode } = require('./index');

// Init a random location (*_*)
const longitude = 4.2122126;
const latitude = 36.4511093;

// Get the geohash
const hash = encode({ longitude, latitude }, 7);

// Start tests ...
describe('Encode location', () => {
  // GeoJSON Point
  it('expect equal when GeoJSON Point', () => {
    expect(encode({
      type: 'Point',
      coordinates: [longitude, latitude]
    }, 7)).toBe(hash);
  });

  // GeoJSON Feature
  it('expect equal when GeoJSON Feature', () => {
    expect(encode({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
    }, 7)).toBe(hash);
  });

  // ES GeoPoint as an object
  it('expect equal when ES GeoPoint as an object', () => {
    expect(encode({
      lon: longitude,
      lat: latitude,
    }, 7)).toBe(hash);
  });

  // ES GeoPoint as string
  it('expect equal when ES GeoPoint as string', () => expect(encode(`${latitude},${longitude}`, 7)).toBe(hash));

  // ES GeoPoint as an array
  it('expect equal when ES GeoPoint as an array', () => expect(encode([longitude, latitude], 7)).toBe(hash));

  // ES GeoPoint as WKT POINT primitive
  it('expect equal when ES GeoPoint as WKT POINT primitive', () => expect(encode(`POINT (${longitude} ${latitude})`, 7)).toBe(hash));

  // { longitude, latitude } object
  it('expect equal when { longitude, latitude } object', () => expect(encode({ longitude, latitude }, 7)).toBe(hash));

  // Bad location
  it('expect exception when bad string location', () => expect(() => encode('Boom !')).toThrow(Error));
  it('expect exception when bad object location', () => expect(() => encode({})).toThrow(Error));
  it('expect exception when bad GeoJSON location', () => expect(() => encode({ type: 'Feature' })).toThrow(Error));
  it('expect exception when bad GeoJSON Point location', () => expect(() => encode({ type: 'Point' })).toThrow(Error));
});

describe('Decode location', () => {
  it('expect GeoJSON Point', () => expect(decode(hash)).toMatchObject(
    expect.objectContaining({
      longitude: expect.any(Number),
      latitude: expect.any(Number),
      error: {
        longitude: expect.any(Number),
        latitude: expect.any(Number),
      },
    }),
  ));
});
