import { createClient } from '@/lib/supabase/server';

export default async function ResidentsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('residents').select('id,full_name,email,phone,city,state,updated_at').is('archived_at', null).order('full_name');
  return <><div><h1 className="title">Residents</h1><div className="subtle">Resident contact records linked to service cases.</div></div><div className="table-wrap section">{data?.length ? <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Updated</th></tr></thead><tbody>{data.map(r=><tr key={r.id}><td>{r.full_name}</td><td>{r.email||'—'}</td><td>{r.phone||'—'}</td><td>{[r.city,r.state].filter(Boolean).join(', ')||'—'}</td><td>{new Date(r.updated_at).toLocaleDateString()}</td></tr>)}</tbody></table>:<div className="empty">Residents will appear here as cases are created.</div>}</div></>;
}
