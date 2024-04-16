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

export const CreateExpenseModal = ({ user_id }: { user_id: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} color="primary">
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
