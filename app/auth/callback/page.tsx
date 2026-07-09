'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
export default function AuthCallback() {
  const router = useRouter()
  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/dashboard' : '/auth/login')
    })
  }, [router])
  return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
}
