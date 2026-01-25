import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getProviderConfig } from '@/lib/providers';
import { type ProviderType } from '@/types/playlist.types';
import { Loader2 } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customName: string) => void;
  
  // Context
  categoryName: string;
  provider: ProviderType;
  isExporting?: boolean;
}

export function ExportModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  categoryName, 
  provider,
  isExporting = false
}: ExportModalProps) {
  
  const config = getProviderConfig(provider);
  const Icon = config.icon;

  const [customName, setCustomName] = useState("");

  const placeholderName = `${categoryName} Mix`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(customName || placeholderName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon style={{ color: config.color }} />
            Exporter vers {config.label}
          </DialogTitle>
          <DialogDescription>
             Vous allez créer une nouvelle playlist contenant les titres de la catégorie 
             <span className="font-semibold text-foreground mx-1">{categoryName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom de la nouvelle playlist</Label>
            <Input
              id="name"
              placeholder={placeholderName}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              disabled={isExporting}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Laissez vide pour utiliser "{placeholderName}".
            </p>
          </div>
          
          <DialogFooter>
             <Button type="button" variant="outline" onClick={onClose} disabled={isExporting}>
               Annuler
             </Button>
             <Button 
                type="submit" 
                className="text-white border-0 gap-2"
                style={{ background: config.bgStyle }}
                disabled={isExporting}
             >
               {isExporting && <Loader2 className="h-4 w-4 animate-spin" />}
               {isExporting ? "Création..." : "Confirmer l'export"}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}