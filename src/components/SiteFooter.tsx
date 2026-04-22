import { fetchFooterSettings } from '@/lib/settings/fetchFooterSettings'
import Link from 'next/link'

interface SiteFooterProps {
  locale: string
}

export default async function SiteFooter({ locale }: SiteFooterProps) {
  const settings = await fetchFooterSettings()
  const copyright = settings.copyright[locale as 'fr' | 'en'] ?? settings.copyright.fr

  return (
    <footer className="border-t border-white/10 bg-tt-bg font-grotesk font-light">
      <div className="mx-auto max-w-240 px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* Logo + réseaux */}
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-logo.svg"
              alt="thinktwice"
              width={160}
              height={28}
              className="w-40"
            />
            <div className="flex items-center gap-4 text-tt-accent">
              <a
                href="https://sokol.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <span className="sr-only">sokol.fr</span>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 191 191"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <g
                    transform="translate(0.000000,191.000000) scale(0.100000,-0.100000)"
                    stroke="none"
                  >
                    <path
                      d="M990 1630 l0 -40 -50 0 -50 0 0 -40 0 -40 50 0 50 0 0 -45 0 -44 -52
                  27 c-40 21 -70 28 -129 31 -79 3 -80 3 -194 -56 -11 -6 -51 -18 -90 -27 -281
                  -67 -377 -385 -195 -644 28 -40 53 -86 57 -102 3 -17 9 -33 14 -36 5 -3 41 2
                  81 10 322 66 765 66 1083 0 94 -19 92 -19 100 25 3 21 24 62 47 92 53 71 72
                  110 93 194 53 216 -91 429 -321 471 -21 4 -51 15 -65 25 -80 56 -212 66 -297
                  21 -23 -12 -47 -22 -52 -22 -6 0 -10 18 -10 40 l0 40 50 0 50 0 0 40 0 40 -50
                  0 -50 0 0 40 c0 39 -1 40 -35 40 -34 0 -35 -1 -35 -40z m-105 -239 c22 -10 55
                  -32 73 -49 l32 -30 0 -189 0 -189 -29 -22 c-38 -28 -56 -82 -42 -124 6 -17 10
                  -32 9 -33 -2 -1 -52 -5 -113 -8 l-110 -7 -39 53 c-79 108 -116 207 -116 314 0
                  202 180 355 335 284z m451 0 c51 -23 106 -79 136 -139 20 -41 23 -61 23 -157
                  -1 -98 -4 -116 -28 -169 -15 -32 -48 -88 -73 -123 l-47 -66 -60 7 c-33 3 -85
                  6 -115 6 -48 0 -53 2 -46 18 4 9 9 34 12 55 4 34 0 42 -37 77 l-41 39 0 185 0
                  184 45 40 c71 62 154 78 231 43z m-830 -126 c-12 -30 -26 -53 -32 -51 -7 3
                  -24 -8 -38 -23 -25 -26 -25 -29 -10 -42 14 -11 18 -11 29 4 7 9 14 17 16 17 2
                  0 5 -35 5 -77 2 -112 43 -231 110 -319 13 -17 24 -35 24 -40 0 -5 -33 -15 -72
                  -21 l-73 -12 -23 27 c-154 177 -172 373 -48 510 31 34 105 82 127 82 4 0 -3
                  -25 -15 -55z m1098 14 c116 -78 162 -212 120 -355 -17 -58 -75 -153 -121 -195
                  -27 -26 -30 -26 -93 -16 -36 6 -67 12 -69 14 -2 1 15 31 37 65 72 111 108 226
                  101 327 -4 56 -3 58 20 37 11 -10 21 -12 31 -6 12 7 10 13 -10 35 -13 14 -30
                  24 -38 23 -8 -2 -19 12 -26 32 -8 19 -17 43 -21 53 -11 27 15 21 69 -14z
                  m-544 -438 c15 -28 -21 -71 -47 -55 -23 14 -28 41 -13 59 17 21 47 19 60 -4z"
                    />
                    <path
                      d="M772 1373 c2 -13 13 -18 38 -18 25 0 36 5 38 18 3 14 -4 17 -38 17
                  -34 0 -41 -3 -38 -17z"
                    />
                    <path
                      d="M662 1329 c-23 -20 -22 -39 2 -39 18 0 49 37 41 49 -9 16 -18 14 -43
                  -10z"
                    />
                    <path
                      d="M911 1336 c-10 -11 -7 -19 12 -38 24 -24 47 -26 47 -4 0 7 -11 22
                  -23 35 -21 18 -26 20 -36 7z"
                    />
                    <path
                      d="M590 1220 c-14 -27 -12 -60 4 -60 8 0 19 14 25 31 14 39 14 36 -4 43
                  -8 3 -19 -3 -25 -14z"
                    />
                    <path
                      d="M570 1066 c0 -36 10 -55 26 -49 8 3 14 19 14 39 0 27 -4 34 -20 34
                  -14 0 -20 -7 -20 -24z"
                    />
                    <path
                      d="M607 944 c-9 -10 22 -64 37 -64 23 0 25 11 8 41 -16 28 -32 36 -45
                  23z"
                    />
                    <path
                      d="M691 821 c-11 -7 -10 -13 4 -35 18 -26 39 -34 50 -17 9 16 -38 62
                  -54 52z"
                    />
                    <path
                      d="M1206 1382 c-10 -17 12 -33 40 -30 18 2 30 10 32 21 3 13 -4 17 -32
                  17 -19 0 -37 -4 -40 -8z"
                    />
                    <path
                      d="M1346 1343 c-5 -11 2 -25 18 -39 21 -20 26 -21 36 -9 10 12 10 18 0
                  31 -24 28 -47 35 -54 17z"
                    />
                    <path
                      d="M1094 1314 c-15 -22 -15 -27 -3 -35 17 -10 65 33 55 50 -12 19 -35
                  12 -52 -15z"
                    />
                    <path
                      d="M1434 1234 c-16 -7 5 -74 22 -74 19 0 22 11 12 48 -9 32 -12 35 -34
                  26z"
                    />
                    <path
                      d="M1446 1068 c-10 -38 -7 -48 14 -48 16 0 20 7 20 35 0 40 -24 49 -34
                  13z"
                    />
                    <path
                      d="M1401 924 c-21 -48 9 -62 34 -14 19 37 19 40 -3 40 -11 0 -24 -12
                  -31 -26z"
                    />
                    <path
                      d="M1324 805 c-13 -20 -14 -29 -5 -38 10 -9 17 -7 32 12 11 13 18 29 16
                  34 -7 21 -26 18 -43 -8z"
                    />
                    <path
                      d="M366 1066 c-11 -39 -7 -56 13 -56 26 0 35 67 10 73 -11 3 -19 -3 -23
                  -17z"
                    />
                    <path
                      d="M390 930 c-19 -12 -2 -63 23 -68 20 -4 21 12 4 50 -9 21 -16 25 -27
                  18z"
                    />
                    <path
                      d="M461 797 c-8 -10 -4 -20 18 -41 25 -24 29 -25 41 -11 11 13 9 20 -10
                  40 -27 29 -33 30 -49 12z"
                    />
                    <path
                      d="M1650 1068 c0 -30 13 -58 27 -58 22 0 13 64 -9 68 -10 2 -18 -2 -18
                  -10z"
                    />
                    <path
                      d="M1631 903 c-10 -22 -9 -29 3 -41 14 -14 17 -12 31 21 19 46 19 47 -3
                  47 -11 0 -24 -12 -31 -27z"
                    />
                    <path
                      d="M1545 780 c-25 -26 -26 -30 -11 -36 12 -5 26 2 42 18 21 20 23 27 11
                  36 -11 9 -20 5 -42 -18z"
                    />
                    <path
                      d="M813 641 c-45 -4 -85 -10 -89 -14 -4 -4 -2 -7 4 -7 16 0 52 -59 52
                  -85 0 -11 -6 -31 -13 -45 l-13 -25 70 7 c39 4 81 7 93 7 21 1 22 2 7 37 -18
                  43 -12 79 18 112 l21 22 -34 -2 c-19 0 -71 -4 -116 -7z"
                    />
                    <path
                      d="M1114 620 c29 -35 33 -72 12 -111 -14 -27 -14 -27 32 -33 24 -3 64
                  -6 87 -6 l42 0 -5 54 c-4 48 -1 57 21 80 l26 26 -22 4 c-12 3 -66 7 -121 11
                  l-98 6 26 -31z"
                    />
                    <path
                      d="M488 598 c-32 -6 -58 -15 -58 -22 0 -31 35 -156 44 -156 20 1 131 28
                  119 29 -17 1 -43 54 -43 86 0 14 7 37 16 50 19 29 18 29 -78 13z"
                    />
                    <path
                      d="M1484 588 c22 -31 20 -90 -3 -120 l-20 -24 61 -13 c33 -7 62 -10 65
                  -8 6 7 32 118 33 143 0 17 -9 22 -64 32 -87 16 -90 16 -72 -10z"
                    />
                    <path
                      d="M690 430 c-74 -10 -159 -24 -188 -30 l-54 -12 7 -37 c4 -20 8 -37 8
                  -37 1 -1 63 10 137 23 120 22 164 25 405 27 267 1 347 -5 515 -40 35 -7 66
                  -11 68 -9 4 3 21 75 18 75 0 0 -36 7 -79 15 -251 48 -592 58 -837 25z"
                    />
                  </g>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/stephanesokol/details/recommendations/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright + liens légaux */}
          <div className="flex flex-col items-start gap-1 text-sm text-white/50 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 lg:items-end lg:flex-col lg:gap-y-1">
            <p className="shrink-0">{copyright}</p>
            <nav
              aria-label="Liens légaux"
              className="flex flex-col items-start gap-1 sm:flex-row sm:flex-nowrap sm:gap-x-4 lg:flex-row lg:gap-x-4"
            >
              {settings.legalLinks.map((link) => {
                const localeKey = locale as 'fr' | 'en'
                const href = localeKey === 'en' ? link.href_en : link.href_fr
                const label = localeKey === 'en' ? link.label_en : link.label_fr
                return (
                  <Link
                    key={link.href_fr}
                    href={href}
                    className="hover:text-tt-accent transition-colors whitespace-nowrap"
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
