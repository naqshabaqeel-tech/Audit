import storefrontIcon from '../../assets/icons/storefront-sm.svg'
import { statusBadge, type PromotionStatus, type Vendor } from './data'
import { GroupedListPanel, type ListItem } from './GroupedListPanel'
import { programs } from './programData'

type ProgramListProps = {
  vendors: Vendor[]
  statuses: Record<string, PromotionStatus>
  selectedId: string
  onSelect: (id: string) => void
  open: boolean
  onClose: () => void
}

export function ProgramList({ vendors, statuses, ...panel }: ProgramListProps) {
  const items: ListItem[] = programs.map((program) => {
    const status = statuses[program.id] ?? 'open'
    return {
      id: program.id,
      groupId: program.vendorId,
      title: program.name,
      searchText: '',
      // Only marked programs get a badge, matching the promotion list
      badge: status === 'open' ? undefined : statusBadge[status],
      done: status !== 'open',
    }
  })

  return (
    <GroupedListPanel
      id="program-list"
      noun="programs"
      groups={vendors.filter((vendor) => programs.some((program) => program.vendorId === vendor.id))}
      items={items}
      groupIcon={storefrontIcon}
      dense
      accordion
      {...panel}
    />
  )
}
