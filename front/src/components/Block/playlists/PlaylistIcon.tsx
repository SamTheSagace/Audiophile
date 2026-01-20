import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '../modals/Confirmation';
import { ExportModal } from '../modals/ExportModal';
import { BORDER_MAP, ProviderIcon, TEXT_MAP, type Provider } from '@/lib/utils';
import type React from 'react';

type DataTableProps = {
  icone: string;
  title: string;
  provider: Provider;
};

export default function PlaylistIcone({ title, icone, provider }: DataTableProps) {
  const handleFilter = () => {
    console.log('filter !');
  };

  return (
    <Card className={`min-w-[18rem] ${BORDER_MAP[provider]}`}>
      <CardHeader>
        <img src={icone} alt="" />
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center gap-[0.25rem]">
          <p>from :</p>
          <ProviderIcon className={TEXT_MAP[provider]} provider={provider} /> <p className={TEXT_MAP[provider]}>{provider}</p>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CardAction className="w-full">
          <ButtonGroup className="w-full">
            <ConfirmationDialog onClick={handleFilter} />
            <ExportModal onClick={handleFilter} />
          </ButtonGroup>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
