const { encode, decode, neighbors } = require('./index');

// Init a random location (*_*)
const longitude = 36.716667;
const latitude = 4.05;

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
  it('expect TypeError with undefined', () => expect(() => encode()).toThrow(TypeError));
  it('expect TypeError with bad string location', () => expect(() => encode('Boom !')).toThrow(TypeError));
  it('expect TypeError with bad object location', () => expect(() => encode({})).toThrow(TypeError));
  it('expect TypeError with bad GeoJSON location', () => expect(() => encode({ type: 'Feature' })).toThrow(TypeError));
  it('expect TypeError with bad GeoJSON Point location', () => expect(() => encode({ type: 'Point' })).toThrow(TypeError));
});

describe('Decode location', () => {
  it('expect location props', () => expect(decode(hash)).toMatchObject(
    expect.objectContaining({
      type: 'Feature',
      geometry: expect.objectContaining({
        type: 'Point',
        coordinates: expect.arrayContaining([expect.any(Number)]),
      })
    }),
  ));
});

describe('Geoash neighbors', () => {
  it('expect neighbors props', () => {
    const expected = [
      'sndbuj',
      'sndbum',
      'sndbuk',
      'sndbu7',
      'sndbu5',
      'sndbgg',
      'sndbgu',
      'sndbgv',
    ];

    expect(neighbors('sndbuh')).toStrictEqual(expected);
  });
});
