SELECT confirmation_token, invited_at, confirmation_sent_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;