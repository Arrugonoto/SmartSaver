'use client';
import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { tableIcons } from '@lib/constants/icons';
import { ExpenseIdRequired } from '@lib/constants/types/expenses/expenses';
import { UpdateExpenseForm } from '@components/forms/update-expense';
import { UpdateSubscriptionForm } from '@components/forms/update-subscription';

export const UpdateExpenseModal = ({
   expense,
}: {
   expense: ExpenseIdRequired;
}) => {
   if (expense.payment_type === 'one-time' || 'monthly')
      return <ModalExpense expense={expense} />;

   if (expense.payment_type === 'subscription')
      return <ModalSubscription expense={expense} />;
};

const ModalSubscription = ({ expense }: { expense: ExpenseIdRequired }) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   return (
      <>
         <Button
            onPress={onOpen}
            radius="sm"
            variant="light"
            className="flex w-full px-2 py-1.5 justify-start text-success"
            startContent={<tableIcons.edit className="text-xl" />}
         >
            <span className="flex flex-col items-start justify-between">
               <p>Edit</p>
               <p className="text-xs text-slate-500">Update selected expense</p>
            </span>
         </Button>

         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            isDismissable={false}
            isKeyboardDismissDisabled={false}
         >
            <ModalContent className="">
               {onClose => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Update Subscription shit man
                     </ModalHeader>
                     <ModalBody>
                        <UpdateSubscriptionForm expense={expense} />
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};

const ModalExpense = ({ expense }: { expense: ExpenseIdRequired }) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   return (
      <>
         <Button
            onPress={onOpen}
            radius="sm"
            variant="light"
            className="flex w-full px-2 py-1.5 justify-start text-success"
            startContent={<tableIcons.edit className="text-xl" />}
         >
            <span className="flex flex-col items-start justify-between">
               <p>Edit</p>
               <p className="text-xs text-slate-500">Update selected expense</p>
            </span>
         </Button>

         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            isDismissable={false}
            isKeyboardDismissDisabled={false}
         >
            <ModalContent className="">
               {onClose => (
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
      </>
   );
};
