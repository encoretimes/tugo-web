'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

const conversations = [
  {
    id: 1,
    user: {
      name: '김진보',
      profileImageUrl: 'https://i.pravatar.cc/150?u=progressive_kim',
    },
    lastMessage: '네, 좋은 의견입니다. 한번 더 생각해볼게요.',
    time: '오후 3:45',
    unreadCount: 2,
  },
  {
    id: 2,
    user: {
      name: '이보수',
      profileImageUrl: 'https://i.pravatar.cc/150?u=conservative_lee',
    },
    lastMessage: '자료 확인했습니다. 감사합니다.',
    time: '오전 11:20',
    unreadCount: 0,
  },
  {
    id: 3,
    user: {
      name: '박중도',
      profileImageUrl: 'https://i.pravatar.cc/150?u=neutral_park',
    },
    lastMessage: '회의록 정리해서 보내드렸습니다.',
    time: '어제',
    unreadCount: 0,
  },
];

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

const initialMessages: { [key: number]: Message[] } = {
  1: [
    { id: 1, text: '안녕하세요, 김진보입니다. 보내주신 자료 잘 보았습니다.', sender: 'other', time: '오후 3:40' },
    { id: 2, text: '특히 마지막 부분의 통계 자료가 인상 깊었습니다.', sender: 'other', time: '오후 3:41' },
    { id: 3, text: '안녕하세요. 확인해주셔서 감사합니다. 혹시 다른 의견 있으신가요?', sender: 'me', time: '오후 3:42' },
    { id: 4, text: '네, 좋은 의견입니다. 한번 더 생각해볼게요.', sender: 'other', time: '오후 3:45' },
  ],
  2: [
     { id: 1, text: '이보수입니다. 요청하신 자료 첨부합니다.', sender: 'other', time: '오전 11:18' },
     { id: 2, text: '자료 확인했습니다. 감사합니다.', sender: 'me', time: '오전 11:20' },
  ],
  3: [],
};

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0].id);
  const [messages, setMessages] = useState(initialMessages);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-full text-black dark:text-white bg-white dark:bg-black">
      {/* Conversation List */}
      <aside className="w-1/3 h-full border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold">쪽지</h1>
          <div className="relative mt-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="대화 검색"
              className="w-full rounded-full border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-neutral-900 py-2 pl-10 pr-4"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversationId(convo.id)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                selectedConversationId === convo.id
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-900'
              }`}
            >
              <Image
                src={convo.user.profileImageUrl}
                alt={convo.user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-grow overflow-hidden">
                <div className="font-bold">{convo.user.name}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {convo.lastMessage}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end text-xs text-gray-400">
                <span>{convo.time}</span>
                {convo.unreadCount > 0 && (
                  <span className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {convo.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="w-2/3 h-full flex flex-col">
        {selectedConversation ? (
          <>
            <header className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
              <Image
                src={selectedConversation.user.profileImageUrl}
                alt={selectedConversation.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedConversation.user.name}</h2>
              </div>
            </header>

            <div className="flex-grow p-4 overflow-y-auto bg-gray-50/50 dark:bg-neutral-900/50">
              {messages[selectedConversationId].map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl ${
                      msg.sender === 'me'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-neutral-700'
                    }`}
                  >
                    <p>{msg.text}</p>
                     <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-grow rounded-full border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-neutral-800 py-3 px-5 focus:outline-none"
                />
                <button className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserIcon className="h-24 w-24" />
            <h2 className="mt-4 text-2xl font-bold">대화를 선택하세요</h2>
            <p>왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
