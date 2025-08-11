'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/');
    } catch (e: any) {
      alert(e.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={onLogin} disabled={loading} className="w-full">{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
