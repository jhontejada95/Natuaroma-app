export type ShippingZone = 1 | 2 | 3 | 'no_coverage'

export const SHIPPING_COSTS: Record<1 | 2 | 3, number> = {
  1: 12000,
  2: 18000,
  3: 37000,
}

export const ZONE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Eje Cafetero y principales',
  2: 'Resto del país',
  3: 'Zonas apartadas',
}

export const DEPARTMENTS: { name: string; zone: ShippingZone }[] = [
  // Zona 1
  { name: 'Antioquia', zone: 1 },
  { name: 'Bogotá D.C.', zone: 1 },
  { name: 'Caldas', zone: 1 },
  { name: 'Cundinamarca', zone: 1 },
  { name: 'Huila', zone: 1 },
  { name: 'Quindío', zone: 1 },
  { name: 'Risaralda', zone: 1 },
  { name: 'Tolima', zone: 1 },
  { name: 'Valle del Cauca', zone: 1 },
  // Zona 2
  { name: 'Arauca', zone: 2 },
  { name: 'Atlántico', zone: 2 },
  { name: 'Bolívar', zone: 2 },
  { name: 'Boyacá', zone: 2 },
  { name: 'Caquetá', zone: 2 },
  { name: 'Casanare', zone: 2 },
  { name: 'Cauca', zone: 2 },
  { name: 'Cesar', zone: 2 },
  { name: 'Córdoba', zone: 2 },
  { name: 'La Guajira', zone: 2 },
  { name: 'Magdalena', zone: 2 },
  { name: 'Meta', zone: 2 },
  { name: 'Nariño', zone: 2 },
  { name: 'Norte de Santander', zone: 2 },
  { name: 'Santander', zone: 2 },
  { name: 'Sucre', zone: 2 },
  // Zona 3
  { name: 'Amazonas', zone: 3 },
  { name: 'Guainía', zone: 3 },
  { name: 'Guaviare', zone: 3 },
  { name: 'Putumayo', zone: 3 },
  { name: 'Vaupés', zone: 3 },
  { name: 'Vichada', zone: 3 },
  // Sin cobertura
  { name: 'Chocó', zone: 'no_coverage' },
  { name: 'San Andrés y Providencia', zone: 'no_coverage' },
]

export function getShippingCost(departamento: string): { zone: ShippingZone; cost: number } {
  const dept = DEPARTMENTS.find(d => d.name === departamento)
  if (!dept) return { zone: 1, cost: SHIPPING_COSTS[1] }
  if (dept.zone === 'no_coverage') return { zone: 'no_coverage', cost: 0 }
  return { zone: dept.zone, cost: SHIPPING_COSTS[dept.zone] }
}
