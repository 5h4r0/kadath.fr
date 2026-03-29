import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
)

const users = [
  { email: 'admin@kadath.fr', password: 'Admin0000!' },
  { email: 'editor@kadath.fr', password: 'Editor1111!' },
  { email: 'client1@test.fr', password: 'Client3333!' },
  { email: 'client2@test.fr', password: 'Client4444!' },
]
;(async () => {
  for (const user of users) {
    const { data } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    })
    console.log(data.user?.id, user.email)
  }
})()
