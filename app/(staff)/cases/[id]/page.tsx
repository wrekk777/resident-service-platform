import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { addCommunication, updateCaseStatus } from '../actions';

const statuses = [
  ['new','New'],['in_progress','In Progress'],['waiting_on_resident','Waiting on Resident'],['waiting_on_staff_response','Waiting on Staff Response'],['resolved','Resolved'],['resolved_30_day_follow_up_requested','Resolved - 30 Day Follow-Up Requested'],['closed','Closed']
];

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, { data: history }, { data: communications }, { data: tasks }] = await Promise.all([
    supabase.from('cases').select('*, residents(full_name,email,phone,street_address,city,state,postal_code)').eq('id', id).single(),
    supabase.from('case_status_history').select('*').eq('case_id', id).order('changed_at', { ascending: false }),
    supabase.from('case_communications').select('*').eq('case_id', id).is('archived_at', null).order('occurred_at', { ascending: false }),
    supabase.from('case_tasks').select('*').eq('case_id', id).is('archived_at', null).order('due_at', { ascending: true }),
  ]);
  if (!item) notFound();
  const resident = Array.isArray(item.residents) ? item.residents[0] : item.residents;

  return (
    <>
      <div><div className="subtle">Case #{item.case_number}</div><h1 className="title">{item.subject}</h1><div className="subtle">Opened {new Date(item.opened_at).toLocaleString()}</div></div>
      <div className="grid cards section">
        <section className="card"><h2>Resident</h2><strong>{resident?.full_name || 'No resident linked'}</strong><p className="subtle">{resident?.email || ''}<br/>{resident?.phone || ''}<br/>{[resident?.street_address,resident?.city,resident?.state,resident?.postal_code].filter(Boolean).join(', ')}</p></section>
        <section className="card"><h2>Status</h2><span className="badge">{String(item.status).replaceAll('_',' ')}</span><p className="subtle">Staff response due: {item.staff_response_due_at ? new Date(item.staff_response_due_at).toLocaleString() : 'Paused / not applicable'}</p></section>
      </div>
      <section className="card section"><h2>Case details</h2><p>{item.description || 'No description provided.'}</p></section>
      <section className="card section"><h2>Update status</h2><form action={updateCaseStatus.bind(null,id)} className="form"><div className="field"><label>Status</label><select name="status" defaultValue={item.status}>{statuses.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="field"><label>Status note</label><textarea name="status_note" placeholder="Explain the change when context is needed." /></div><button className="button" type="submit">Save status</button></form></section>
      <section className="card section"><h2>Add communication</h2><form action={addCommunication.bind(null,id)} className="form"><div className="grid cards"><div className="field"><label>Direction</label><select name="direction"><option value="outbound">Outbound</option><option value="inbound">Inbound</option><option value="internal">Internal note</option></select></div><div className="field"><label>Channel</label><select name="channel"><option>Email</option><option>Phone</option><option>Meeting</option><option>Note</option></select></div></div><div className="field"><label>Subject</label><input name="subject" /></div><div className="field"><label>Details</label><textarea name="body" required /></div><button className="button" type="submit">Log communication</button></form></section>
      <section className="section"><h2>Follow-ups</h2><div className="table-wrap">{tasks?.length ? <table><thead><tr><th>Task</th><th>Status</th><th>Due</th></tr></thead><tbody>{tasks.map(t => <tr key={t.id}><td>{t.title}</td><td>{t.status}</td><td>{t.due_at ? new Date(t.due_at).toLocaleString() : '—'}</td></tr>)}</tbody></table> : <div className="empty">No follow-up tasks.</div>}</div></section>
      <section className="section"><h2>Communication history</h2><div className="table-wrap">{communications?.length ? <table><thead><tr><th>When</th><th>Direction</th><th>Channel</th><th>Details</th></tr></thead><tbody>{communications.map(c => <tr key={c.id}><td>{new Date(c.occurred_at).toLocaleString()}</td><td>{c.direction}</td><td>{c.channel}</td><td><strong>{c.subject || ''}</strong><div>{c.body}</div></td></tr>)}</tbody></table> : <div className="empty">No communications logged.</div>}</div></section>
      <section className="section"><h2>Status history</h2><div className="table-wrap">{history?.length ? <table><thead><tr><th>When</th><th>From</th><th>To</th><th>Note</th></tr></thead><tbody>{history.map(h => <tr key={h.id}><td>{new Date(h.changed_at).toLocaleString()}</td><td>{h.from_status || '—'}</td><td>{h.to_status}</td><td>{h.note || '—'}</td></tr>)}</tbody></table> : <div className="empty">No status history.</div>}</div></section>
    </>
  );
}
