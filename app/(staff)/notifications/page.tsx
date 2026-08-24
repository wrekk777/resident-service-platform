import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('notifications').select('id,kind,case_id,message,created_at,read_at').order('created_at',{ascending:false}).limit(100);
  return <><div><h1 className="title">Notifications</h1><div className="subtle">Status changes, response thresholds, and follow-up alerts.</div></div><div className="table-wrap section">{data?.length?<table><thead><tr><th>When</th><th>Alert</th><th>Case</th><th>State</th></tr></thead><tbody>{data.map(n=><tr key={n.id}><td>{new Date(n.created_at).toLocaleString()}</td><td><strong>{String(n.kind).replaceAll('_',' ')}</strong><div>{n.message}</div></td><td>{n.case_id?<Link href={`/cases/${n.case_id}`}>Open case</Link>:'—'}</td><td>{n.read_at?'Read':'Unread'}</td></tr>)}</tbody></table>:<div className="empty">No notifications yet.</div>}</div></>;
}
