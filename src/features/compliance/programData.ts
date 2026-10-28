import type { MarkStatus } from './StatusSelect'

export type Program = {
  id: string
  vendorId: string
  name: string
}

/** What the auditor records for a program: photos as evidence, and whether it's compliant */
export type ProgramAnswers = {
  photos: string[]
  status?: MarkStatus
}

const programSeeds: [vendorId: string, name: string][] = [
  ['coremark', 'Cooler Door Program'],
  ['coremark', 'Endcap Display Program'],
  ['pepsi', 'Pepsi Rewards Cooler'],
  ['pepsi', 'Frito-Lay Rack Program'],
  ['coca-cola', 'Front Register Cooler'],
  ['coca-cola', 'Coke Freestyle Placement'],
  ['coca-cola', 'Dasani Water Rack'],
  ['monster', 'Monster Energy Cooler'],
]

export const programs: Program[] = programSeeds.map(([vendorId, name], index) => ({
  id: `program-${index + 1}`,
  vendorId,
  name,
}))
