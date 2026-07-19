import React, { useState } from 'react';
import { type SubscriptionPlan, updateSubscriptionPlan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Plus, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface PlanEditModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSuccess: (updatedPlan: SubscriptionPlan) => void;
}

export const PlanEditModal: React.FC<PlanEditModalProps> = ({ plan, onClose, onSuccess }) => {
  if (!plan) return null;

  const [name, setName] = useState(plan.name || '');
  const [price, setPrice] = useState<number | string>(plan.price ?? 0);
  const [foodScans, setFoodScans] = useState<number | string>(plan.dailyLimits?.foodScans ?? 3);
  const [productScans, setProductScans] = useState<number | string>(plan.dailyLimits?.productScans ?? 2);
  const [features, setFeatures] = useState<string[]>(plan.features || []);
  const [newFeatureText, setNewFeatureText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      const updates: Partial<SubscriptionPlan> = {
        name,
        price: Number(price),
        features,
        dailyLimits: {
          foodScans: Number(foodScans),
          productScans: Number(productScans),
        },
      };

      const res = await updateSubscriptionPlan(plan._id, updates);
      onSuccess(res.plan || { ...plan, ...updates });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update plan details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Edit Subscription Plan</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {plan.type} Plan Settings
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Monthly Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          {/* Daily Scan Limits */}
          <div className="p-3 bg-muted/40 border border-border/60 rounded-xl space-y-3">
            <p className="text-xs font-bold text-foreground">Daily Usage Limits (-1 = Unlimited)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Food Scans / Day
                </label>
                <input
                  type="number"
                  value={foodScans}
                  onChange={(e) => setFoodScans(e.target.value)}
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Product Scans / Day
                </label>
                <input
                  type="number"
                  value={productScans}
                  onChange={(e) => setProductScans(e.target.value)}
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Plan Features List */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Plan Included Features
            </label>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/60 text-xs"
                >
                  <span className="font-medium text-foreground">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="e.g. Personalized AI Workout Plans"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
                className="gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Plan Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
