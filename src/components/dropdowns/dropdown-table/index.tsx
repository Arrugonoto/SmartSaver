'use client';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { tableIcons } from '@constants/icons';
import { DeleteExpenseModal } from '@components/modals/delete-expense';
import { UpdateExpenseModal } from '@components/modals/update-expense';
import type {
  ExpenseIdRequired,
  Subscription,
} from '@lib/constants/types/expenses/expenses';

export const DropdownTable = ({
  expense,
}: {
  expense: ExpenseIdRequired | Subscription;
}) => {
  const updateModal = useDisclosure();
  const deleteModal = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="min-w-8 p-0 bg-transparent hover:bg-gray-400/20">
            <div>
              <tableIcons.menu className="text-lg" />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Table actions"
          variant="faded"
          onAction={(key) => {
            if (key === 'edit') {
              updateModal.onOpen();
            }

            if (key === 'delete') {
              deleteModal.onOpen();
            }
          }}
        >
          <DropdownItem
            key="edit"
            textValue="Update selected expense"
            description="Update expense"
            startContent={<tableIcons.edit className="text-lg" />}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            textValue="Delete selected expense from list"
            description="Remove selected expense"
            startContent={<tableIcons.delete className="text-lg" />}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <UpdateExpenseModal expense={expense} disclosure={updateModal} />
      <DeleteExpenseModal expense_id={expense.id} disclosure={deleteModal} />
    </>
  );
};
