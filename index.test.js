const { encode, decode } = require('./index');

// Init a random location (*_*)
const longitude = 4.2122126;
const latitude = 36.4511093;

// Get the geohash
const hash = encode({ longitude, latitude }, 7);

// Start tests ...
describe('Encode location', () => {
  // GeoJSON Point
  it('expect equal when GeoJSON Point', async () => {
    expect(encode({
      type: 'Point',
      coordinates: [longitude, latitude]
    }, 7)).toBe(hash);
  });

  // ES GeoPoint as an object
  it('expect equal when ES GeoPoint as an object', async () => {
    expect(encode({
      lon: longitude,
      lat: latitude,
    }, 7)).toBe(hash);
  });

  // ES GeoPoint as string
  it('expect equal when ES GeoPoint as string', async () => expect(encode(`${latitude},${longitude}`, 7)).toBe(hash));

  // ES GeoPoint as an array
  it('expect equal when ES GeoPoint as an array', async () => expect(encode([longitude, latitude], 7)).toBe(hash));

  // ES GeoPoint as WKT POINT primitive
  it('expect equal when ES GeoPoint as WKT POINT primitive', async () => expect(encode(`POINT (${longitude} ${latitude})`, 7)).toBe(hash));

  // { longitude, latitude } object
  it('expect equal when { longitude, latitude } object', async () => expect(encode({ longitude, latitude }, 7)).toBe(hash));
});

describe('Decode location', () => {
  it('expect GeoJSON Point', async () => expect(decode(hash)).toMatchObject(
    expect.objectContaining({
      type: 'Point',
      coordinates: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    }),
  ));
});
