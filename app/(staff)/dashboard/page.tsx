import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: openCases }, { count: waitingStaff }, { count: openTasks }, { count: unread }] = await Promise.all([
    supabase.from('cases').select('*', { count: 'exact', head: true }).is('archived_at', null).not('status', 'in', '(resolved,closed)'),
    supabase.from('cases').select('*', { count: 'exact', head: true }).is('archived_at', null).eq('status', 'waiting_on_staff_response'),
    supabase.from('case_tasks').select('*', { count: 'exact', head: true }).is('archived_at', null).eq('status', 'open'),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).is('read_at', null),
  ]);

  const { data: recentCases } = await supabase
    .from('cases')
    .select('id,case_number,subject,status,updated_at')
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
    .limit(8);

  return (
    <>
      <div className="topbar">
        <div><h1 className="title">Dashboard</h1><div className="subtle">Case accountability and resident service at a glance.</div></div>
        <Link className="button" href="/cases/new">New case</Link>
      </div>
      <section className="grid cards">
        <div className="card"><div className="subtle">Open cases</div><div className="metric">{openCases ?? 0}</div></div>
        <div className="card"><div className="subtle">Waiting on staff</div><div className="metric">{waitingStaff ?? 0}</div></div>
        <div className="card"><div className="subtle">Open follow-ups</div><div className="metric">{openTasks ?? 0}</div></div>
        <div className="card"><div className="subtle">Unread alerts</div><div className="metric">{unread ?? 0}</div></div>
      </section>
      <section className="section">
        <h2>Recent cases</h2>
        <div className="table-wrap">
          {recentCases?.length ? <table><thead><tr><th>Case</th><th>Subject</th><th>Status</th><th>Updated</th></tr></thead><tbody>
            {recentCases.map((c) => <tr key={c.id}><td><Link href={`/cases/${c.id}`}>#{c.case_number}</Link></td><td>{c.subject}</td><td><span className="badge">{String(c.status).replaceAll('_',' ')}</span></td><td>{new Date(c.updated_at).toLocaleDateString()}</td></tr>)}
          </tbody></table> : <div className="empty">No cases yet. Create the first case to begin tracking service work.</div>}
        </div>
      </section>
    </>
  );
}
