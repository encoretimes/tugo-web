'use client';

import { Popover, Transition } from '@headlessui/react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Fragment } from 'react';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
}

export default function EmojiPickerButton({
  onEmojiSelect,
  buttonClassName = 'p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition',
}: EmojiPickerButtonProps) {
  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button className={buttonClassName}>
            <FaceSmileIcon className="h-6 w-6" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute bottom-full left-0 z-[100] mb-2 overflow-hidden rounded-lg shadow-2xl">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  onEmojiSelect(emojiData.emoji);
                  close();
                }}
                width={320}
                height={400}
                theme={Theme.AUTO}
                previewConfig={{ showPreview: false }}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
