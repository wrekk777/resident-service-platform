'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createCase(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const fullName = String(formData.get('full_name') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  if (!fullName || !subject) redirect('/cases/new?error=Resident%20name%20and%20subject%20are%20required.');

  const { data: resident, error: residentError } = await supabase.from('residents').insert({
    full_name: fullName,
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    street_address: String(formData.get('street_address') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim() || null,
    state: String(formData.get('state') ?? '').trim() || null,
    postal_code: String(formData.get('postal_code') ?? '').trim() || null,
  }).select('id').single();

  if (residentError || !resident) redirect(`/cases/new?error=${encodeURIComponent(residentError?.message || 'Unable to create resident.')}`);

  const { data: created, error } = await supabase.from('cases').insert({
    resident_id: resident.id,
    subject,
    description: String(formData.get('description') ?? '').trim() || null,
    assigned_staff_id: user.id,
  }).select('id').single();

  if (error || !created) redirect(`/cases/new?error=${encodeURIComponent(error?.message || 'Unable to create case.')}`);
  redirect(`/cases/${created.id}`);
}

export async function updateCaseStatus(caseId: string, formData: FormData) {
  const supabase = await createClient();
  const status = String(formData.get('status') ?? '');
  const statusNote = String(formData.get('status_note') ?? '').trim() || null;
  const { error } = await supabase.from('cases').update({ status, status_note: statusNote }).eq('id', caseId);
  if (error) throw new Error(error.message);
  revalidatePath(`/cases/${caseId}`);
  revalidatePath('/dashboard');
  revalidatePath('/cases');
}

export async function addCommunication(caseId: string, formData: FormData) {
  const supabase = await createClient();
  const body = String(formData.get('body') ?? '').trim();
  if (!body) return;
  const { error } = await supabase.from('case_communications').insert({
    case_id: caseId,
    direction: String(formData.get('direction') ?? 'internal'),
    channel: String(formData.get('channel') ?? 'note'),
    subject: String(formData.get('subject') ?? '').trim() || null,
    body,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/cases/${caseId}`);
}
