'use client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal';
import {
  ExpenseIdRequired,
  Subscription,
} from '@lib/constants/types/expenses/expenses';
import { UpdateExpenseForm } from '@components/forms/update-expense';
import { UpdateSubscriptionForm } from '@components/forms/update-subscription';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';

export const UpdateExpenseModal = ({
  expense,
  disclosure,
}: {
  expense: ExpenseIdRequired | Subscription;
  disclosure: UseDisclosureReturn;
}) => {
  if (expense.payment_type === 'one-time' || expense.payment_type === 'monthly')
    return <ModalExpense expense={expense} disclosure={disclosure} />;

  if (expense.payment_type === 'subscription')
    return (
      <ModalSubscription
        expense={expense as Subscription}
        disclosure={disclosure}
      />
    );
};

const ModalExpense = ({
  expense,
  disclosure,
}: {
  expense: ExpenseIdRequired;
  disclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <ModalContent className="">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Update Expense
            </ModalHeader>
            <ModalBody>
              <UpdateExpenseForm expense={expense} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalSubscription = ({
  expense,
  disclosure,
}: {
  expense: Subscription;
  disclosure: UseDisclosureReturn;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <ModalContent className="">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Update Subscription
            </ModalHeader>
            <ModalBody>
              <UpdateSubscriptionForm expense={expense} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
