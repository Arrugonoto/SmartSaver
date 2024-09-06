'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useExpensesStore } from '@store/expensesStore';
import { deleteExpense } from '@lib/actions/expenses/delete-expense';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';

export const DeleteExpenseModal = ({
  expense_id,
  payment_type,
  disclosure,
}: {
  expense_id: string;
  payment_type: string;
  disclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;
  const { removeExpense, removeSubscription } = useExpensesStore((state) => ({
    removeExpense: state.removeExpense,
    removeSubscription: state.removeSubscription,
  }));

  const handlePress = async () => {
    if (payment_type === 'one-time' || payment_type === 'monthly') {
      removeExpense(expense_id);
    }

    if (payment_type === 'subscription') {
      removeSubscription(expense_id);
    }

    await deleteExpense(expense_id, payment_type);
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
              {payment_type === 'subscription'
                ? 'Delete subscription'
                : 'Delete expense'}
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
