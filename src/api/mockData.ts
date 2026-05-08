import type { Line, Track, Train } from '../types'

export const seedTrains: Train[] = [
  { id: 101, weight: 820, train_cars: 14 },
  { id: 102, weight: 640, train_cars: 10 },
  { id: 103, weight: 910, train_cars: 16 },
]

export const seedLines: Line[] = [
  { id: '9f1e2a70-1f7f-4d69-96c1-7a225d8e1011', name: 'North Freight Loop' },
  { id: '1c090a43-9e7f-4c22-85d7-13af0a99a7d2', name: 'Harbor Connector' },
  { id: 'f75f794f-2ed1-497f-b9a8-913fc248d4f0', name: 'Mountain Grade' },
]

export const seedTracks: Track[] = [
  { id: 501, id_line: '9f1e2a70-1f7f-4d69-96c1-7a225d8e1011', length: 18.4, bending: 2.1, elevation: 210 },
  { id: 502, id_line: '9f1e2a70-1f7f-4d69-96c1-7a225d8e1011', length: 12.8, bending: 3.4, elevation: 244 },
  { id: 503, id_line: '1c090a43-9e7f-4c22-85d7-13af0a99a7d2', length: 9.6, bending: 1.2, elevation: 48 },
  { id: 504, id_line: '1c090a43-9e7f-4c22-85d7-13af0a99a7d2', length: 15.1, bending: 2.7, elevation: 64 },
  { id: 505, id_line: 'f75f794f-2ed1-497f-b9a8-913fc248d4f0', length: 22.3, bending: 4.8, elevation: 514 },
]
