import { useEffect, useState } from 'react'
import { Sidebar } from '../../components/Sidebar'
import { useDesignVariation } from '../../components/useDesignVariation'
import { VariationToggle } from '../../components/VariationToggle'
import { AddPromotionDialog } from './AddPromotionDialog'
import { ComplianceSteps } from './ComplianceSteps'
import { catalog, promotions as initialPromotions, samplePhotos, steps, vendors, type Promotion } from './data'
import { LocationHeader } from './LocationHeader'
import { PromotionDetail, type PromotionAnswers } from './PromotionDetail'
import { PromotionList } from './PromotionList'
import { formatPrice, surveyCategories, surveyItems, type SurveyAnswer, type SurveyStatus } from './surveyData'
import { SurveyDetail } from './SurveyDetail'
import { SurveyList } from './SurveyList'

const emptySurveyAnswer: SurveyAnswer = { price: '', description: '' }

export function ComplianceDetails() {
  const { variation, toggle: toggleVariation } = useDesignVariation()
  const [promotions, setPromotions] = useState(initialPromotions)
  const [selectedId, setSelectedId] = useState('coremark-4')
  const [activeStep, setActiveStep] = useState(0)
  const [listOpen, setListOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<string, PromotionAnswers>>({
    'coremark-4': { photos: samplePhotos },
  })
  const [surveySelectedId, setSurveySelectedId] = useState(surveyItems[0].id)
  // Drafts hold what's being typed; saved holds what "Save and Next" has committed
  const [surveyDrafts, setSurveyDrafts] = useState<Record<string, SurveyAnswer>>({})
  const [surveySaved, setSurveySaved] = useState<Record<string, SurveyAnswer>>({})

  const selectedIndex = promotions.findIndex((p) => p.id === selectedId)
  const selected = promotions[selectedIndex]
  const selectedVendor = vendors.find((v) => v.id === selected.vendorId)
  // Promotions already marked in the data start with that status selected
  const selectedAnswers = answers[selectedId] ?? {
    photos: [],
    status: selected.status === 'open' ? undefined : selected.status,
  }
  const allMarked = promotions.every((p) => p.status === 'compliant' || p.status === 'not-compliant')

  const surveyIndex = surveyItems.findIndex((item) => item.id === surveySelectedId)
  const surveyItem = surveyItems[surveyIndex]
  const surveyAnswer = surveyDrafts[surveySelectedId] ?? surveySaved[surveySelectedId] ?? emptySurveyAnswer
  const surveyStatuses = Object.fromEntries(
    surveyItems.map((item): [string, SurveyStatus] => [item.id, surveySaved[item.id] ? 'collected' : 'open']),
  )
  const surveyPrices = Object.fromEntries(Object.entries(surveySaved).map(([id, answer]) => [id, answer.price]))
  const surveyCollected = Object.keys(surveySaved).length
  const surveyComplete = surveyCollected === surveyItems.length

  useEffect(() => {
    if (!listOpen) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setListOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [listOpen])

  const available = catalog.filter((c) => !promotions.some((p) => p.id === c.id))

  // Keep the flat list in vendor order so "Save and Next" and "Promotion X of Y" match the grouped list
  const vendorOrder = (p: Promotion) => vendors.findIndex((v) => v.id === p.vendorId)

  const addPromotions = (ids: string[]) => {
    const added = catalog.filter((c) => ids.includes(c.id))
    setPromotions((list) => [...list, ...added].sort((a, b) => vendorOrder(a) - vendorOrder(b)))
    setSelectedId(added[0].id)
    setAddOpen(false)
    setListOpen(false)
  }

  const removePromotion = () => {
    const remaining = promotions.filter((p) => p.id !== selectedId)
    setPromotions(remaining)
    setSelectedId((remaining[selectedIndex] ?? remaining[selectedIndex - 1]).id)
    setAnswers(({ [selectedId]: _removed, ...rest }) => rest)
  }

  const selectSurveyItem = (id: string) => {
    setSurveySelectedId(id)
    setListOpen(false)
  }

  const saveSurveyAndNext = () => {
    const saved = { ...surveySaved, [surveySelectedId]: { ...surveyAnswer, price: formatPrice(surveyAnswer.price) } }
    setSurveySaved(saved)
    // Move on to the next item, wrapping round to any that are still open
    const next =
      surveyItems.slice(surveyIndex + 1).find((item) => !saved[item.id]) ??
      surveyItems.find((item) => !saved[item.id])
    if (next) setSurveySelectedId(next.id)
  }

  const selectPromotion = (id: string) => {
    setSelectedId(id)
    setListOpen(false)
  }

  const saveAndNext = () => {
    if (selectedAnswers.status) {
      setPromotions((list) =>
        list.map((p) => (p.id === selectedId ? { ...p, status: selectedAnswers.status! } : p)),
      )
    }
    const next = promotions[selectedIndex + 1]
    if (next) setSelectedId(next.id)
    else setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  return (
    <div className="flex h-dvh bg-white">
      <Sidebar
        activeItem="Locations"
        footer={<VariationToggle variation={variation} onToggle={toggleVariation} />}
      />
      <main className="flex min-w-0 flex-1 flex-col p-2">
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-outline bg-white">
          <LocationHeader canComplete={allMarked && surveyComplete} />
          <ComplianceSteps activeStep={activeStep} completedSteps={1} onStepChange={setActiveStep} />
          <div className="relative flex min-h-0 flex-1">
            {activeStep === 0 && (
              <>
                <PromotionList
                  vendors={vendors}
                  promotions={promotions}
                  selectedId={selectedId}
                  onSelect={selectPromotion}
                  open={listOpen}
                  onClose={() => setListOpen(false)}
                  onAddPromotion={() => setAddOpen(true)}
                  accordion={variation !== 'B'}
                  quiet={variation === 'C'}
                />
                <PromotionDetail
                  key={selectedId}
                  promotion={selected}
                  vendorName={selectedVendor?.name}
                  position={selectedIndex + 1}
                  total={promotions.length}
                  answers={selectedAnswers}
                  onChange={(value) => setAnswers((all) => ({ ...all, [selectedId]: value }))}
                  onSaveAndNext={saveAndNext}
                  listOpen={listOpen}
                  onOpenList={() => setListOpen(true)}
                  onRemove={selected.ordered ? undefined : removePromotion}
                  variation={variation}
                />
              </>
            )}
            {activeStep === 1 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-1 px-8 text-center">
                <h1 className="text-base font-semibold text-gray-800">Programs</h1>
                <p className="text-sm text-gray-500">This step hasn’t been designed yet.</p>
              </div>
            )}
            {activeStep === 2 && (
              <>
                <SurveyList
                  statuses={surveyStatuses}
                  prices={surveyPrices}
                  selectedId={surveySelectedId}
                  onSelect={selectSurveyItem}
                  open={listOpen}
                  onClose={() => setListOpen(false)}
                />
                <SurveyDetail
                  key={surveySelectedId}
                  item={surveyItem}
                  categoryName={surveyCategories.find((c) => c.id === surveyItem.categoryId)?.name ?? ''}
                  position={surveyIndex + 1}
                  total={surveyItems.length}
                  collected={surveyCollected}
                  answer={surveyAnswer}
                  onChange={(answer) => setSurveyDrafts((all) => ({ ...all, [surveySelectedId]: answer }))}
                  onSaveAndNext={saveSurveyAndNext}
                  listOpen={listOpen}
                  onOpenList={() => setListOpen(true)}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <AddPromotionDialog
        open={addOpen}
        vendors={vendors}
        available={available}
        onAdd={addPromotions}
        onClose={() => setAddOpen(false)}
      />
    </div>
  )
}
