'use client'

import { useDashboardStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Globe, 
  Camera,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function ProfileSettings() {
  const { role } = useDashboardStore()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Left Column: Profile Card */}
      <div className="lg:col-span-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 relative overflow-hidden"
        >
          {/* Accent Background */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-10" />
          
          <div className="relative flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <Avatar className="h-28 w-28 rounded-3xl ring-4 ring-white shadow-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} />
                <AvatarFallback className="bg-emerald-50 text-3xl font-black text-emerald-600">
                  {role === 'admin' ? 'AD' : 'VW'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/40 hover:scale-110 active:scale-95 transition-all">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-emerald-950">Zorvyn User</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{role} Account</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                <p className="text-xl font-black text-emerald-600">98.4%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Since</p>
                <p className="text-xl font-black text-emerald-600">2024</p>
              </div>
            </div>

            <Button className="w-full mt-8 rounded-2xl bg-emerald-950 hover:bg-emerald-900 h-12 shadow-lg shadow-emerald-900/20 gap-2 font-bold">
              <ExternalLink className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </motion.div>

        <div className="rounded-3xl bg-emerald-950 p-8 text-white shadow-xl shadow-emerald-950/20">
          <h3 className="text-lg font-black mb-4">Security Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wide">2FA Active</span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wide">Privacy Level</span>
              </div>
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">MAX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Columns: Forms */}
      <div className="lg:col-span-2 space-y-8">
        {/* Personal Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Full Name</Label>
              <Input defaultValue="Zorvyn User" className="rounded-2xl h-12 bg-slate-50 border-slate-100 font-bold focus:ring-emerald-500 focus:border-emerald-500 transition-all px-5" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Email Address</Label>
              <Input defaultValue="user@zorvyn.com" className="rounded-2xl h-12 bg-slate-50 border-slate-100 font-bold focus:ring-emerald-500 focus:border-emerald-500 transition-all px-5" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Bio / Role Description</Label>
              <Input defaultValue="Professional financial analyst managing growth assets and risk profiles." className="rounded-2xl h-12 bg-slate-50 border-slate-100 font-bold focus:ring-emerald-500 focus:border-emerald-500 transition-all px-5" />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-8 h-12 font-black shadow-lg shadow-emerald-600/20">
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* System & Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Account Preferences</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Bell className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="font-black text-emerald-950">Email Notifications</p>
                  <p className="text-xs font-bold text-slate-400">Activity summaries and critical alerts</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="font-black text-emerald-950">Biometric Access</p>
                  <p className="text-xs font-bold text-slate-400">Enhanced security for transaction approvals</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-emerald-600" />
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Mail className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="font-black text-emerald-950">Newsletter & Insights</p>
                  <p className="text-xs font-bold text-slate-400">Monthly market analysis and reports</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
