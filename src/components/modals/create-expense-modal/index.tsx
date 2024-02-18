'use client';
import {
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { ExpensesForm } from '@/components/forms/expenses-form';

export const CreateExpenseModal = ({ user_id }: { user_id: string }) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   return (
      <div>
         <Button onPress={onOpen} color="primary">
            Add new expense
         </Button>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
               {onClose => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Add New Expense
                     </ModalHeader>
                     <ModalBody>
                        <ExpensesForm user_id={user_id} />
                     </ModalBody>
                  </>
               )}
            </ModalContent>
         </Modal>
      </div>
   );
};
