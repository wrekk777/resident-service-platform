import { createArticle } from '../actions';

export default async function NewKnowledgePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <><div><h1 className="title">New knowledge article</h1><div className="subtle">Create staff guidance that can be reviewed, versioned, and trusted.</div></div><section className="card section">{params.error?<p className="notice">{params.error}</p>:null}<form action={createArticle} className="form"><div className="field"><label>Title</label><input name="title" required /></div><div className="field"><label>Summary</label><textarea name="summary" /></div><div className="field"><label>Body</label><textarea name="body" required /></div><div className="field"><label>Status</label><select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select></div><button className="button" type="submit">Create article</button></form></section></>;
}
