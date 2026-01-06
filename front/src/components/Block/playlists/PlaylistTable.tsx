import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "../../ui/datatable"
import { ButtonGroup } from "@/components/ui/button-group";

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  color:string
}
export type Song = {
  title: string
  artist: string
}

export default function PlaylistTable<Song>({columns, data, color}:DataTableProps<Song>,) {
  return (
    <div className={`rounded-md border max-w-fit bg-${color}`}>
        <DataTable columns={columns} data={data} />
        <ButtonGroup className="w-full">
          <Button variant="outline" className="flex-1 bg-white/0 text-white"> Filter</Button>
          <Button variant="outline" className="flex-1 bg-white/0 text-white"> Export</Button>
        </ButtonGroup>
    </div>
  );
}