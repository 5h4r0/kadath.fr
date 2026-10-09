'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { archiveClientAction, createClientAction, updateClientAction } from '@/lib/actions/clients'

interface ClientFormProps {
  initial?: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string
    phone: string | null
    siret: string | null
    address: string | null
    activity: string | null
    description: string | null
    notes: string | null
    source: string | null
    status: string
  }
}

const INPUT_CLASS =
  'w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden'

const LABEL_CLASS = 'text-xs text-[#666666]'

export function ClientForm({ initial }: ClientFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState(initial?.first_name ?? '')
  const [lastName, setLastName] = useState(initial?.last_name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [siret, setSiret] = useState(initial?.siret ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [activity, setActivity] = useState(initial?.activity ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [source, setSource] = useState(initial?.source ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'prospect')

  function buildPayload() {
    return {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      siret,
      address,
      activity,
      description,
      notes,
      source,
      status,
    }
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = initial
        ? await updateClientAction(initial.id, buildPayload())
        : await createClientAction(buildPayload())
      if (result?.error) setError(result.error)
    })
  }

  function handleArchive() {
    setError(null)
    startTransition(async () => {
      if (!initial) return
      const result = await archiveClientAction(initial.id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-5">
      {/* Section Identité */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL_CLASS} htmlFor="first_name">
              Prénom
            </label>
            <input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1.5">
            <label className={LABEL_CLASS} htmlFor="last_name">
              Nom
            </label>
            <input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="email">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="phone">
            Téléphone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="siret">
            SIRET
          </label>
          <input
            id="siret"
            type="text"
            value={siret}
            onChange={(e) => setSiret(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="address">
            Adresse
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="activity">
            Activité
          </label>
          <input
            id="activity"
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <hr className="border-[#333333]" />

      {/* Section Interne (admin) */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className={LABEL_CLASS} htmlFor="notes">
            Notes internes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL_CLASS} htmlFor="source">
              Source
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">—</option>
              <option value="referral">Referral</option>
              <option value="portfolio">Portfolio</option>
              <option value="linkedin">LinkedIn</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={LABEL_CLASS} htmlFor="status">
              Statut
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="prospect">Prospect</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-sm bg-tt-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-sm border border-[#333333] px-4 py-2 text-sm text-[#cccccc] hover:border-[#555555]"
          >
            Annuler
          </button>
        </div>

        {initial && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="rounded-sm border border-red-800 px-4 py-2 text-sm text-red-400 hover:border-red-600 disabled:opacity-50"
          >
            Archiver
          </button>
        )}
      </div>
    </div>
  )
}
