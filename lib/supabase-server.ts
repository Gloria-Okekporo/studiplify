import { cookies } from 'next/headers'
import {
  createServerComponentClient,
  createServerActionClient,
} from '@supabase/auth-helpers-nextjs'

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies })
}

export const createActionSupabaseClient = () => {
  return createServerActionClient({ cookies })
}