import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { usePlans } from './hooks/usePlans'
import { usePrintTrigger } from './hooks/usePrintTrigger'
import { LoginPage } from './components/auth/LoginPage'
import { AppShell } from './components/layout/AppShell'
import { PlanSelector } from './components/plan/PlanSelector'
import { PlanEditor } from './components/plan/PlanEditor'
import { PlanPrintView } from './components/plan/PlanPrintView'
import type { ServicePlan } from './types'

const DEBOUNCE_MS = 1500

export function App() {
  const { session, profile, loading: authLoading, isAdmin, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth()
  const { plans, loading: plansLoading, saving, createPlan, updatePlan, deletePlan } = usePlans()
  const { handlePrint } = usePrintTrigger()
  const [activePlan, setActivePlan] = useState<ServicePlan | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-select the most recent plan
  useEffect(() => {
    if (!activePlan && plans.length > 0) {
      setActivePlan(plans[0]!)
    }
  }, [plans, activePlan])

  // Debounced save on plan change
  function handlePlanUpdate(updated: ServicePlan) {
    setActivePlan(updated)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updatePlan(updated)
    }, DEBOUNCE_MS)
  }

  async function handleCreatePlan(date: string) {
    const plan = await createPlan(date)
    if (plan) setActivePlan(plan)
  }

  function handleDeletePlan(id: string) {
    deletePlan(id)
    if (activePlan?.id === id) {
      const remaining = plans.filter(p => p.id !== id)
      setActivePlan(remaining[0] ?? null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white text-sm animate-pulse">Loading…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <LoginPage
        onGoogleSignIn={signInWithGoogle}
        onEmailSignIn={signInWithEmail}
        onEmailSignUp={signUpWithEmail}
      />
    )
  }

  return (
    <>
      <AppShell profile={profile} onSignOut={signOut} onPrint={handlePrint} saving={saving}>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <PlanSelector
              plans={plans}
              activePlanId={activePlan?.id ?? null}
              isAdmin={isAdmin}
              onSelect={setActivePlan}
              onCreate={handleCreatePlan}
              onDelete={handleDeletePlan}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {plansLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-16 text-center">
                <div className="text-gray-400 text-sm animate-pulse">Loading plans…</div>
              </div>
            ) : activePlan ? (
              <PlanEditor
                plan={activePlan}
                isAdmin={isAdmin}
                onUpdate={handlePlanUpdate}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-16 text-center">
                <p className="text-gray-400 text-sm">
                  {isAdmin ? 'Select a plan or create a new one.' : 'No plan selected.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </AppShell>

      {/* Print view — hidden on screen */}
      {activePlan && <PlanPrintView plan={activePlan} />}
    </>
  )
}
