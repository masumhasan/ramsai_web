import React, { useState } from 'react';
import { type AdminUser, updateUserRole } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X, AlertTriangle, Loader2 } from 'lucide-react';

interface UserRoleModalProps {
  user: AdminUser | null;
  currentUserRole: 'superadmin' | 'admin' | 'user';
  onClose: () => void;
  onSuccess: (updatedUser: AdminUser) => void;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  user,
  currentUserRole,
  onClose,
  onSuccess,
}) => {
  if (!user) return null;

  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'admin' | 'user'>(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isElevatedChange = selectedRole !== 'user' || user.role !== 'user';
  const canModifyRole = currentUserRole === 'superadmin' || !isElevatedChange;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateUserRole(user._id, selectedRole);
      onSuccess(res.user || { ...user, role: selectedRole });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
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
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Change User Role</h3>
            <p className="text-xs text-muted-foreground">{user.name} ({user.email})</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!canModifyRole && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Only Superadmins can assign or revoke administrative roles.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Select New Role
            </label>
            <div className="space-y-2">
              {(['user', 'admin', 'superadmin'] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={selectedRole === r}
                      onChange={() => setSelectedRole(r)}
                      disabled={!canModifyRole}
                      className="accent-primary cursor-pointer"
                    />
                    <span className="capitalize font-medium text-sm text-foreground">{r}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {r === 'superadmin' ? 'Full system control' : r === 'admin' ? 'Manage users' : 'Standard app access'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !canModifyRole || selectedRole === user.role}
              className="cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
