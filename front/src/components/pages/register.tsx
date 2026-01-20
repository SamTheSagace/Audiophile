import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import auth from '../../lib/auth';

export function RegisterForm({
  className,
  onRegister,
  ...props
}: React.ComponentProps<"div"> & { onRegister?: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const displayName = String(formData.get('displayName') || '');
    try {
      await auth.register(email, password, displayName);
      onRegister?.();
    } catch (err: any) {
      console.warn('Register failed', err);
      alert(err?.message || 'Register failed');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Créer un compte</h1>
                <p className="text-muted-foreground text-balance">
                  Inscrivez-vous pour profiter pleinement des fonctionnalités d'Audiophile.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="displayName">Nom d'affichage</FieldLabel>
                <Input id="displayName" name="displayName" placeholder="Votre nom" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Créer un compte</Button>
              </Field>
              <FieldDescription>
                Vous avez déjà un compte ?  <a href="/login" className="text-sm underline">Connectez-vous</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img src="/placeholder.svg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        En créant un compte, vous acceptez nos <a href="#">Conditions d'utilisation</a> et <a href="#">Politique de confidentialité</a>.
      </FieldDescription>
    </div>
  );
}

export default RegisterForm;
