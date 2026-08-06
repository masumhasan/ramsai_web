import React, { useState, useEffect, useCallback } from 'react';
import { fetchAdminFeedbacks, type AdminFeedback, type Pagination } from '../../../lib/api';
import { MessageSquare, Search, RefreshCw, ChevronLeft, ChevronRight, Loader2, Calendar, User, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FeedbackManager: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchAdminFeedbacks({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setFeedbacks(res.feedbacks);
      setPagination(res.pagination);
    } catch (err: any) {
      console.error('Failed to load feedbacks:', err);
      setErrorMsg(err.message || 'Failed to fetch user feedbacks');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">User Feedbacks</h1>
            <p className="text-sm text-slate-400 mt-1">
              View and search user experience reviews, suggestions, and uploaded pictures
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadFeedbacks}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-4 shadow-xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, user name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Feedback List */}
      {isLoading ? (
        <div className="py-20 text-center bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs text-slate-400 font-medium">Loading user feedbacks...</p>
        </div>
      ) : errorMsg ? (
        <div className="py-12 text-center bg-slate-900/50 border border-red-500/20 rounded-2xl flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-red-400 font-bold">Error loading feedbacks</p>
          <p className="text-xs text-slate-400">{errorMsg}</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500">
          <MessageSquare className="w-10 h-10 stroke-[1.5]" />
          <p className="text-xs font-semibold text-slate-400">No feedbacks found</p>
          <p className="text-[10px] text-slate-500">
            {debouncedSearch ? 'Try adjusting your search query' : 'Users have not submitted any feedbacks yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300"
            >
              {/* Submission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 text-emerald-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      {item.userId ? item.userId.name : 'Unknown User'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {item.userId ? item.userId.email : 'No email'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Photos Gallery */}
              {item.images && item.images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Attached Photos ({item.images.length})
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {item.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="group relative w-20 h-20 rounded-xl border border-white/10 overflow-hidden cursor-pointer bg-slate-950 hover:border-emerald-500/50 transition-all shadow-inner"
                      >
                        <img
                          src={imgUrl}
                          alt={`Attached photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} submissions)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                  className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Image Overlay Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Zoomed feedback snapshot"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
