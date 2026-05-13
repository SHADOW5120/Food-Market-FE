import { Star } from 'lucide-react';
import Image from 'next/image';
import type { Store } from '@/lib/types';

interface StoreHeaderProps {
  store: Store;
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-64 relative overflow-hidden">
        <Image
          src={store.banner || '/placeholder-store.jpg'}
          alt={store.name}
          fill
          className="object-cover"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/40 to-transparent" />
      </div>

      {/* Store Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end">
          {/* Store Logo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[color:hsl(var(--border))] shadow-lg mr-4">
            <Image
              src={store.logo || '/placeholder-logo.jpg'}
              alt={`${store.name} logo`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Store Details */}
          <div className="flex-1 text-card-foreground">
            <h1 className="text-2xl font-bold mb-1">{store.name}</h1>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-warning mr-1" />
              <span className="font-medium">{store.rating.toFixed(1)}</span>
              {store.deliveryTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{store.deliveryTime}</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground/90 text-sm line-clamp-2">
              {store.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}