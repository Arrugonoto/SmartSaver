'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Tabs, Tab } from '@nextui-org/tabs';
import { ExpensesForm } from '@/components/forms/expenses-form';
import { useSession } from 'next-auth/react';
import { btnIcons } from '@lib/constants/icons';
import { SubscriptionFormContainer } from '@components/container/subscription-form-container';

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
        Add expense
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Expense
              </ModalHeader>
              <ModalBody>
                <Tabs
                  aria-label="Options"
                  className="justify-center"
                  color="primary"
                >
                  <Tab key="standard" title="Standard">
                    <ExpensesForm user_id={user_id} />
                  </Tab>
                  <Tab key="subscription" title="Subscription">
                    <SubscriptionFormContainer />
                  </Tab>
                </Tabs>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
