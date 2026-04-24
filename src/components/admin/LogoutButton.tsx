'use client'

import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton({ locale }: { locale: string }) {
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = `/${locale}/auth/login`
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-[#cccccc] transition-colors hover:text-red-400"
    >
      <LogOut size={16} />
      Se déconnecter
    </button>
  )
}
