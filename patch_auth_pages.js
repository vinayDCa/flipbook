import fs from 'fs';

// Patch Login
let login = fs.readFileSync('src/pages/auth/Login.tsx', 'utf8');
login = login.replace(/import \{ supabase, hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';/g, '');
login = login.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';/g, '');
login = login.replace(/import \{ signInWithEmailAndPassword \} from 'firebase\/auth';\nimport \{ auth \} from '\.\.\/\.\.\/lib\/firebase';\n/, '');
login = "import { signInWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from '../../lib/firebase';\n" + login;

const loginTarget = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);

    try {
      if (!hasSupabaseConfig) {
        // Mock Login
        if (email && password) {
          localStorage.setItem('mock_user', JSON.stringify({ id: 'mock-123', email }));
          // Reload page to trigger auth state
          window.location.href = '/admin';
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };`;

const loginReplacement = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };`;

login = login.replace(loginTarget, loginReplacement);
login = login.replace(/\{\!hasSupabaseConfig[\s\S]*?\}\)/g, '');
fs.writeFileSync('src/pages/auth/Login.tsx', login);

// Patch Register
let register = fs.readFileSync('src/pages/auth/Register.tsx', 'utf8');
register = register.replace(/import \{ supabase, hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';/g, '');
register = register.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';/g, '');
register = "import { createUserWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from '../../lib/firebase';\n" + register;

const registerTarget = `  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!hasSupabaseConfig) {
        if (email && password) {
          localStorage.setItem('mock_user', JSON.stringify({ id: 'mock-123', email }));
          window.location.href = '/admin';
        }
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        navigate('/admin');
      } else {
        setSuccess('Registration successful! Please check your email to verify your account.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };`;

const registerReplacement = `  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };`;

register = register.replace(registerTarget, registerReplacement);
register = register.replace(/\{\!hasSupabaseConfig[\s\S]*?\}\)/g, '');
register = register.replace(/disabled=\{isLoading \|\| \!\!success\}/g, 'disabled={isLoading}');
fs.writeFileSync('src/pages/auth/Register.tsx', register);

console.log("Patched Login and Register");
