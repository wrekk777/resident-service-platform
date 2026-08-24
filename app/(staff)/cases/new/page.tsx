import { createCase } from '../actions';

export default async function NewCasePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <div><h1 className="title">New case</h1><div className="subtle">Create the resident record and service case together.</div></div>
      <section className="card section">
        {params.error ? <p className="notice">{params.error}</p> : null}
        <form action={createCase} className="form">
          <h2>Resident</h2>
          <div className="field"><label>Full name</label><input name="full_name" required /></div>
          <div className="grid cards">
            <div className="field"><label>Email</label><input name="email" type="email" /></div>
            <div className="field"><label>Phone</label><input name="phone" /></div>
          </div>
          <div className="field"><label>Street address</label><input name="street_address" /></div>
          <div className="grid cards">
            <div className="field"><label>City</label><input name="city" /></div>
            <div className="field"><label>State</label><input name="state" defaultValue="NC" /></div>
            <div className="field"><label>Postal code</label><input name="postal_code" /></div>
          </div>
          <h2>Case</h2>
          <div className="field"><label>Subject</label><input name="subject" required /></div>
          <div className="field"><label>Description</label><textarea name="description" /></div>
          <button className="button" type="submit">Create case</button>
        </form>
      </section>
    </>
  );
}
