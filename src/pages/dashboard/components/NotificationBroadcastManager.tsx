import React, { useState, useEffect, useRef } from 'react';
import { sendNotificationBroadcast, fetchBroadcastHistory, uploadImageToS3, type BroadcastLogItem } from '../../../lib/api';
import { Send, Megaphone, Image as ImageIcon, Users, RefreshCw, CheckCircle, AlertCircle, Clock, Sparkles, UploadCloud, Trash2, ExternalLink } from 'lucide-react';

export const NotificationBroadcastManager: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('broadcast');

  const [uploadingS3, setUploadingS3] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);

  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [history, setHistory] = useState<BroadcastLogItem[]>([]);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchBroadcastHistory();
      setHistory(data);
    } catch (err: any) {
      console.error('Failed to fetch broadcast history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadingS3(true);
    setErrorMsg(null);

    try {
      const res = await uploadImageToS3(file);
      setImageUrl(res.url);
      setUploadedFileName(res.filename);
      setSuccessMsg(`Image successfully uploaded to AWS S3 bucket! (${res.filename})`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('S3 Upload Error:', err);
      setErrorMsg(err.message || 'Failed to upload image to AWS S3.');
    } finally {
      setUploadingS3(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setUploadedFileName(null);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a notification title.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter a notification message.');
      return;
    }

    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await sendNotificationBroadcast({
        title,
        message,
        imageUrl: imageUrl.trim() || undefined,
        type,
      });

      setSuccessMsg(res.message || 'Notification broadcast successfully sent!');
      setTitle('');
      setMessage('');
      setImageUrl('');
      setUploadedFileName(null);
      loadHistory();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Failed to send broadcast:', err);
      setErrorMsg(err.message || 'Failed to send notification broadcast.');
    } finally {
      setSending(false);
    }
  };

  const sampleImages = [
    {
      name: 'Healthy Meal Banner',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Workout Motivation Banner',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'App Update Announcement',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Notification Broadcast</h1>
            <p className="text-sm text-slate-400 mt-1">
              Broadcast push notifications with title, rich message, and AWS S3 hosted banner images to all app users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-center">
          <Users className="w-4 h-4" />
          Target: All App Users
        </div>
      </div>

      {/* Status Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 text-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form + Live Mobile Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Broadcast Form (2 cols) */}
        <form onSubmit={handleSendBroadcast} className="lg:col-span-2 space-y-5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
          {/* Notification Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notification Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🔥 New 7-Day Fitness Challenge Starts Today!"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 text-sm font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Notification Category Type */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category Tag
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="broadcast">📣 Broadcast Announcement</option>
              <option value="nutrition">🥗 Nutrition & Diet Tip</option>
              <option value="workout">🏋️ Workout Motivation</option>
              <option value="achievement">🏆 Achievement & Reward</option>
              <option value="system">⚙️ System Update</option>
            </select>
          </div>

          {/* Notification Message */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notification Message <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Join thousands of users in our weekly workout routines. Tap here to view your new customized plan!"
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
            />
          </div>

          {/* AWS S3 Banner Image Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Banner Image (AWS S3 Bucket)
              </label>
              <button
                type="button"
                onClick={() => setIsUrlMode(!isUrlMode)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline transition-all"
              >
                {isUrlMode ? '📁 Switch to File Upload' : '🔗 Use External URL'}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {!isUrlMode ? (
              /* AWS S3 File Drag & Drop Upload Zone */
              <div>
                {imageUrl && imageUrl.includes('s3') ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AWS S3 Bucket (gocalai)
                        </span>
                        <span className="text-xs text-slate-300 truncate max-w-[200px]">
                          {uploadedFileName || 'Image Uploaded'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
                        >
                          Replace File
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-slate-950">
                      <img src={imageUrl} alt="Uploaded S3 Banner" className="w-full h-full object-cover" />
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-medium flex items-center gap-1 hover:bg-black"
                      >
                        <ExternalLink className="w-3 h-3" /> View S3 File
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      {uploadingS3 ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {uploadingS3 ? 'Uploading image to AWS S3 Bucket...' : 'Click or Drag & Drop image to upload to AWS S3'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PNG, JPG, WEBP (Max 10MB) • Bucket: <span className="text-emerald-400 font-mono">gocalai (us-east-1)</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* External Image URL Input Mode */
              <div className="space-y-2">
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/banner-image.png"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 font-medium">Sample Presets:</span>
                  {sampleImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[11px] transition-all"
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={sending || uploadingS3}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {sending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Broadcasting Notification...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Broadcast Notification to All Users
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Live Push Preview (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Client Push Preview</h3>
            </div>
            <p className="text-xs text-slate-500">How the notification appears on users' devices</p>

            {/* Device Notification Card Preview */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-4 shadow-2xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    📣
                  </div>
                  <span className="text-xs font-bold text-white">GoCal AI</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Just now</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {title || 'Notification Title Preview'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                  {message || 'Notification message text preview will appear here in the user app.'}
                </p>
              </div>

              {/* Banner Image Preview */}
              {imageUrl ? (
                <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-slate-900">
                  <img
                    src={imageUrl}
                    alt="Notification Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="py-6 border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-600">
                  No image banner attached
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Section */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Past Broadcast Logs</h2>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            disabled={loadingHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            Loading broadcast history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No past notification broadcasts logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Banner</th>
                  <th className="py-3 px-4">Title & Message</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4 text-right">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {history.map((log, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      {log.imageUrl ? (
                        <img
                          src={log.imageUrl}
                          alt="Thumbnail"
                          className="w-12 h-10 object-cover rounded-lg border border-white/10"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-slate-600 italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-white truncate">{log.title}</p>
                      <p className="text-slate-400 text-[11px] truncate mt-0.5">{log.message}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Users className="w-3 h-3" /> {log.recipientsCount} users
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
