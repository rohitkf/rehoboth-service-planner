import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ServicePlan } from '../types'
import { createDefaultBlocks } from '../constants/templates'

export function usePlans() {
  const [plans, setPlans] = useState<ServicePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('service_plans')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) setPlans(data as ServicePlan[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  async function createPlan(date: string): Promise<ServicePlan | null> {
    const { data: { user } } = await supabase.auth.getUser()
    const newPlan = {
      date,
      plan_data: { blocks: createDefaultBlocks() },
      created_by: user?.id ?? null,
    }
    const { data, error } = await supabase
      .from('service_plans')
      .insert(newPlan)
      .select()
      .single()
    if (error || !data) return null
    const plan = data as ServicePlan
    setPlans(prev => [plan, ...prev])
    return plan
  }

  async function updatePlan(plan: ServicePlan): Promise<void> {
    setSaving(true)
    const { error } = await supabase
      .from('service_plans')
      .update({ plan_data: plan.plan_data, updated_at: new Date().toISOString() })
      .eq('id', plan.id)
    if (!error) {
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...plan } : p))
    }
    setSaving(false)
  }

  async function deletePlan(id: string): Promise<void> {
    await supabase.from('service_plans').delete().eq('id', id)
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  function getPlanByDate(date: string): ServicePlan | undefined {
    return plans.find(p => p.date === date)
  }

  return { plans, loading, saving, createPlan, updatePlan, deletePlan, getPlanByDate, refetch: fetchPlans }
}
