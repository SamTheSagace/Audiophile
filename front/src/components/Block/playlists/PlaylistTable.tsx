import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '../../ui/datatable';
import { ButtonGroup } from '@/components/ui/button-group';

type DataTableProps = {
  data: Song[];
  color: string;
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

export default function PlaylistTable({ data, color }: DataTableProps) {
  return (
    <div className={`rounded-md border max-w-fit `}>
      <DataTable columns={columns} data={data} />
      <ButtonGroup className="w-full">
        <Button variant="outline" className="flex-1 bg-white/0 ">
          Filter
        </Button>
        <Button variant="outline" className="flex-1 bg-white/0 ">
          Export
        </Button>
      </ButtonGroup>
    </div>
  );
}
