'use client'

import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    // NEXT_PUBLIC_MANAGE_URL=http://localhost:3000/manage (local)
    // En prod Firebase : NEXT_PUBLIC_MANAGE_URL=https://manage.kadath.fr
    window.location.href = process.env.NEXT_PUBLIC_MANAGE_URL ?? '/manage'
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
