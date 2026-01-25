
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import auth from "@/lib/auth"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm({
  className,
  onLogin,
  ...props
}: React.ComponentProps<"div"> & { onLogin?: () => void}) {
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    try {
      if (login) {
        await login(email, password)
      } else {
        await auth.login(email, password)
      }
      onLogin?.();
    } catch (err) {
      console.warn('Login failed', err);
      alert('Login failed');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenue !</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte Audiophile pour continuer.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Se connecter</Button>
              </Field>
              <FieldDescription className="text-center">
                Vous n'avez pas de compte ? <a href="/register" className="hover:cursor-pointer">Inscrivez-vous</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img src="/placeholder.svg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        En cliquant sur continuer, vous acceptez nos <a href="#">Conditions d'utilisation</a>{" "}
        et <a href="#">Politique de confidentialité</a>.
      </FieldDescription>
    </div>
  );
}
