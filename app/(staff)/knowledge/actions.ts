'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!title || !body) redirect('/knowledge/new?error=Title%20and%20body%20are%20required.');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Date.now().toString().slice(-6);
  const { data, error } = await supabase.from('knowledge_articles').insert({
    title,
    slug,
    summary: String(formData.get('summary') ?? '').trim() || null,
    body,
    status: String(formData.get('status') ?? 'draft'),
  }).select('id').single();
  if (error || !data) redirect(`/knowledge/new?error=${encodeURIComponent(error?.message || 'Unable to create article.')}`);
  revalidatePath('/knowledge');
  redirect('/knowledge');
}
