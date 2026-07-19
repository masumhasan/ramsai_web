import React, { useState } from 'react';
import { type AdminUser, updateUserDetails } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Edit, X, AlertTriangle, Loader2 } from 'lucide-react';

interface UserEditModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSuccess: (updatedUser: AdminUser) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSuccess }) => {
  if (!user) return null;

  const [name, setName] = useState(user.name || '');
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    'inactive' | 'active' | 'trial' | 'expired'
  >(user.subscriptionStatus || 'inactive');
  const [age, setAge] = useState<number | string>(user.age || '');
  const [gender, setGender] = useState<string>(user.gender || 'Other');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      const updates: Partial<AdminUser> = {
        name,
        subscriptionStatus,
        age: age ? Number(age) : undefined,
        gender,
      };

      const res = await updateUserDetails(user._id, updates);
      onSuccess(res.user || { ...user, ...updates });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update user profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Edit User Details</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Subscription Status
            </label>
            <select
              value={subscriptionStatus}
              onChange={(e) =>
                setSubscriptionStatus(e.target.value as 'inactive' | 'active' | 'trial' | 'expired')
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
