import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@nextui-org/input';
import type { IconType } from '@icons-pack/react-simple-icons';
import { brandIcons } from '@lib/constants/icons';
import { Tooltip } from '@nextui-org/tooltip';
import { SubscriptionListForm } from '@components/forms/subscription-list-form';

export const SubscriptionModal = ({
  brandName,
  brandIcon: Icon,
}: {
  brandName: string;
  brandIcon: IconType | null;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button
        onPress={onOpen}
        variant="ghost"
        radius="sm"
        className="flex flex-col gap-2 min-h-[6.8rem] w-full px-2 pb-2 justify-start overflow-visible"
      >
        <div className="flex h-12 items-end">
          {Icon ? (
            <Icon color="default" size={32} />
          ) : (
            <brandIcons.default className="text-[1.8rem] opacity-80" />
          )}
        </div>
        <Tooltip content={brandName}>
          <p className="max-w-full text-wrap truncate overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {brandName}
          </p>
        </Tooltip>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2">
                <div>
                  {Icon ? (
                    <Icon color="default" size={26} />
                  ) : (
                    <brandIcons.default className="text-[1.8rem] opacity-80" />
                  )}
                </div>
                New subscription
              </ModalHeader>
              <ModalBody>
                <SubscriptionListForm brandName={brandName} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
