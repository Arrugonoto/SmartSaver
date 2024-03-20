'use client';
import {
   Dropdown,
   DropdownTrigger,
   DropdownMenu,
   DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { tableIcons } from '@constants/icons';
import { DeleteExpenseModal } from '@components/modals/delete-expense';

export const DropdownTable = ({ expense_id }: { expense_id: string }) => {
   return (
      <Dropdown>
         <DropdownTrigger>
            <Button className="min-w-8 p-0 bg-transparent hover:bg-gray-400/20">
               <div>
                  <tableIcons.menu className="text-lg" />
               </div>
            </Button>
         </DropdownTrigger>
         <DropdownMenu aria-label="Table actions" variant="faded">
            <DropdownItem
               key="edit"
               description="Update selected expense"
               startContent={<tableIcons.edit className="text-lg" />}
            >
               Edit
            </DropdownItem>
            <DropdownItem
               isReadOnly
               key="delete"
               className="text-danger p-0"
               color="danger"
               textValue="Delete selected expense from list"
            >
               <DeleteExpenseModal expense_id={expense_id} />
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   );
};
