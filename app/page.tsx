'use client';

import { ArrowRight, ForkKnife, Ticket } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/filter/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import { VoucherList } from '@/components/voucher';
import { AuthFooterLink } from '@/components/ui/AuthFooterLink';
import { HeroCTA } from '@/components/home/HeroCTA';
import { CTASection } from '@/components/home/CTASection';
import { productApi, categoryApi } from '@/lib/api';
import { Product, Category, ProductsResponse, CategoriesResponse } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured/popular products
        const productsResponse: ProductsResponse = await productApi.getProducts({}, 1, 8);
        if (productsResponse.success && productsResponse.data) {
          setFeaturedProducts(productsResponse.data.products);
        }

        // Load categories
        const categoriesResponse: CategoriesResponse = await categoryApi.getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-card">

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary via-accent/20 to-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Delicious Food,<br />
              <span className="text-primary">Delivered Fast</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing dishes from your favorite restaurants. Order now and enjoy fresh, tasty food delivered to your door.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <Suspense fallback={<div className="h-12 bg-muted rounded-lg animate-pulse"></div>}>
                <SearchBar />
              </Suspense>
            </div>

            <Suspense fallback={<div className="h-12 w-48 bg-muted rounded-lg animate-pulse mx-auto" />}>
              <HeroCTA />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Voucher Banner */}
      <section className="py-12 bg-gradient-to-r from-warning/10 to-primary border-y border-[color:hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-warning/20 p-2">
                <Ticket className="w-5 h-5 text-warning" />
              </span>
              Special Offers & Vouchers
            </h2>
            <p className="text-muted-foreground">Save on your favorite dishes with our exclusive vouchers</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <VoucherList
              compact={true}
              showEmptyState={false}
              emptyStateMessage="Check back soon for new offers!"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Explore Categories</h3>
            <p className="text-muted-foreground">Find exactly what you&apos;re craving</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group text-center p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <ForkKnife className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {category.name}
                  </h4>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">Featured Dishes</h3>
              <p className="text-muted-foreground">Most popular and highly rated</p>
            </div>
            <Link
              href="/products"
              className="text-primary hover:text-primary font-semibold flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <div className="p-4">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-1"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Order?
          </h3>
          <p className="text-accent/80 mb-8 text-lg">
            Join thousands of satisfied customers enjoying delicious food
          </p>
          <Suspense fallback={<div className="flex gap-4 justify-center"><div className="h-12 w-40 bg-muted rounded-lg animate-pulse" /><div className="h-12 w-40 bg-muted rounded-lg animate-pulse" /></div>}>
            <CTASection />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ForkKnife className="w-8 h-8 text-muted-foreground" />
                <h4 className="text-xl font-bold">Food Market</h4>
              </div>
              <p className="text-muted-foreground">
                Delicious food, delivered fast to your door.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/" className="hover:text-accent">Home</Link></li>
                <li><Link href="/products" className="hover:text-accent">Menu</Link></li>
                <li><AuthFooterLink /></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link href={`/products?category=${category.id}`} className="hover:text-accent">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>support@foodmarket.com</li>
                <li>1-800-FOOD-NOW</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 Food Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}



