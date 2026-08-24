import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function CasesPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from('cases')
    .select('id,case_number,subject,status,updated_at,resident_id')
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  return (
    <>
      <div className="topbar"><div><h1 className="title">Cases</h1><div className="subtle">Track ownership, status, and timely staff response.</div></div><Link className="button" href="/cases/new">New case</Link></div>
      <div className="table-wrap">
        {cases?.length ? <table><thead><tr><th>Case</th><th>Subject</th><th>Status</th><th>Updated</th></tr></thead><tbody>
          {cases.map((c) => <tr key={c.id}><td><Link href={`/cases/${c.id}`}>#{c.case_number}</Link></td><td>{c.subject}</td><td><span className="badge">{String(c.status).replaceAll('_',' ')}</span></td><td>{new Date(c.updated_at).toLocaleString()}</td></tr>)}
        </tbody></table> : <div className="empty">No active cases yet.</div>}
      </div>
    </>
  );
}
