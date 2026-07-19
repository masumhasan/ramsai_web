import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { fetchAdminUsers, updateUserDetails, type AdminUser, type Pagination } from '@/lib/api';
import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Menu,
  X,
  Loader2,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { UserRoleModal } from './components/UserRoleModal';
import { UserEditModal } from './components/UserEditModal';
import { UserDeleteModal } from './components/UserDeleteModal';

export default function AdminDashboard() {
  const { user: currentAdmin, isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dashboard/login');
    }
  }, [isAuthenticated, navigate]);

  // Data state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination params
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const sortBy = 'createdAt';
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [selectedRoleUser, setSelectedRoleUser] = useState<AdminUser | null>(null);
  const [selectedEditUser, setSelectedEditUser] = useState<AdminUser | null>(null);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<AdminUser | null>(null);

  // Toast / Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch users
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchAdminUsers({
        page,
        limit,
        search: debouncedSearch,
        role: roleFilter,
        sortBy,
        sortOrder,
      });
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user list');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated, loadUsers]);

  // Handle Ban / Unban Toggle
  const handleToggleBan = async (user: AdminUser) => {
    if (user._id === currentAdmin?.id) {
      showToast('⚠️ Cannot ban your own account');
      return;
    }

    const newBanStatus = !user.isBanned;
    try {
      await updateUserDetails(user._id, { isBanned: newBanStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBanned: newBanStatus } : u))
      );
      showToast(
        newBanStatus
          ? `🚫 User ${user.name} has been BANNED`
          : `✅ User ${user.name} has been UNBANNED`
      );
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  // Filter client-side by status if needed
  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'banned') return u.isBanned === true;
    if (statusFilter === 'active') return !u.isBanned;
    return true;
  });

  // Calculate statistics
  const totalUsersCount = pagination.total;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;
  const adminsCount = users.filter((u) => u.role === 'admin' || u.role === 'superadmin').length;
  const activeSubscribersCount = users.filter((u) => u.subscriptionStatus === 'active').length;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-60 bg-card border border-primary/40 text-foreground px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="GoCal AI Logo" className="h-8 w-auto" />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary rounded-full border border-primary/20">
              Admin Portal
            </span>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Current Admin Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/60 text-xs">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {currentAdmin?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left leading-tight">
                <p className="font-semibold text-foreground">{currentAdmin?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">
                  {currentAdmin?.role}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/dashboard/login');
              }}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Toggle Dashboard Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pt-3 pb-2 border-t border-border mt-3 space-y-3"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {currentAdmin?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-sm">{currentAdmin?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentAdmin?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/dashboard/login');
                }}
                className="w-full gap-2 text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              View, assign roles, manage subscriptions, ban or remove user accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={isLoading}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Analytics Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-extrabold mt-1">{totalUsersCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Admins & Superadmins */}
          <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Admins
              </p>
              <h3 className="text-2xl font-extrabold mt-1">{adminsCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Active Subscribers */}
          <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active Subscribers
              </p>
              <h3 className="text-2xl font-extrabold mt-1">{activeSubscribersCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Banned Users */}
          <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Banned Users
              </p>
              <h3 className="text-2xl font-extrabold mt-1">{bannedUsersCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="banned">Banned Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs flex items-center justify-between font-medium cursor-pointer hover:bg-muted/50"
              >
                <span>Sort: {sortBy === 'createdAt' ? 'Joined Date' : sortBy}</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl text-destructive text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={loadUsers} className="cursor-pointer">
              Retry
            </Button>
          </div>
        )}

        {/* User Content: Desktop Table & Mobile Cards */}
        {isLoading ? (
          <div className="py-16 text-center bg-card/50 border border-border/80 rounded-2xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-medium">Fetching accounts database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center bg-card/50 border border-border/80 rounded-2xl space-y-3">
            <Users className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-sm">No users found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No matching records found for the applied search filters. Try adjusting your search query.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-card/90 border border-border/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Subscription</th>
                      <th className="py-3.5 px-4">Joined</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                        {/* Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="truncate max-w-[200px]">
                              <p className="font-semibold text-foreground truncate">{u.name}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                              u.role === 'superadmin'
                                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                : u.role === 'admin'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-muted text-muted-foreground border border-border'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {u.role}
                          </span>
                        </td>

                        {/* Status (Active vs Banned) */}
                        <td className="py-3.5 px-4">
                          {u.isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <Ban className="w-3 h-3" /> Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>

                        {/* Subscription */}
                        <td className="py-3.5 px-4 capitalize">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                              u.subscriptionStatus === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : u.subscriptionStatus === 'trial'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {u.subscriptionStatus || 'inactive'}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Change Role Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedRoleUser(u)}
                              title="Change User Role"
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Ban / Unban Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleBan(u)}
                              title={u.isBanned ? 'Unban User' : 'Ban User'}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                u.isBanned
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                                  : 'border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedEditUser(u)}
                              title="Edit User Details"
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedDeleteUser(u)}
                              title="Delete Account"
                              className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{u.name}</h4>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.role === 'superadmin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : u.role === 'admin'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      {u.isBanned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className="capitalize text-muted-foreground">
                        {u.subscriptionStatus || 'inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRoleUser(u)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBan(u)}
                        className={`p-1.5 rounded-lg border ${
                          u.isBanned
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEditUser(u)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDeleteUser(u)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="bg-card/90 border border-border/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <p className="text-muted-foreground">
                Showing Page <strong className="text-foreground">{pagination.page}</strong> of{' '}
                <strong className="text-foreground">{pagination.totalPages}</strong> ({pagination.total}{' '}
                total records)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages || isLoading}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      {selectedRoleUser && (
        <UserRoleModal
          user={selectedRoleUser}
          currentUserRole={currentAdmin?.role || 'admin'}
          onClose={() => setSelectedRoleUser(null)}
          onSuccess={(updatedUser) => {
            setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
            showToast(`✅ Updated role for ${updatedUser.name} to ${updatedUser.role}`);
          }}
        />
      )}

      {selectedEditUser && (
        <UserEditModal
          user={selectedEditUser}
          onClose={() => setSelectedEditUser(null)}
          onSuccess={(updatedUser) => {
            setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
            showToast(`✅ Profile details updated for ${updatedUser.name}`);
          }}
        />
      )}

      {selectedDeleteUser && (
        <UserDeleteModal
          user={selectedDeleteUser}
          currentUserId={currentAdmin?.id || ''}
          currentUserRole={currentAdmin?.role || 'admin'}
          onClose={() => setSelectedDeleteUser(null)}
          onSuccess={(deletedId) => {
            setUsers((prev) => prev.filter((u) => u._id !== deletedId));
            setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            showToast('🗑️ Account deleted successfully');
          }}
        />
      )}
    </div>
  );
}
