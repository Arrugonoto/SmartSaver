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
import { BudgetForm } from '@components/forms/budget-form';
import { menuIcons } from '@lib/constants/icons';
import { Tooltip } from '@nextui-org/tooltip';

export const BudgetLimitModal = ({ update }: { update?: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      {!update && (
        <Button onPress={onOpen} color="primary" variant="flat" size="sm">
          Set a limit
        </Button>
      )}
      {update && (
        <Tooltip content="Change limit">
          <Button
            onPress={onOpen}
            color="primary"
            variant="flat"
            size="md"
            className="min-w-6 w-6 h-6 p-0 bg-transparent hover:bg-gray-400/20 rounded-full"
          >
            <div className="p-0">
              <menuIcons.gear className="text-md" />
            </div>
          </Button>
        </Tooltip>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        scrollBehavior={'inside'}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {update ? 'Update limit' : 'Set a budget limit'}
              </ModalHeader>
              <ModalBody>
                <BudgetForm update={update} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
