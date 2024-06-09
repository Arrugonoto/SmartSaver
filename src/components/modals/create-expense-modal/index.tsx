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
import { Tabs, Tab } from '@nextui-org/tabs';
import { ExpensesForm } from '@/components/forms/expenses-form';
import { SubscriptionForm } from '@components/forms/subscription-form';
import { useSession } from 'next-auth/react';
import { btnIcons } from '@lib/constants/icons';

export const CreateExpenseModal = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user_id = session?.user.id;

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        endContent={<btnIcons.plus className="text-[1rem]" />}
      >
        Add new expense
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="h-[34rem]"
        size="xl"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        scrollBehavior={'inside'}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Expense
              </ModalHeader>
              <ModalBody>
                <Tabs aria-label="Options" className="justify-center">
                  <Tab key="standard" title="Standard">
                    <ExpensesForm user_id={user_id} />
                  </Tab>
                  <Tab key="subscription" title="Subscription">
                    <SubscriptionForm user_id={user_id} />
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
