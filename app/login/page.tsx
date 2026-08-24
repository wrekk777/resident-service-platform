import { sendMagicLink } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="login">
      <section className="login-card">
        <div className="subtle">Staff access</div>
        <h1>Resident Service Platform</h1>
        <p className="subtle">Sign in with your authorized staff email. A secure sign-in link will be sent to your inbox.</p>
        {params.sent ? <p className="notice">Check your email for the sign-in link.</p> : null}
        {params.error ? <p className="notice">{params.error}</p> : null}
        <form action={sendMagicLink} className="form">
          <div className="field">
            <label htmlFor="email">Staff email</label>
            <input id="email" name="email" type="email" required placeholder="name@charlottenc.gov" />
          </div>
          <button className="button" type="submit">Send sign-in link</button>
        </form>
      </section>
    </main>
  );
}
