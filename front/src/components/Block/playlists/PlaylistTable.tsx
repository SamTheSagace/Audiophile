import { DataTable, type Column } from '../../ui/datatable';
import { ButtonGroup } from '@/components/ui/button-group';
import { BORDER_MAP, type Provider } from '@/lib/utils';
import { ConfirmationDialog } from '../modals/Confirmation';
import { ExportModal } from '../modals/ExportModal';

type DataTableProps = {
  data: Song[];
  provider: Provider;
};
export type Song = {
  title: string;
  artist: string;
};

const columns: Column<Song>[] = [
  {
    header: 'Title',
    accessor: 'title',
    cell: value => <span className="font-medium">{value}</span>,
  },
  {
    header: 'Artist',
    accessor: 'artist',
    cell: value => <span className="font-medium">{value}</span>,
  },
];

export default function PlaylistTable({ data, provider }: DataTableProps) {
  const handleFilter = () => {
    console.log('filter !');
  };
  return (
    <div className={`rounded-md border max-w-fit ${BORDER_MAP[provider]} flex flex-col justify-between h-full`}>
      <DataTable columns={columns} data={data} />
      <ButtonGroup className="w-full">
        <ConfirmationDialog onClick={handleFilter} />
        <ExportModal onClick={handleFilter} />
      </ButtonGroup>
    </div>
  );
}
