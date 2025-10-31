'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PollCreator from '../feed/PollCreator';
import { PollCreateData } from '@/app/types/poll';

interface PollCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPollCreate: (pollData: PollCreateData) => void;
  initialData?: PollCreateData | null;
}

export default function PollCreatorModal({
  isOpen,
  onClose,
  onPollCreate,
  initialData = null,
}: PollCreatorModalProps) {
  const [currentPollData, setCurrentPollData] = useState<PollCreateData | null>(
    initialData
  );

  const handlePollDataChange = (pollData: PollCreateData | null) => {
    setCurrentPollData(pollData);
  };

  const handleSave = () => {
    if (currentPollData) {
      onPollCreate(currentPollData);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    투표 만들기
                  </Dialog.Title>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <PollCreator
                    onPollDataChange={handlePollDataChange}
                    initialData={initialData}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!currentPollData}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    투표 추가
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
