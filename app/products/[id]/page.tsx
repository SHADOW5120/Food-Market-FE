'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { ReviewSection } from '@/components/review/ReviewSection';
import { getProductById } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      setLoading(true);
      try {
        const response = await getProductById(productId);
        if (response.success && response.data) {
          setProduct(response.data);
          // In a real app, you'd load related products here
          // For now, we'll just set an empty array
          setRelatedProducts([]);
        } else {
          // Product not found, redirect to products page
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  const handleAddToCartComplete = () => {
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-muted-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-muted-foreground">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/products" className="text-muted-foreground hover:text-muted-foreground">
                Products
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-muted-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-muted-foreground mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === 'available'
                        ? 'bg-success text-success'
                        : 'bg-destructive text-destructive'
                    }`}>
                      {product.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <FavoriteButton product={product} variant="button" />
              </div>
              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-4">
                {product.categoryId}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.status === 'available' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Quantity</h3>
                  <QuantitySelector
                    initialQuantity={quantity}
                    onChange={setQuantity}
                  />
                </div>

                <div className="flex gap-4">
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    onAddComplete={handleAddToCartComplete}
                    className="flex-1"
                  />
                  <button className="flex-1 px-6 py-3 border border-muted text-muted-foreground font-semibold rounded-lg hover:bg-accent transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium">{product.categoryId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`ml-2 font-medium ${
                    product.status === 'available' ? 'text-success' : 'text-destructive'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-muted-foreground mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-muted hover:scale-[1.02]"
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {relatedProduct.image ? (
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-muted-foreground text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-accent">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}