'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const SELF_SERVICE_OWNER_EMAIL = 'wwooten@gmail.com';

export async function sendLoginCode(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) redirect('/login?error=Enter%20your%20email%20address.');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: email === SELF_SERVICE_OWNER_EMAIL,
    },
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect('/login?sent=1');
}

export async function verifyLoginCode(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const token = String(formData.get('token') ?? '').replace(/\s+/g, '');

  if (!email || !/^\d{6}$/.test(token)) {
    redirect('/login?sent=1&error=Enter%20your%20staff%20email%20and%206-digit%20code.');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error || !data.user) {
    redirect(`/login?sent=1&error=${encodeURIComponent(error?.message ?? 'Unable to verify code.')}`);
  }

  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('user_id,active')
    .eq('user_id', data.user.id)
    .eq('active', true)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    redirect('/login?error=This%20account%20is%20not%20authorized%20for%20staff%20access.');
  }

  redirect('/dashboard');
}
