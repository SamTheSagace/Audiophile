import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const displayName = String(formData.get('displayName') || '');

    try {
      await register(email, password, displayName);
      navigate('/'); 
      
    } catch (err: any) {
      console.warn('Register failed', err);
      alert(err?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <AuthLayout
      title="Créer un compte"
      description="Rejoignez AudioPhile pour synchroniser vos musiques."
      footerLink={{
        text: "Déjà un compte ?",
        href: "/login",
        label: "Connectez-vous"
      }}
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="displayName">Nom d'affichage</Label>
          <Input id="displayName" name="displayName" placeholder="John Doe" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        
        <Button type="submit" className="w-full">
          S'inscrire
        </Button>
      </form>
    </AuthLayout>
  );
}

export default RegisterForm;