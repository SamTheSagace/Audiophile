import { Card, CardContent } from "@/components/ui/card";
import { AudioWaveform } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footerLink: {
    text: string;
    href: string;
    label: string;
  };
}

export function AuthLayout({ children, title, description, footerLink }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden border-none shadow-2xl">
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
            
            {/*COLONNE GAUCHE : FORMULAIRE*/}
            <div className="flex flex-col justify-center p-6 md:p-12 bg-background">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    {description}
                  </p>
                </div>
                
                {children}

                <div className="text-center text-sm text-muted-foreground">
                  {footerLink.text}{" "}
                  <a href={footerLink.href} className="underline underline-offset-4 hover:text-primary font-medium">
                    {footerLink.label}
                  </a>
                </div>
              </div>
            </div>

            {/*COLONNE DROITE : DESIGN*/}
            <div className="relative hidden md:flex flex-col justify-between p-10 text-white h-full bg-zinc-900">
              {/* Fond dégradé abstrait "Audiophile" */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 opacity-90" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              
              {/* Logo / Branding */}
              <div className="relative z-20 flex items-center text-lg font-medium gap-2">
                <AudioWaveform className="h-6 w-6" />
                <span>AudioPhile</span>
              </div>

              {/* Citation */}
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg font-medium leading-relaxed">
                    &ldquo;La musique donne une âme à nos coeurs et des ailes à la pensée. Gérez vos playlists comme jamais auparavant.&rdquo;
                  </p>
                  <footer className="text-sm opacity-80">L'équipe AudioPhile</footer>
                </blockquote>
              </div>
            </div>

          </CardContent>
        </Card>
        
        <div className="text-balance text-center text-xs text-muted-foreground mt-8">
          En continuant, vous acceptez nos <a href="#" className="underline hover:text-primary">Conditions d'utilisation</a> et <a href="#" className="underline hover:text-primary">Politique de confidentialité</a>.
        </div>
      </div>
    </div>
  );
}