// Sample GeoJSON for Krishna and Godavari River Basins
export const krishnaBasin: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Krishna River Basin',
        type: 'basin',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.5, 18.0],
            [82.0, 18.0],
            [82.0, 14.5],
            [75.5, 14.5],
            [75.5, 18.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Krishna River',
        type: 'river',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.6, 17.8],
          [76.0, 17.5],
          [76.5, 17.2],
          [77.0, 16.8],
          [77.5, 16.5],
          [78.0, 16.2],
          [78.5, 15.8],
          [79.0, 15.5],
          [79.5, 15.2],
          [80.0, 14.8],
          [80.5, 14.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Tungabhadra Tributary',
        type: 'tributary',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.2, 15.5],
          [77.0, 16.0],
          [77.8, 16.5],
          [78.5, 16.8],
        ],
      },
    },
  ],
};

export const godavariBasin: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Godavari River Basin',
        type: 'basin',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.5, 19.0],
            [83.0, 19.0],
            [83.0, 15.5],
            [76.5, 15.5],
            [76.5, 19.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Godavari River',
        type: 'river',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.8, 18.8],
          [77.2, 18.5],
          [77.8, 18.2],
          [78.5, 17.8],
          [79.2, 17.5],
          [80.0, 17.2],
          [80.8, 16.8],
          [81.5, 16.5],
          [82.2, 16.2],
          [82.8, 15.8],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Pranahita Tributary',
        type: 'tributary',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [78.0, 18.5],
          [79.0, 18.0],
          [80.0, 17.5],
          [80.8, 17.0],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Indravati Tributary',
        type: 'tributary',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [81.5, 18.8],
          [81.0, 18.0],
          [80.5, 17.5],
          [80.2, 17.0],
        ],
      },
    },
  ],
};
