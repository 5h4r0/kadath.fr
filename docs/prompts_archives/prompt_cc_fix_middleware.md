# Fix — middleware : redirect `auth/admin` obsolète

## Contexte

Le fichier `src/proxy.ts` contient encore une référence à
`/${locale}/auth/admin` dans le step 4 (admin domain guard). Cette route a été
supprimée dans le sprint précédent — le backoffice admin est désormais
accessible via `/manage`. Cette référence doit être corrigée.

---

## Correction à apporter

**Fichier :** `src/proxy.ts`

Dans le bloc **step 4** (`// 4. Admin domain guard`), remplacer le redirect
vers `/${locale}/auth/admin` par un redirect vers `/manage` :

```ts
// Avant
const locale = extractLocale(pathname)
const loginUrl = new URL(`/${locale}/auth/admin`, request.url)
loginUrl.searchParams.set('redirect', pathname)
return NextResponse.redirect(loginUrl)

// Après
return withCookies(NextResponse.redirect(new URL('/manage', request.url)))
```

Le paramètre `redirect` n'est plus nécessaire : `/manage` est la page login
admin, elle gère elle-même la redirection post-auth vers `/manage/cms`.

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne toucher qu'à ce seul bloc dans `src/proxy.ts`
- Ne pas modifier d'autres fichiers
- Commit avec co-auteur :
  `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
