// Ubicaciones predeterminadas de Costa Rica para el autocompletado
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  type: 'landmark' | 'transport' | 'commercial' | 'residential' | 'educational' | 'medical' | 'government';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const DEFAULT_LOCATIONS: Location[] = [
  // San José - Centro
  {
    id: 'loc-1',
    name: 'Parque Central de San José',
    address: 'Avenida Central, Calle Central',
    city: 'San José',
    province: 'San José',
    type: 'landmark',
    coordinates: { lat: 9.9336, lng: -84.0771 }
  },
  {
    id: 'loc-2',
    name: 'Teatro Nacional',
    address: 'Avenida 2, Calle 3',
    city: 'San José',
    province: 'San José',
    type: 'landmark',
    coordinates: { lat: 9.9334, lng: -84.0770 }
  },
  {
    id: 'loc-3',
    name: 'Museo Nacional',
    address: 'Calle 17, Avenida Central y Segunda',
    city: 'San José',
    province: 'San José',
    type: 'landmark',
    coordinates: { lat: 9.9331, lng: -84.0741 }
  },
  {
    id: 'loc-4',
    name: 'Mercado Central',
    address: 'Avenida Central, Calles 6 y 8',
    city: 'San José',
    province: 'San José',
    type: 'commercial',
    coordinates: { lat: 9.9344, lng: -84.0783 }
  },

  // Estaciones de transporte - San José
  {
    id: 'loc-5',
    name: 'Estación del Tren al Atlántico (San José)',
    address: 'Avenida 3, Calle 21',
    city: 'San José',
    province: 'San José',
    type: 'transport',
    coordinates: { lat: 9.9381, lng: -84.0735 }
  },
  {
    id: 'loc-6',
    name: 'Terminal de Buses Coca Cola',
    address: 'Avenida 1, Calle 16',
    city: 'San José',
    province: 'San José',
    type: 'transport',
    coordinates: { lat: 9.9361, lng: -84.0816 }
  },
  {
    id: 'loc-7',
    name: 'Parada de Buses Sabana-Cementerio',
    address: 'Paseo Colón',
    city: 'San José',
    province: 'San José',
    type: 'transport',
    coordinates: { lat: 9.9365, lng: -84.0942 }
  },

  // Zonas comerciales - San José
  {
    id: 'loc-8',
    name: 'Multiplaza Escazú',
    address: 'Autopista Próspero Fernández',
    city: 'Escazú',
    province: 'San José',
    type: 'commercial',
    coordinates: { lat: 9.9239, lng: -84.1313 }
  },
  {
    id: 'loc-9',
    name: 'Mall San Pedro',
    address: 'San Pedro de Montes de Oca',
    city: 'San Pedro',
    province: 'San José',
    type: 'commercial',
    coordinates: { lat: 9.9351, lng: -84.0518 }
  },
  {
    id: 'loc-10',
    name: 'Centro Comercial Lincoln Plaza',
    address: 'Moravia',
    city: 'Moravia',
    province: 'San José',
    type: 'commercial',
    coordinates: { lat: 9.9617, lng: -84.0506 }
  },

  // Universidades
  {
    id: 'loc-11',
    name: 'Universidad de Costa Rica (UCR)',
    address: 'San Pedro de Montes de Oca',
    city: 'San Pedro',
    province: 'San José',
    type: 'educational',
    coordinates: { lat: 9.9373, lng: -84.0514 }
  },
  {
    id: 'loc-12',
    name: 'Universidad Nacional (UNA)',
    address: 'Campus Omar Dengo, Heredia',
    city: 'Heredia',
    province: 'Heredia',
    type: 'educational',
    coordinates: { lat: 9.9988, lng: -84.1180 }
  },
  {
    id: 'loc-13',
    name: 'Instituto Tecnológico de Costa Rica (TEC)',
    address: 'Cartago',
    city: 'Cartago',
    province: 'Cartago',
    type: 'educational',
    coordinates: { lat: 9.8562, lng: -83.9120 }
  },

  // Hospitales
  {
    id: 'loc-14',
    name: 'Hospital San Juan de Dios',
    address: 'Paseo Colón, San José',
    city: 'San José',
    province: 'San José',
    type: 'medical',
    coordinates: { lat: 9.9366, lng: -84.0900 }
  },
  {
    id: 'loc-15',
    name: 'Hospital Calderón Guardia',
    address: 'Avenida 7, San José',
    city: 'San José',
    province: 'San José',
    type: 'medical',
    coordinates: { lat: 9.9435, lng: -84.0762 }
  },
  {
    id: 'loc-16',
    name: 'Hospital México',
    address: 'La Uruca, San José',
    city: 'San José',
    province: 'San José',
    type: 'medical',
    coordinates: { lat: 9.9558, lng: -84.1145 }
  },

  // Aeropuertos
  {
    id: 'loc-17',
    name: 'Aeropuerto Internacional Juan Santamaría',
    address: 'Alajuela',
    city: 'Alajuela',
    province: 'Alajuela',
    type: 'transport',
    coordinates: { lat: 9.9939, lng: -84.2088 }
  },

  // Heredia
  {
    id: 'loc-18',
    name: 'Parque Central de Heredia',
    address: 'Centro de Heredia',
    city: 'Heredia',
    province: 'Heredia',
    type: 'landmark',
    coordinates: { lat: 9.9989, lng: -84.1166 }
  },
  {
    id: 'loc-19',
    name: 'Mall Paseo de las Flores',
    address: 'Heredia',
    city: 'Heredia',
    province: 'Heredia',
    type: 'commercial',
    coordinates: { lat: 10.0025, lng: -84.1219 }
  },

  // Cartago
  {
    id: 'loc-20',
    name: 'Basílica de Nuestra Señora de los Ángeles',
    address: 'Cartago',
    city: 'Cartago',
    province: 'Cartago',
    type: 'landmark',
    coordinates: { lat: 9.8623, lng: -83.9186 }
  },
  {
    id: 'loc-21',
    name: 'Ruinas de Cartago',
    address: 'Centro de Cartago',
    city: 'Cartago',
    province: 'Cartago',
    type: 'landmark',
    coordinates: { lat: 9.8646, lng: -83.9197 }
  },

  // Alajuela
  {
    id: 'loc-22',
    name: 'Parque Juan Santamaría',
    address: 'Centro de Alajuela',
    city: 'Alajuela',
    province: 'Alajuela',
    type: 'landmark',
    coordinates: { lat: 10.0162, lng: -84.2118 }
  },
  {
    id: 'loc-23',
    name: 'City Mall Alajuela',
    address: 'Alajuela',
    city: 'Alajuela',
    province: 'Alajuela',
    type: 'commercial',
    coordinates: { lat: 10.0223, lng: -84.2057 }
  },

  // Gobierno
  {
    id: 'loc-24',
    name: 'Casa Presidencial',
    address: 'Zapote, San José',
    city: 'San José',
    province: 'San José',
    type: 'government',
    coordinates: { lat: 9.9227, lng: -84.0587 }
  },
  {
    id: 'loc-25',
    name: 'Asamblea Legislativa',
    address: 'Cuesta de Moras, San José',
    city: 'San José',
    province: 'San José',
    type: 'government',
    coordinates: { lat: 9.9333, lng: -84.0740 }
  },

  // Zonas residenciales populares
  {
    id: 'loc-26',
    name: 'Barrio Escalante',
    address: 'Barrio Escalante, San José',
    city: 'San José',
    province: 'San José',
    type: 'residential',
    coordinates: { lat: 9.9285, lng: -84.0681 }
  },
  {
    id: 'loc-27',
    name: 'Los Yoses',
    address: 'Los Yoses, San José',
    city: 'San José',
    province: 'San José',
    type: 'residential',
    coordinates: { lat: 9.9301, lng: -84.0624 }
  },
  {
    id: 'loc-28',
    name: 'Rohrmoser',
    address: 'Rohrmoser, San José',
    city: 'San José',
    province: 'San José',
    type: 'residential',
    coordinates: { lat: 9.9471, lng: -84.1057 }
  },
  {
    id: 'loc-29',
    name: 'Guadalupe',
    address: 'Guadalupe, San José',
    city: 'Guadalupe',
    province: 'San José',
    type: 'residential',
    coordinates: { lat: 9.9515, lng: -84.0572 }
  },
  {
    id: 'loc-30',
    name: 'Curridabat',
    address: 'Curridabat, San José',
    city: 'Curridabat',
    province: 'San José',
    type: 'residential',
    coordinates: { lat: 9.9104, lng: -84.0387 }
  }
];

// Función para buscar ubicaciones por texto
export function searchLocations(query: string): Location[] {
  if (!query || query.trim().length < 2) {
    return DEFAULT_LOCATIONS.slice(0, 10); // Retornar las primeras 10 si no hay búsqueda
  }

  const searchTerm = query.toLowerCase().trim();

  return DEFAULT_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchTerm) ||
    location.address.toLowerCase().includes(searchTerm) ||
    location.city.toLowerCase().includes(searchTerm) ||
    location.province.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limitar a 10 resultados
}

// Función para obtener una ubicación por ID
export function getLocationById(id: string): Location | undefined {
  return DEFAULT_LOCATIONS.find(loc => loc.id === id);
}

// Función para obtener ubicaciones por tipo
export function getLocationsByType(type: Location['type']): Location[] {
  return DEFAULT_LOCATIONS.filter(loc => loc.type === type);
}
