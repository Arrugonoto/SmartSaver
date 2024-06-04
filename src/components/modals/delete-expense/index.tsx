'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { deleteExpense } from '@lib/actions/expenses/delete-expense';
import { tableIcons } from '@constants/icons';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';

export const DeleteExpenseModal = ({
  expense_id,
  disclosure,
}: {
  expense_id: string;
  disclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  const handlePress = async () => {
    await deleteExpense(expense_id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-danger">
              Delete expense
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure, that you want to remove selected expense from
                tracking list?
              </p>
              <p>It removes completely data related to selected expense.</p>
              <p className="text-danger">{`This action can't be undone.`}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  handlePress();
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
