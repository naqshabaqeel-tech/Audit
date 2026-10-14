import { useEffect, useMemo, useState } from 'react'
import caretDownIcon from '../../assets/icons/caret-down.svg'
import { Badge, type BadgeTone } from '../../components/Badge'

export type ListGroup = {
  id: string
  name: string
}

export type ListItem = {
  id: string
  groupId: string
  title: string
  subtitle?: React.ReactNode
  /** Text matched by the search box, in addition to the title and group name */
  searchText: string
  badge: { label: string; tone: BadgeTone }
  /** Counts towards the group's "done/total" figure */
  done: boolean
}

type GroupedListPanelProps = {
  /** DOM id, referenced by the detail panel's "show list" toggle */
  id: string
  /** Plural noun used in the search placeholder and labels, e.g. "promotions" */
  noun: string
  groups: ListGroup[]
  items: ListItem[]
  selectedId: string
  onSelect: (id: string) => void
  /** Below `lg` the list is a slide-over drawer; at `lg` and up it is always shown inline. */
  open: boolean
  onClose: () => void
  groupIcon?: string
  /** Optional control shown beside the search box, e.g. an "Add" button */
  action?: React.ReactNode
}

export function GroupedListPanel({
  id,
  noun,
  groups,
  items,
  selectedId,
  onSelect,
  open,
  onClose,
  groupIcon,
  action,
}: GroupedListPanelProps) {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [prevSelectedId, setPrevSelectedId] = useState(selectedId)

  const selectedGroupId = items.find((item) => item.id === selectedId)?.groupId

  // Re-open the selected item's group whenever the selection moves (e.g. via "Save and Next")
  if (prevSelectedId !== selectedId) {
    setPrevSelectedId(selectedId)
    if (selectedGroupId && collapsed.has(selectedGroupId)) {
      setCollapsed((prev) => {
        const next = new Set(prev)
        next.delete(selectedGroupId)
        return next
      })
    }
  }

  useEffect(() => {
    document.getElementById(`${id}-item-${selectedId}`)?.scrollIntoView({ block: 'nearest' })
  }, [id, selectedId])

  const visibleGroups = useMemo(() => {
    const term = query.trim().toLowerCase()
    return groups
      .map((group) => {
        const all = items.filter((item) => item.groupId === group.id)
        const groupMatches = group.name.toLowerCase().includes(term)
        const matches = term
          ? all.filter((item) => groupMatches || `${item.title} ${item.searchText}`.toLowerCase().includes(term))
          : all
        return { group, items: matches, done: all.filter((item) => item.done).length, total: all.length }
      })
      .filter(({ items }) => items.length > 0)
  }, [groups, items, query])

  const toggleGroup = (groupId: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })

  return (
    <>
      <button
        type="button"
        aria-label={`Close ${noun}`}
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 z-10 bg-black/20 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        id={id}
        className={`absolute inset-y-0 left-0 z-20 flex h-full w-[min(353px,85%)] shrink-0 flex-col border-r border-gray-100 bg-white shadow-lg transition-[translate,visibility] duration-200 lg:visible lg:static lg:w-[353px] lg:translate-x-0 lg:shadow-none ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-4 py-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${items.length} ${noun}`}
            aria-label={`Search ${noun}`}
            className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
          />
          {action}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {visibleGroups.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-500">
              No {noun} match “{query}”
            </p>
          )}

          {visibleGroups.map(({ group, items: groupItems, done, total }) => {
            // While searching, show every matching group expanded
            const isCollapsed = !query && collapsed.has(group.id)
            const listId = `${id}-group-${group.id}`
            return (
              <section key={group.id} className="border-b border-gray-200 last:border-b-0">
                <h2 className="sticky top-0 z-[1] bg-gray-25">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={listId}
                    className="flex h-12 w-full cursor-pointer items-center gap-2 px-4 text-left"
                  >
                    {groupIcon && (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gray-100">
                        <img src={groupIcon} alt="" width={16} height={16} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">{group.name}</span>
                    <span className="text-xs font-medium text-gray-500">
                      {done}/{total}
                      <span className="sr-only"> done</span>
                    </span>
                    <img
                      src={caretDownIcon}
                      alt=""
                      width={12}
                      height={12}
                      className={`transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                    />
                  </button>
                </h2>

                {!isCollapsed && (
                  <ul id={listId} className="divide-y divide-gray-200 border-t border-gray-200">
                    {groupItems.map((item) => {
                      const isSelected = item.id === selectedId
                      return (
                        <li key={item.id} id={`${id}-item-${item.id}`} className="scroll-mt-12">
                          <button
                            type="button"
                            onClick={() => onSelect(item.id)}
                            aria-current={isSelected ? 'true' : undefined}
                            className={`flex w-full cursor-pointer items-start justify-between gap-2 p-4 text-left ${
                              isSelected ? 'bg-primary-50/50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                              <span className="truncate text-base font-medium text-gray-800">{item.title}</span>
                              {item.subtitle && <span className="truncate text-sm text-gray-500">{item.subtitle}</span>}
                            </span>
                            <Badge tone={item.badge.tone}>{item.badge.label}</Badge>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      </aside>
    </>
  )
}
