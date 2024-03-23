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
import { tableIcons } from '@constants/icons';

export const DeleteExpenseModal = ({ expense_id }: { expense_id: string }) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const handlePress = async () => {
      console.log(expense_id);
      await deleteExpense(expense_id);
   };

   return (
      <>
         <Button
            onPress={onOpen}
            className="flex w-full text-danger px-2 py-1.5 justify-start"
            radius="sm"
            variant="light"
            startContent={<tableIcons.delete className="text-xl" />}
         >
            <span className="flex flex-col items-start justify-between">
               <p>Delete</p>
               <p className="text-xs text-slate-500">Remove selected expense</p>
            </span>
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
                     <ModalHeader className="flex flex-col gap-1 text-danger">
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
      </>
   );
};
