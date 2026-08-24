'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) redirect('/login?error=Enter%20your%20email%20address.');

  const headerStore = await headers();
  const origin = headerStore.get('origin') ?? '';
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect('/login?sent=1');
}
