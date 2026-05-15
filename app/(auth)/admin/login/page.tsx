import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import styles from './login.module.css';

async function signIn(formData: FormData) {
  'use server';
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect('/admin');
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className={styles.main}>
      <div className={styles.box}>
        <Image
          src="/cdc-habitat-logo.jpg"
          alt="CDC Habitat"
          width={180}
          height={61}
          priority
          className={styles.logo}
        />
        <h1 className={styles.title}>Espace administration</h1>
        <p className={styles.subtitle}>
          Rencontre Nationale Patrimoine 2026
        </p>

        {searchParams.error && (
          <div className={styles.error}>
            Identifiants incorrects.
          </div>
        )}

        <form action={signIn} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" required autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label>Mot de passe</label>
            <input type="password" name="password" required autoComplete="current-password" />
          </div>
          <button type="submit" className={styles.btn}>
            Se connecter
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
        </form>

        <p className={styles.hint}>
          Les comptes admin sont gérés depuis Supabase &gt; Authentication &gt; Users.
        </p>
      </div>
    </main>
  );
}
