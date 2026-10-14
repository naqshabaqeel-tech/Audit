import { GroupedListPanel, type ListItem } from './GroupedListPanel'
import { surveyCategories, surveyItems, surveyStatusBadge, type SurveyStatus } from './surveyData'

type SurveyListProps = {
  statuses: Record<string, SurveyStatus>
  /** Saved prices, shown in place of the ask once an item is collected */
  prices: Record<string, string>
  selectedId: string
  onSelect: (id: string) => void
  open: boolean
  onClose: () => void
}

export function SurveyList({ statuses, prices, ...panel }: SurveyListProps) {
  const items: ListItem[] = surveyItems.map((item) => {
    const status = statuses[item.id] ?? 'open'
    return {
      id: item.id,
      groupId: item.categoryId,
      title: item.name,
      subtitle: status === 'collected' ? `$${prices[item.id]} · ${item.ask}` : item.ask,
      searchText: item.ask,
      badge: surveyStatusBadge[status],
      done: status === 'collected',
    }
  })

  return <GroupedListPanel id="survey-list" noun="items" groups={surveyCategories} items={items} {...panel} />
}
