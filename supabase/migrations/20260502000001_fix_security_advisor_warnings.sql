-- 1. Restreindre la policy SELECT du bucket media (interdire le listing)
DROP POLICY "media: lecture publique" ON storage.objects;
CREATE POLICY "media: lecture publique" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media' AND name IS NOT NULL);

-- 2. Révoquer EXECUTE sur sync_admin_user_metadata pour anon/authenticated
REVOKE EXECUTE ON FUNCTION public.sync_admin_user_metadata() FROM anon, authenticated;
