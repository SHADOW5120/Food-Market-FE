'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Button } from '@/components/auth/Button';
import { Input } from '@/components/auth/Input';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi } from '@/lib/api';
import { CreateProductPayload, Store } from '@/lib/types';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/lib/constants';

export default function NewProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    storeId: '', // Will be set from user context
    status: 'available' as 'available' | 'unavailable',
    stock: '',
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await sellerApi.getSellerStore();
        if (response.success && response.data) {
          const stores = response.data;
          setStores(stores);
          // Set default store if user has only one
          if (stores.length === 1 && stores[0]) {
            setFormData(prev => ({ ...prev, storeId: stores[0].id }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
        toast.error('Failed to load stores');
      } finally {
        setLoadingStores(false);
      }
    };

    if (user) {
      fetchStores();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.storeId) {
      newErrors.storeId = 'Store selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateProductPayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        storeId: formData.storeId,
        status: formData.status,
        stock: formData.stock ? parseInt(formData.stock, 10) : undefined,
        image: formData.image || undefined,
      };

      const response = await sellerApi.createSellerProduct(payload);

      if (response.success) {
        toast.success('Product created successfully');
        router.push('/seller/products');
      } else {
        toast.error(response.message || 'Failed to create product');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
              {/* Product Name */}
              <Input
                label="Product Name"
                name="name"
                type="text"
                placeholder="e.g., Delicious Burger"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                disabled={isLoading}
              />

              {/* Store Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store
                </label>
                <select
                  name="storeId"
                  value={formData.storeId}
                  onChange={handleInputChange}
                  disabled={isLoading || loadingStores}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
                    errors.storeId
                      ? 'border-destructive focus:border-destructive'
                      : 'border-border focus:border-primary'
                  } bg-input text-foreground`}
                >
                  <option value="">
                    {loadingStores ? 'Loading stores...' : 'Select a store'}
                  </option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {errors.storeId && (
                  <p className="text-sm text-destructive mt-2">{errors.storeId}</p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price ($)"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  error={errors.price}
                  disabled={isLoading}
                />

                <Input
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  placeholder="100"
                  value={formData.stock}
                  onChange={handleInputChange}
                  error={errors.stock}
                  disabled={isLoading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
                    errors.categoryId
                      ? 'border-destructive focus:border-destructive'
                      : 'border-border focus:border-primary'
                  } bg-input text-foreground`}
                >
                  <option value="">Select a category</option>
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                  <option value="other">Other</option>
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive mt-2">{errors.categoryId}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Image
                </label>
                <div className="flex gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Upload Image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}




