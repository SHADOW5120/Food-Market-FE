'use client';

import { Camera, ChevronLeft, CheckCircle2, Package, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';

const categories = ['Pizza', 'Burgers', 'Salad', 'Drinks', 'Desserts', 'Appetizers', 'Other'];

export default function ProductFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string | undefined;
  const isEditing = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pizza',
    status: 'available',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select an image file' }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      setTimeout(() => {
        router.push('/seller/products');
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please log in as a seller</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-success hover:text-success font-semibold mb-4 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-muted-foreground">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {/* Error Messages */}
        {errors.submit && (
          <div className="bg-destructive border border-destructive/40 rounded-lg p-4 text-destructive text-sm">
            {errors.submit}
          </div>
        )}

        {successMessage && (
          <div className="bg-success border border-success rounded-lg p-4 text-success text-sm inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow p-6 border border-muted space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Product Image
            </label>
            <div className="flex gap-6">
              {/* Image Preview */}
              <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-muted-foreground" />
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-success hover:bg-success transition-colors">
                  <UploadCloud className="w-10 h-10 mb-2 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">
                    Click to upload image
                  </span>
                  <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {errors.image && <p className="text-sm text-destructive mt-2">{errors.image}</p>}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <Input
            label="Product Name"
            name="name"
            placeholder="e.g., Margherita Pizza"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            disabled={isLoading}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
                errors.description
                  ? 'border-destructive focus:border-destructive'
                  : 'border-muted focus:border-success'
              }`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-2">{errors.description}</p>
            )}
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              name="price"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={handleInputChange}
              error={errors.price}
              disabled={isLoading}
              step="0.01"
              min="0"
            />

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-muted focus:border-success focus:outline-none"
                disabled={isLoading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="available"
                  checked={formData.status === 'available'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="unavailable"
                  checked={formData.status === 'unavailable'}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">Unavailable</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading} disabled={isLoading} fullWidth>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-muted hover:bg-accent text-muted-foreground rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
