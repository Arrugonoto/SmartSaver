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
import { UpdateExpenseModal } from '@components/modals/update-expense';
import type { ExpenseIdRequired } from '@lib/constants/types/expenses/expenses';

export const DropdownTable = ({ expense }: { expense: ExpenseIdRequired }) => {
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
               isReadOnly
               key="edit"
               className="p-0"
               textValue="Update selected expense"
            >
               <UpdateExpenseModal expense={expense} />
            </DropdownItem>
            <DropdownItem
               isReadOnly
               key="delete"
               className="text-danger p-0"
               color="danger"
               textValue="Delete selected expense from list"
            >
               <DeleteExpenseModal expense_id={expense.id} />
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   );
};
