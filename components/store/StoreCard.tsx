import Link from 'next/link';
import Image from 'next/image';
import type { Store } from '@/lib/types';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="relative">
        {/* Store Banner/Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={store.banner || '/placeholder-store.jpg'}
            alt={store.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Store Logo */}
        <div className="absolute bottom-3 left-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <Image
              src={store.logo || '/placeholder-logo.jpg'}
              alt={`${store.name} logo`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{store.name}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">⭐</span>
            <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
          </div>
          {store.deliveryTime && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{store.deliveryTime}</span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {store.description}
        </p>

        {store.productCount && (
          <p className="text-xs text-gray-500">
            {store.productCount} products available
          </p>
        )}
      </div>
    </Link>
  );
}