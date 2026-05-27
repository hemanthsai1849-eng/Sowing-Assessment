// Sample GeoJSON for Andhra Pradesh District Boundaries
export const districtBoundaries: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 1, name: 'East Godavari', mandals: 12 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.5, 17.0],
            [82.5, 17.0],
            [82.5, 16.0],
            [81.5, 16.0],
            [81.5, 17.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 2, name: 'West Godavari', mandals: 10 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.0, 17.0],
            [81.5, 17.0],
            [81.5, 16.0],
            [81.0, 16.0],
            [81.0, 17.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 3, name: 'Krishna', mandals: 8 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.5, 16.0],
            [81.5, 16.0],
            [81.5, 15.0],
            [80.5, 15.0],
            [80.5, 16.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 4, name: 'Guntur', mandals: 14 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [79.5, 16.0],
            [80.5, 16.0],
            [80.5, 15.0],
            [79.5, 15.0],
            [79.5, 16.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 5, name: 'Prakasam', mandals: 12 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [79.0, 15.0],
            [80.0, 15.0],
            [80.0, 14.0],
            [79.0, 14.0],
            [79.0, 15.0],
          ],
        ],
      },
    },
  ],
};
