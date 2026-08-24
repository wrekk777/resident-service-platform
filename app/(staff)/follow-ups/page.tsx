import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function FollowUpsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('case_tasks').select('id,title,status,due_at,case_id,cases(case_number,subject)').is('archived_at', null).order('due_at',{ascending:true});
  return <><div><h1 className="title">Follow-ups</h1><div className="subtle">Scheduled and overdue work linked to resident cases.</div></div><div className="table-wrap section">{data?.length?<table><thead><tr><th>Task</th><th>Case</th><th>Status</th><th>Due</th></tr></thead><tbody>{data.map(t=>{const c=Array.isArray(t.cases)?t.cases[0]:t.cases;return <tr key={t.id}><td>{t.title}</td><td><Link href={`/cases/${t.case_id}`}>#{c?.case_number} {c?.subject}</Link></td><td><span className="badge">{t.status}</span></td><td>{t.due_at?new Date(t.due_at).toLocaleString():'—'}</td></tr>})}</tbody></table>:<div className="empty">No follow-up tasks.</div>}</div></>;
}
