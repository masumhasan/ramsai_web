import React, { useState } from 'react';
import { type AdminUser, deleteUserAccount } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';

interface UserDeleteModalProps {
  user: AdminUser | null;
  currentUserId: string;
  currentUserRole: 'superadmin' | 'admin' | 'user';
  onClose: () => void;
  onSuccess: (deletedUserId: string) => void;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  user,
  currentUserId,
  currentUserRole,
  onClose,
  onSuccess,
}) => {
  if (!user) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = user._id === currentUserId;
  const isTargetAdmin = user.role === 'admin' || user.role === 'superadmin';
  const canDelete = !isSelf && (!isTargetAdmin || currentUserRole === 'superadmin');

  const handleDelete = async () => {
    setError(null);
    if (!canDelete) return;

    try {
      setIsSubmitting(true);
      await deleteUserAccount(user._id);
      onSuccess(user._id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user account');
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
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-destructive">Delete Account</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSelf && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>You cannot delete your own account from the admin dashboard.</span>
          </div>
        )}

        {!isSelf && isTargetAdmin && currentUserRole !== 'superadmin' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Only superadmins can delete administrator accounts.</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to permanently delete user <strong className="text-foreground">{user.name}</strong>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting || !canDelete}
            onClick={handleDelete}
            className="cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};
