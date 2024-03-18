'use client';
import {
   Dropdown,
   DropdownTrigger,
   DropdownMenu,
   DropdownSection,
   DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { tableIcons } from '@constants/icons';

export const DropdownTable = () => {
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
               key="delete"
               className="text-danger"
               color="danger"
               startContent={<tableIcons.delete className="text-lg" />}
               description="Remove selected expense"
            >
               Delete
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   );
};
