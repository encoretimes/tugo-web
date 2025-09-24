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
    <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 bg-white border border-gray-200">
      <div className="relative h-32 w-full">
        <Image
          src={party.bannerImageUrl}
          alt={`${party.name} banner`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{party.name}</h3>
        <p className="mt-1 text-sm text-gray-600 h-10 overflow-hidden">
          {party.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <UsersIcon className="h-5 w-5 mr-2" />
          <span>멤버 {party.memberCount.toLocaleString()}명</span>
        </div>
        <div className="mt-4">
          {party.isJoined ? (
            <button className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">
              들어가기
            </button>
          ) : (
            <button className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              가입하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyCard;
