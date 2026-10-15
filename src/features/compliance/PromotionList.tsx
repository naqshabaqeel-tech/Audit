import plusIcon from '../../assets/icons/plus.svg'
import storefrontIcon from '../../assets/icons/storefront-sm.svg'
import { Button } from '../../components/Button'
import { statusBadge, type Promotion, type Vendor } from './data'
import { GroupedListPanel, type ListItem } from './GroupedListPanel'

type PromotionListProps = {
  vendors: Vendor[]
  promotions: Promotion[]
  selectedId: string
  onSelect: (id: string) => void
  open: boolean
  onClose: () => void
  onAddPromotion: () => void
  accordion?: boolean
  /** Quieter list: smaller titles and no badge for promotions that are still open */
  quiet?: boolean
}

export function PromotionList({ vendors, promotions, onAddPromotion, quiet = false, ...panel }: PromotionListProps) {
  const items: ListItem[] = promotions.map((promotion) => ({
    id: promotion.id,
    groupId: promotion.vendorId,
    title: promotion.name,
    subtitle: promotion.ordered ? undefined : <span className="font-medium text-gray-700">Not ordered</span>,
    searchText: promotion.offer,
    badge: quiet && promotion.status === 'open' ? undefined : statusBadge[promotion.status],
    done: promotion.status !== 'open',
  }))

  return (
    <GroupedListPanel
      id="promotion-list"
      noun="promotions"
      groups={vendors}
      items={items}
      groupIcon={storefrontIcon}
      dense={quiet}
      action={
        <Button variant="secondary" onClick={onAddPromotion} className="h-9" title="Add a promotion that wasn’t ordered">
          <img src={plusIcon} alt="" width={14} height={14} />
          Add
        </Button>
      }
      {...panel}
    />
  )
}
