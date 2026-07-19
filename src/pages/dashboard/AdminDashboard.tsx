import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  fetchAdminUsers,
  updateUserDetails,
  fetchAdminSubscriptionPlans,
  type AdminUser,
  type SubscriptionPlan,
  type Pagination,
} from '@/lib/api';
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
  UserCheck,
  Menu,
  X,
  Loader2,
  ArrowUpDown,
  Sparkles,
  Check,
  Zap,
  Shield,
  FileText,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { UserRoleModal } from './components/UserRoleModal';
import { UserEditModal } from './components/UserEditModal';
import { UserDeleteModal } from './components/UserDeleteModal';
import { PlanEditModal } from './components/PlanEditModal';
import { LegalContentManager } from './components/LegalContentManager';

type DashboardTab = 'users' | 'plans' | 'privacy' | 'terms';

export default function AdminDashboard() {
  const { user: currentAdmin, isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dashboard/login');
    }
  }, [isAuthenticated, navigate]);

  // Tab State: 'users' | 'plans' | 'privacy' | 'terms'
  const [activeTab, setActiveTab] = useState<DashboardTab>('users');

  // Sidebar Collapse state (desktop)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Users Data State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscription Plans State
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SubscriptionPlan | null>(null);

  // Filters & Pagination params for Users
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const sortBy = 'createdAt';
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // User Modals state
  const [selectedRoleUser, setSelectedRoleUser] = useState<AdminUser | null>(null);
  const [selectedEditUser, setSelectedEditUser] = useState<AdminUser | null>(null);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<AdminUser | null>(null);

  // Toast / Banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      setIsLoadingUsers(true);
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
      setIsLoadingUsers(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, sortBy, sortOrder]);

  // Fetch subscription plans
  const loadPlans = useCallback(async () => {
    try {
      setIsLoadingPlans(true);
      const res = await fetchAdminSubscriptionPlans();
      setPlans(res.plans);
    } catch (err: any) {
      showToast(`❌ Failed to fetch plans: ${err.message}`);
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadPlans();
    }
  }, [isAuthenticated, loadUsers, loadPlans]);

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

  // Filter client-side by status
  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'banned') return u.isBanned === true;
    if (statusFilter === 'active') return !u.isBanned;
    return true;
  });

  // Calculate statistics
  const totalUsersCount = pagination.total;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;
  const adminsCount = users.filter((u) => u.role === 'admin' || u.role === 'superadmin').length;
  const activeSubscribersCount = users.filter((u) => u.currentPlan === 'premium' || u.subscriptionStatus === 'active').length;

  if (!isAuthenticated) return null;

  const navItems = [
    {
      id: 'users' as DashboardTab,
      label: 'User Management',
      icon: Users,
      badge: totalUsersCount > 0 ? totalUsersCount.toString() : undefined,
    },
    {
      id: 'plans' as DashboardTab,
      label: 'Subscription Plans',
      icon: CreditCard,
      badge: 'PRO',
    },
    {
      id: 'privacy' as DashboardTab,
      label: 'Privacy Policy Manager',
      icon: Shield,
    },
    {
      id: 'terms' as DashboardTab,
      label: 'Terms Manager',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-60 bg-slate-900/90 border border-emerald-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs font-semibold"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar (UI UX Pro Max) */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-slate-900/80 backdrop-blur-2xl transition-all duration-300 z-40 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20 p-3' : 'w-72 p-5'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <img src={logo} alt="GoCal AI Logo" className="h-8 w-auto shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-white text-base tracking-tight">GoCal AI</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
                Navigation Menu
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
                        isActive
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-white/10'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Card & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                {currentAdmin?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="font-bold text-xs text-white truncate">{currentAdmin?.name}</p>
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {currentAdmin?.role}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              navigate('/dashboard/login');
            }}
            className={`w-full gap-2 text-xs font-semibold cursor-pointer border-white/10 bg-slate-900 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all ${
              sidebarCollapsed ? 'p-2 justify-center' : 'justify-start px-3.5 py-2.5'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="GoCal AI Logo" className="h-7 w-auto" />
          <span className="font-extrabold text-sm text-white">GoCal AI Admin</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden z-30 bg-slate-900 border-b border-white/10 p-4 space-y-3"
          >
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  {currentAdmin?.name?.charAt(0) || 'A'}
                </div>
                <span className="text-xs font-semibold text-white">{currentAdmin?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/dashboard/login');
                }}
                className="gap-1.5 text-xs text-rose-400 border-rose-500/30"
              >
                <LogOut className="w-3 h-3" /> Exit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Stats Grid */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">User Management</h1>
                <p className="text-xs text-slate-400 mt-1">
                  View accounts, assign roles, manage subscriptions, ban or remove users
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadUsers}
                disabled={isLoadingUsers}
                className="gap-2 text-xs font-medium border-white/10 bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>

            {error && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <span>⚠️ {error}</span>
                <Button variant="outline" size="sm" onClick={loadUsers} className="border-rose-500/30 text-rose-300 hover:bg-rose-500/20">
                  Retry
                </Button>
              </div>
            )}

            {/* Analytics Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</p>
                  <h3 className="text-2xl font-black text-white mt-1">{totalUsersCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admins</p>
                  <h3 className="text-2xl font-black text-white mt-1">{adminsCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Subscribers</p>
                  <h3 className="text-2xl font-black text-white mt-1">{activeSubscribersCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between backdrop-blur-xl">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Banned Users</p>
                  <h3 className="text-2xl font-black text-white mt-1">{bannedUsersCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar Section */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-4 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="banned">Banned Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 flex items-center justify-between font-medium cursor-pointer hover:bg-white/5"
                  >
                    <span>Sort: Joined Date</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* User Content Table */}
            {isLoadingUsers ? (
              <div className="py-16 text-center bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-xs text-slate-400 font-medium">Fetching accounts database...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/50 border border-white/10 rounded-2xl space-y-3">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-semibold text-sm text-white">No users found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No matching records found for the applied search filters.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/60 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">User</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Plan</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Joined</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                                  {u.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="truncate max-w-[200px]">
                                  <p className="font-semibold text-white truncate">{u.name}</p>
                                  <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                                  u.role === 'superadmin'
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                    : u.role === 'admin'
                                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                    : 'bg-slate-800 text-slate-300 border border-white/10'
                                }`}
                              >
                                <ShieldCheck className="w-3 h-3" />
                                {u.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {u.currentPlan === 'premium' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  <Sparkles className="w-3 h-3" /> PREMIUM
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-white/10">
                                  BASIC
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              {u.isBanned ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                  <Ban className="w-3 h-3" /> Banned
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(u.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRoleUser(u)}
                                  title="Change User Role"
                                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleBan(u)}
                                  title={u.isBanned ? 'Unban User' : 'Ban User'}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    u.isBanned
                                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                                      : 'border-white/10 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400'
                                  }`}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedEditUser(u)}
                                  title="Edit User Details"
                                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDeleteUser(u)}
                                  title="Delete Account"
                                  className="p-1.5 rounded-lg border border-white/10 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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

                {/* Pagination Controls */}
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs backdrop-blur-xl">
                  <p className="text-slate-400">
                    Showing Page <strong className="text-white">{pagination.page}</strong> of{' '}
                    <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total records)
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || isLoadingUsers}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="gap-1 cursor-pointer border-white/10 bg-slate-950 text-slate-300 hover:text-white"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= pagination.totalPages || isLoadingUsers}
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className="gap-1 cursor-pointer border-white/10 bg-slate-950 text-slate-300 hover:text-white"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: SUBSCRIPTION PLANS MANAGEMENT */}
        {activeTab === 'plans' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Subscription Plans</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Configure plan pricing, daily scan limits, and feature offerings
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPlans}
                disabled={isLoadingPlans}
                className="gap-2 text-xs font-medium border-white/10 bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlans ? 'animate-spin' : ''}`} />
                Refresh Plans
              </Button>
            </div>

            {isLoadingPlans ? (
              <div className="py-16 text-center bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs text-slate-400 font-medium">Loading subscription plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((p) => {
                  const isPremium = p.type === 'premium';
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative bg-slate-900/80 rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between shadow-2xl backdrop-blur-xl ${
                        isPremium
                          ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950/90 ring-1 ring-amber-500/30'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                isPremium
                                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {p.name}
                            </span>
                            {isPremium && (
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                <Sparkles className="w-3.5 h-3.5" /> POPULAR
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1 my-4">
                          <span className="text-4xl font-black text-white">${p.price.toFixed(2)}</span>
                          <span className="text-slate-400 text-xs font-semibold uppercase">
                            / {p.billingCycle}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/5 my-4 text-xs">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">AI Food Scans</p>
                            <p className="font-extrabold text-slate-200 mt-0.5">
                              {p.dailyLimits?.foodScans === -1 ? 'Unlimited' : `${p.dailyLimits?.foodScans}/day`}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Barcode + OCR</p>
                            <p className="font-extrabold text-slate-200 mt-0.5">
                              {p.dailyLimits?.productScans === -1 ? 'Unlimited' : `${p.dailyLimits?.productScans}/day`}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5 my-6">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Included Features:
                          </p>
                          {p.features?.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedPlanForEdit(p)}
                        className={`w-full gap-2 font-bold cursor-pointer transition-all ${
                          isPremium
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Zap className="w-4 h-4" /> Edit {p.name} Details
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRIVACY POLICY MANAGER */}
        {activeTab === 'privacy' && (
          <div className="animate-in fade-in duration-300">
            <LegalContentManager type="privacy" />
          </div>
        )}

        {/* TAB 4: TERMS MANAGER */}
        {activeTab === 'terms' && (
          <div className="animate-in fade-in duration-300">
            <LegalContentManager type="terms" />
          </div>
        )}
      </main>

      {/* User Modals */}
      {selectedRoleUser && (
        <UserRoleModal
          user={selectedRoleUser}
          currentUserRole={currentAdmin?.role || 'admin'}
          onClose={() => setSelectedRoleUser(null)}
          onSuccess={(updatedUser) => {
            showToast(`Role for ${updatedUser.name} updated to ${updatedUser.role}`);
            setSelectedRoleUser(null);
            loadUsers();
          }}
        />
      )}

      {selectedEditUser && (
        <UserEditModal
          user={selectedEditUser}
          onClose={() => setSelectedEditUser(null)}
          onSuccess={(updatedUser) => {
            showToast(`User ${updatedUser.name} updated successfully`);
            setSelectedEditUser(null);
            loadUsers();
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
            showToast(`User account deleted successfully (${deletedId})`);
            setSelectedDeleteUser(null);
            loadUsers();
          }}
        />
      )}

      {/* Plan Edit Modal */}
      {selectedPlanForEdit && (
        <PlanEditModal
          plan={selectedPlanForEdit}
          onClose={() => setSelectedPlanForEdit(null)}
          onSuccess={(updatedPlan) => {
            showToast(`Subscription plan ${updatedPlan.name} updated successfully`);
            setSelectedPlanForEdit(null);
            loadPlans();
          }}
        />
      )}
    </div>
  );
}
