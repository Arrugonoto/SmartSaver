'use client';
import React, { useState } from 'react';
import type { Session } from 'next-auth';
import { Divider } from '@nextui-org/divider';
import { accountIcons } from '@lib/constants/icons';
import { Input } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

export const UserSettingsSection = ({
  userSession,
}: {
  userSession: Session;
}) => {
  const user = userSession.user;
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  return (
    <section className="flex flex-col bg-content1 h-full px-4 py-2 gap-2 rounded-lg">
      <div className="flex  gap-2 items-center self-start">
        <accountIcons.settings className="text-[1.6rem]" />
        <h2>Account settings</h2>
      </div>
      <Divider />
      <div className="flex flex-col md:flex-row md:p-4 gap-10 md:max-w-[80vw] lg:max-w-[60vw] justify-between">
        <div className="flex-col">
          <h3 className="text-base">Name</h3>
          <p className="text-sm opacity-75">Change username</p>
        </div>
        <div className="flex flex-col gap-2">
          <form className="flex flex-col gap-2">
            <Input
              label="Name"
              size="sm"
              radius="sm"
              type="text"
              name="confirmNewPassword"
              placeholder={user?.name}
              className="min-w-[200px] md:min-w-[280px] lg:min-w-[360px]"
            />
            <Button
              variant="ghost"
              color="success"
              className="self-end min-w-[160px]"
            >
              Change name
            </Button>
          </form>
        </div>
      </div>
      <Divider className="opacity-60" />
      <div className="flex flex-col md:flex-row md:p-4 gap-10 md:max-w-[80vw] lg:max-w-[60vw] justify-between">
        <div>
          <h3 className="text-base">Password</h3>
          <p className="text-sm opacity-75">Change password</p>
        </div>
        <div className="flex flex-col gap-2">
          <form className="flex flex-col gap-2">
            <Input
              label="New password"
              // isRequired={!formData.password}
              size="sm"
              radius="sm"
              type="password"
              name="newPassword"
              className="min-w-[200px] md:min-w-[280px] lg:min-w-[360px]"

              // value={formData.password}
              // onChange={(e) => handleChange(e)}
            />
            <Input
              label="Confirm new password"
              // isRequired={!formData.password}
              size="sm"
              radius="sm"
              type="password"
              name="confirmNewPassword"
              className="min-w-[200px] md:min-w-[280px] lg:min-w-[360px]"
              // value={formData.password}
              // onChange={(e) => handleChange(e)}
            />
            <Button
              variant="ghost"
              color="success"
              className="self-end min-w-[160px]"
            >
              Change password
            </Button>
          </form>
        </div>
      </div>
      <Divider className="opacity-60" />
      <div className="flex rounded-md bg-danger/[.10]">
        <div className="flex px-1 py-2 md:p-4 flex-col md:flex-row gap-10 w-full md:max-w-[80vw] lg:max-w-[60vw] justify-between">
          <div>
            <h3 className="text-base text-danger">Delete account</h3>
            <p className="max-w-[32ch] text-sm text-danger opacity-75">
              Danger zone - permanently deletes all data associated with the
              account
            </p>
          </div>
          <div className="flex w-auto justify-end items-end">
            <Button variant="ghost" color="danger" className="min-w-[160px]">
              Delete my account
            </Button>
            <Modal>
              <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalBody>
                  <p>e?</p>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};
