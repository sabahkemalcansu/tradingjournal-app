'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onRegister = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Kayıt başarılı, giriş yapabilirsiniz');
      router.push('/login');
    } catch (e: any) {
      alert(e.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={onRegister} disabled={loading} className="w-full">{loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
