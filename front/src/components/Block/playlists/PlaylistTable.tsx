import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '../../ui/datatable';
import { ButtonGroup } from '@/components/ui/button-group';
import { BORDER_MAP, type Provider } from '@/lib/utils';

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
  return (
    <div className={`rounded-md border max-w-fit ${BORDER_MAP[provider]} flex flex-col justify-between `}>
      <DataTable columns={columns} data={data} />
      <ButtonGroup className="w-full">
        <Button variant="outline" className="flex-1 bg-white/0">
          Filter
        </Button>
        <Button variant="outline" className="flex-1 bg-white/0 ">
          Export
        </Button>
      </ButtonGroup>
    </div>
  );
}
