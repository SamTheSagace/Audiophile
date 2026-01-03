import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "../../ui/datatable"
import { ButtonGroup } from "@/components/ui/button-group";

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
}

export default function PlaylistTable<T>({columns, data}:DataTableProps<T>) {
  return (
    <div className="rounded-md border max-w-fit">
        <DataTable columns={columns} data={data}/>
        <ButtonGroup>
          <Button > Filter</Button>
          <Button > Filter</Button>
        </ButtonGroup>
    </div>
  );
}