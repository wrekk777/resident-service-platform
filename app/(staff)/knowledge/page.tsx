import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function KnowledgePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('knowledge_articles').select('id,title,summary,status,version,review_due_at,updated_at').is('archived_at', null).order('updated_at',{ascending:false});
  return <><div className="topbar"><div><h1 className="title">Knowledge</h1><div className="subtle">Maintain trusted staff guidance with version history and review dates.</div></div><Link className="button" href="/knowledge/new">New article</Link></div><div className="table-wrap">{data?.length?<table><thead><tr><th>Article</th><th>Status</th><th>Version</th><th>Review due</th><th>Updated</th></tr></thead><tbody>{data.map(a=><tr key={a.id}><td><strong>{a.title}</strong><div className="subtle">{a.summary||''}</div></td><td><span className="badge">{a.status}</span></td><td>v{a.version}</td><td>{a.review_due_at?new Date(a.review_due_at).toLocaleDateString():'—'}</td><td>{new Date(a.updated_at).toLocaleDateString()}</td></tr>)}</tbody></table>:<div className="empty">No knowledge articles yet.</div>}</div></>;
}
