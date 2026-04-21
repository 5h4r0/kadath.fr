import type { TeamContent } from '@/lib/cms/schemas'

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

interface Props {
  content: TeamContent
}

export function TeamSection({ content }: Props) {
  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <h2 className="mb-16 text-center text-3xl font-light text-tt-accent">
        <span className="mark-gray">{content.title}</span>
      </h2>

      <div className="mx-auto max-w-[40rem] grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
        {content.members.map((member) => (
          <div key={member.key} className="flex flex-col gap-6">
            {/* Portrait */}
            <div className="relative self-start lg:-ml-4">
              <div
                aria-hidden="true"
                className="motif-dots pointer-events-none absolute bottom-0 right-0 h-3/4 w-3/4 translate-x-3 translate-y-3 opacity-30"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.img}
                alt={member.name}
                className="relative z-10 w-full max-w-[18rem]"
              />
            </div>

            <div className="flex flex-col gap-6 w-4/5 max-w-[80%] ml-8 sm:w-[90%] sm:max-w-[90%] lg:w-[90%] lg:max-w-[90%] lg:ml-0 lg:pl-4">
              <p className="font-light text-tt-accent text-xl">{member.name}</p>

              <div className="flex flex-col gap-4 font-light text-white text-base leading-relaxed">
                {member.bios.map((bio) => (
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu CMS interne, pas de risque XSS externe
                  <p key={bio} dangerouslySetInnerHTML={{ __html: bio }} />
                ))}
              </div>

              <div className="flex items-center justify-end gap-4 text-tt-accent">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  <span className="sr-only">LinkedIn</span>
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
