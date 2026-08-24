import { sendLoginCode, verifyLoginCode } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  const sent = params.sent === '1';

  return (
    <main className="login">
      <section className="login-card">
        <div className="subtle">Staff access</div>
        <h1>Resident Service Platform</h1>
        <p className="subtle">Sign in with your authorized staff email. We will send a 6-digit verification code.</p>
        {sent ? <p className="notice">Enter the 6-digit code from your email below.</p> : null}
        {params.error ? <p className="notice">{params.error}</p> : null}

        {!sent ? (
          <form action={sendLoginCode} className="form">
            <div className="field">
              <label htmlFor="email">Staff email</label>
              <input id="email" name="email" type="email" required placeholder="name@charlottenc.gov" />
            </div>
            <button className="button" type="submit">Send verification code</button>
          </form>
        ) : (
          <form action={verifyLoginCode} className="form">
            <div className="field">
              <label htmlFor="email">Staff email</label>
              <input id="email" name="email" type="email" required defaultValue="warren.wooten@charlottenc.gov" />
            </div>
            <div className="field">
              <label htmlFor="token">6-digit code</label>
              <input id="token" name="token" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoComplete="one-time-code" placeholder="123456" />
            </div>
            <button className="button" type="submit">Verify and sign in</button>
          </form>
        )}
      </section>
    </main>
  );
}
