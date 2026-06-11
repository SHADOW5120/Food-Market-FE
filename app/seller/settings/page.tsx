'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Button } from '@/components/auth/Button';
import { Input } from '@/components/auth/Input';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi } from '@/lib/api';
import { Store } from '@/lib/types';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/lib/constants';

export default function SellerSettingsPage() {
  const { user, role, hasHydrated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [store, setStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    logo: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasHydrated || !isSeller) {
      return;
    }
    loadStoreData();
  }, [hasHydrated, isSeller]);

  useEffect(() => {
    if (!selectedStoreId || !stores.length) {
      return;
    }

    const selected = stores.find((item) => item.id === selectedStoreId);
    if (selected && selected.id !== store?.id) {
      applyStoreData(selected);
    }
  }, [selectedStoreId, stores]);

  const applyStoreData = (storeData: Store) => {
    setStore(storeData);
    setSelectedStoreId(storeData.id);
    setFormData({
      storeName: storeData.name,
      description: storeData.description || '',
      phone: storeData.phone || '',
      address: storeData.address || '',
      city: storeData.city || '',
      state: storeData.state || '',
      zip: storeData.zip || '',
      logo: null,
    });
    setLogoPreview(storeData.logo || null);
  };

  const loadStoreData = async () => {
    try {
      setIsLoading(true);
      const response = await sellerApi.getSellerStore();

      if (response.success && Array.isArray(response.data) && response.data.length) {
        setStores(response.data);
        const requestedStoreId = searchParams?.get('storeId');
        const initialStore = response.data.find((item) => item.id === requestedStoreId) ?? response.data[0];
        applyStoreData(initialStore);
      } else {
        toast.error('Failed to load store data');
      }
    } catch (error) {
      toast.error('Error loading store data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    }

    if (!selectedStoreId) {
      newErrors.storeName = 'Please select a store to manage';
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

    if (!selectedStoreId) {
      toast.error('Select a store first');
      return;
    }

    setIsSaving(true);

    try {
      type UpdateStoreData = Omit<Partial<Store>, 'logo'> & { logo?: string | File };
      const updateData: UpdateStoreData = {
        name: formData.storeName,
        description: formData.description,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        logo: formData.logo || undefined,
      };

      const response = await sellerApi.updateSellerStore(selectedStoreId, updateData as any);

      if (response.success) {
        toast.success('Store settings updated successfully');
        setStore(response.data || null);
      } else {
        toast.error(response.message || 'Failed to update store settings');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update store settings';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
        <SellerLayout user={user} storeName="My Store">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading store settings...</p>
            </div>
          </div>
        </SellerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName={store?.name || 'My Stores'}>
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
            <h1 className="text-3xl font-bold text-foreground">Store Settings</h1>
            <p className="text-muted-foreground">Manage your store profile and information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {stores.length > 1 && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <label className="block text-sm font-medium text-foreground mb-2">Store</label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-input text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">Select a store</option>
                  {stores.map((storeItem) => (
                    <option key={storeItem.id} value={storeItem.id}>
                      {storeItem.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Store Logo */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Store Logo</h2>
              <div className="flex gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <label className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Upload Logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={isSaving}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Store Information */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Store Information</h2>

              <Input
                label="Store Name"
                name="storeName"
                type="text"
                placeholder="Your store name"
                value={formData.storeName}
                onChange={handleInputChange}
                error={errors.storeName}
                disabled={isSaving}
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your store..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Contact Information</h2>

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                disabled={isSaving}
              />
            </div>

            {/* Address Information */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Address</h2>

              <Input
                label="Street Address"
                name="address"
                type="text"
                placeholder="Street address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                disabled={isSaving}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  disabled={isSaving}
                />
                <Input
                  label="State"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  disabled={isSaving}
                />
              </div>

              <Input
                label="ZIP Code"
                name="zip"
                type="text"
                placeholder="12345"
                value={formData.zip}
                onChange={handleInputChange}
                error={errors.zip}
                disabled={isSaving}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !selectedStoreId}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}
