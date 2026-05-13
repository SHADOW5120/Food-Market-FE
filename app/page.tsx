'use client';

import { ArrowRight, ForkKnife, Ticket } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { fadeInUp, sectionStagger, gentleSlideUp } from '@/components/ui/motion';

const heroGlow = {
  background: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.16), transparent 32%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.12), transparent 28%)',
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroYOffset = useTransform(scrollYProgress, [0, 0.3], [0, 24]);

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
      <section className="relative overflow-hidden py-20">
        <motion.div
          style={{ y: heroYOffset }}
          className="pointer-events-none absolute -left-20 top-8 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"
        />
        <motion.div
          style={heroGlow}
          className="pointer-events-none absolute right-0 top-4 h-72 w-72 rounded-full opacity-60 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionStagger}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h2 variants={gentleSlideUp} className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Delicious food,<br />
              <span className="text-primary">delivered beautifully.</span>
            </motion.h2>
            <motion.p variants={gentleSlideUp} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-8">
              Discover amazing dishes from your favorite restaurants with premium delivery, elegant design, and effortless ordering.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={gentleSlideUp} className="mx-auto mb-10 max-w-md">
              <Suspense fallback={<div className="h-12 bg-muted rounded-lg animate-pulse"></div>}>
                <SearchBar />
              </Suspense>
            </motion.div>

            <motion.div variants={gentleSlideUp} className="mx-auto max-w-fit">
              <Suspense fallback={<div className="h-12 w-48 bg-muted rounded-lg animate-pulse mx-auto" />}>
                <HeroCTA />
              </Suspense>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Voucher Banner */}
      <motion.section
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "-50px" }}
        className="py-12 bg-gradient-to-r from-warning/10 to-primary border-y border-[color:hsl(var(--border))]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={gentleSlideUp} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-warning/20 p-2">
                <Ticket className="w-5 h-5 text-warning" />
              </span>
              Special Offers & Vouchers
            </h2>
            <p className="text-muted-foreground">Save on your favorite dishes with our exclusive vouchers</p>
          </motion.div>

          <motion.div variants={gentleSlideUp} className="max-w-4xl mx-auto">
            <VoucherList
              compact={true}
              showEmptyState={false}
              emptyStateMessage="Check back soon for new offers!"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "-50px" }}
        className="py-16 bg-muted"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={gentleSlideUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Explore Categories</h3>
            <p className="text-muted-foreground">Find exactly what you&apos;re craving</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div key={index} variants={fadeInUp} className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <motion.div key={category.id} variants={fadeInUp} className="group">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-center p-4 bg-card rounded-3xl border border-white/10 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/5"
                  >
                    <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
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
                    <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                      {category.name}
                    </h4>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18, margin: "-50px" }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={gentleSlideUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">Featured Dishes</h3>
              <p className="text-muted-foreground">Most popular and highly rated</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-primary font-semibold transition-colors duration-300 hover:text-primary/90"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div key={index} variants={fadeInUp} className="bg-card rounded-[1.5rem] shadow-[0_18px_64px_rgba(15,23,42,0.06)] overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <div className="p-4">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-1"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </motion.div>
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
      </motion.section>

      {/* Call to Action */}
      <motion.section
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "-50px" }}
        className="bg-primary py-16"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h3 variants={gentleSlideUp} className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Order?
          </motion.h3>
          <motion.p variants={gentleSlideUp} className="text-accent/80 mb-8 text-lg">
            Join thousands of satisfied customers enjoying delicious food.
          </motion.p>
          <motion.div variants={gentleSlideUp}>
            <Suspense fallback={<div className="flex gap-4 justify-center"><div className="h-12 w-40 bg-muted rounded-lg animate-pulse" /><div className="h-12 w-40 bg-muted rounded-lg animate-pulse" /></div>}>
              <CTASection />
            </Suspense>
          </motion.div>
        </div>
      </motion.section>

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



