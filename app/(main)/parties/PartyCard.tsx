import Image from 'next/image';
import { UsersIcon } from '@heroicons/react/24/solid';

interface Party {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  bannerImageUrl: string;
  isJoined?: boolean;
}

interface PartyCardProps {
  party: Party;
}

const PartyCard = ({ party }: PartyCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700">
      <div className="relative h-32 w-full">
        <Image
          src={party.bannerImageUrl}
          alt={`${party.name} banner`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{party.name}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 h-10 overflow-hidden">
          {party.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <UsersIcon className="h-5 w-5 mr-2" />
          <span>멤버 {party.memberCount.toLocaleString()}명</span>
        </div>
        <div className="mt-4">
          {party.isJoined ? (
            <button className="w-full rounded-md bg-gray-200 dark:bg-neutral-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-600">
              들어가기
            </button>
          ) : (
            <button className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
              가입하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyCard;
