import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';

export const dynamic = 'force-dynamic';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('display_name,email,is_owner,active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.active) redirect('/login?error=This%20account%20is%20not%20authorized%20for%20staff%20access.');

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Resident Service</div>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/cases">Cases</Link>
          <Link href="/residents">Residents</Link>
          <Link href="/knowledge">Knowledge</Link>
          <Link href="/follow-ups">Follow-ups</Link>
          <Link href="/notifications">Notifications</Link>
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="subtle">Signed in as</div>
            <strong>{profile.display_name || profile.email}</strong>
          </div>
          <form action={signOut}><button className="button secondary" type="submit">Sign out</button></form>
        </div>
        {children}
      </main>
    </div>
  );
}
