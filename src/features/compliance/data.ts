import type { BadgeTone } from '../../components/Badge'
import promoPhoto from '../../assets/images/promo-photo.png'

/** A promotion stays `open` until it is marked compliant or not compliant. */
export type PromotionStatus = 'open' | 'compliant' | 'not-compliant'

export const statusBadge: Record<PromotionStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Open', tone: 'info' },
  compliant: { label: 'Compliant', tone: 'success' },
  'not-compliant': { label: 'Not Compliant', tone: 'warning' },
}

export type Vendor = {
  id: string
  name: string
}

export type Promotion = {
  id: string
  vendorId: string
  /** `false` for promotions found in store that were not part of the location's order */
  ordered: boolean
  name: string
  offer: string
  status: PromotionStatus
  unitPrice: string
  orderedTier: string
  signage: string
}

export const location = {
  name: '10191 - Etahn’s Engine Exchange',
  period: 'January 2025',
  status: 'Open',
}

export const steps = ['Promotions', 'Programs', 'Custom Survey']

export const vendors: Vendor[] = [
  { id: 'coremark', name: 'CoreMark' },
  { id: 'pepsi', name: 'Pepsi' },
  { id: 'coca-cola', name: 'Coca-Cola' },
  { id: 'monster', name: 'Monster' },
  { id: 'red-bull', name: 'Red Bull' },
]

type PromotionSeed = [name: string, offer: string, status?: PromotionStatus, unitPrice?: string]

const seeds: Record<string, PromotionSeed[]> = {
  coremark: [
    ['2022 New Promotion', '2 for $12'],
    ['2022 New Promotion', '2 for $12', 'compliant'],
    ['2022 New Promotion', '2 for $12', 'not-compliant'],
    ['Spring Sale 2023', '1 for $1.5'],
    ['Holiday Special', '3 for $20'],
    ['Summer Clearance', '3 for $1.5'],
    ['Back to School Offer', '2 for $12'],
  ],
  pepsi: [
    ['Pepsi Zero Sugar 20oz', '2 for $4', 'compliant', '$2.49'],
    ['Mountain Dew Summer Push', '2 for $3.50', undefined, '$2.29'],
    ['Gatorade Game Day', '2 for $5', 'not-compliant', '$2.79'],
    ['Pepsi 12pk Weekend Deal', '2 for $15', undefined, '$8.99'],
    ['Starry Launch Promo', '1 for $1.99', undefined, '$2.49'],
    ['Bubly Sparkling 8pk', '2 for $9', undefined, '$5.49'],
  ],
  'coca-cola': [
    ['Coke Classic 20oz', '2 for $4', 'compliant', '$2.49'],
    ['Diet Coke Fridge Pack', '2 for $14', undefined, '$7.99'],
    ['Sprite Lemon-Lime Summer', '2 for $3.50', undefined, '$2.29'],
    ['Coke Zero Sugar Launch', '1 for $1.50', undefined, '$2.19'],
    ['Fanta Variety Pack', '3 for $10', 'not-compliant', '$3.99'],
    ['Smartwater 1L Promo', '2 for $5', undefined, '$2.99'],
    ['Powerade Mountain Berry', '2 for $3', undefined, '$1.99'],
    ['Minute Maid Lemonade', '2 for $4', undefined, '$2.29'],
  ],
  monster: [
    ['Monster Ultra 16oz', '2 for $5', undefined, '$2.99'],
    ['Monster Java Morning Deal', '2 for $6', 'compliant', '$3.49'],
    ['Reign Total Body Fuel', '2 for $5', undefined, '$2.99'],
    ['Monster Rehab Tea', '2 for $5.50', undefined, '$3.29'],
    ['Juice Monster Mango Loco', '3 for $7', undefined, '$2.99'],
  ],
}

export const promotions: Promotion[] = vendors.flatMap((vendor) =>
  (seeds[vendor.id] ?? []).map(([name, offer, status = 'open', unitPrice = '$10.10'], index) => ({
    id: `${vendor.id}-${index + 1}`,
    vendorId: vendor.id,
    ordered: true,
    name,
    offer,
    status,
    unitPrice,
    orderedTier: '2 for $13',
    signage: 'Dangler or',
  })),
)

/** Vendor promotions available to this location that were not ordered; auditors can add them if found in store. */
const catalogSeeds: [vendorId: string, name: string, offer: string, unitPrice: string][] = [
  ['coremark', 'Winter Warm-Up Bundle', '2 for $10', '$5.99'],
  ['coremark', 'Snack Attack Combo', '3 for $5', '$1.99'],
  ['pepsi', 'Mountain Dew Kickstart', '2 for $4', '$2.29'],
  ['pepsi', 'Rockstar Energy Duo', '2 for $5', '$2.99'],
  ['coca-cola', 'Coke Spiced Launch', '2 for $4.50', '$2.49'],
  ['coca-cola', 'BodyArmor Lyte 16oz', '2 for $4', '$2.29'],
  ['coca-cola', 'Topo Chico Hard Seltzer', '2 for $16', '$9.99'],
  ['monster', 'Monster Zero Ultra 4pk', '2 for $14', '$7.99'],
  ['red-bull', 'Red Bull Summer Edition', '2 for $6', '$3.49'],
  ['red-bull', 'Red Bull Sugarfree 12oz', '2 for $5.50', '$3.29'],
]

export const catalog: Promotion[] = catalogSeeds.map(([vendorId, name, offer, unitPrice], index) => ({
  id: `catalog-${index + 1}`,
  vendorId,
  ordered: false,
  name,
  offer,
  status: 'open',
  unitPrice,
  orderedTier: 'Not ordered',
  signage: 'Dangler or',
}))

export const pricingTiers = ['Market Price', '1 for $1', '1 for $1.50', '2 for $2.50', '2 for $2.50']

export const samplePhotos = [promoPhoto, promoPhoto]
