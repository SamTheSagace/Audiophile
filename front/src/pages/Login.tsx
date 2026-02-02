import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    
    try {
      await login(email, password);
      navigate('/'); 
      
    } catch (err) {
      console.warn('Login failed', err);
      alert('Échec de la connexion'); 
    }
  };

  return (
    <AuthLayout
      title="Ravi de vous revoir"
      description="Entrez vos identifiants pour accéder à votre espace."
      footerLink={{
        text: "Pas encore de compte ?",
        href: "/register",
        label: "Inscrivez-vous"
      }}
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline text-muted-foreground">
              Oublié ?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </AuthLayout>
  );
}