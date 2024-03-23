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
import { ExpensesForm } from '@/components/forms/expenses-form';
import { SubscriptionForm } from '@components/forms/subscription-form';

export const UpdateExpenseModal = ({
   id,
   type,
}: {
   id: string;
   type: 'single' | 'subscription' | 'monthly' | string;
}) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   return (
      <div>
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
            className="min-h-[30rem]"
            size="xl"
            isDismissable={false}
            isKeyboardDismissDisabled={false}
         >
            {type === 'single' ||
               ('monthly' && (
                  <ModalContent className="">
                     {onClose => (
                        <>
                           <ModalHeader className="flex flex-col gap-1">
                              Update Expense
                           </ModalHeader>
                           <ModalBody>
                              {/* <ExpensesForm user_id={user_id} /> */}

                              {/* <SubscriptionForm user_id={user_id} /> */}
                           </ModalBody>
                        </>
                     )}
                  </ModalContent>
               ))}

            {type === 'subscription' && (
               <ModalContent className="">
                  {onClose => (
                     <>
                        <ModalHeader className="flex flex-col gap-1">
                           Update Subscription
                        </ModalHeader>
                        <ModalBody>
                           {/* <ExpensesForm user_id={user_id} /> */}

                           {/* <SubscriptionForm user_id={user_id} /> */}
                        </ModalBody>
                     </>
                  )}
               </ModalContent>
            )}
         </Modal>
      </div>
   );
};
