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
import { deleteExpense } from '@lib/actions/expenses/delete-expense';

export const DeleteExpenseModal = ({ expense_id }: { expense_id: string }) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const handlePress = async () => {
      console.log(expense_id);
      await deleteExpense(expense_id);
   };

   return (
      <>
         <Button onPress={onOpen} className="w-full text-danger">
            Delete
         </Button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
            isDismissable={false}
         >
            <ModalContent>
               {onClose => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Delete expense
                     </ModalHeader>
                     <ModalBody>
                        <p>
                           Are you sure, that you want to remove selected
                           expense from tracking list?
                        </p>
                        <p className="text-danger">{`This action can't be undone.`}</p>
                     </ModalBody>
                     <ModalFooter>
                        <Button
                           color="danger"
                           variant="light"
                           onPress={onClose}
                        >
                           Cancel
                        </Button>
                        <Button
                           color="primary"
                           onPress={() => {
                              handlePress();
                              onClose;
                           }}
                        >
                           Delete
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
      </>
   );
};
