"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Activity, RefreshCcw, Play, Pause, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { engineTasks, getTaskStatusColor } from "@/lib/mockData";

export default function EnginePage() {
  const [tasks, setTasks] = useState(engineTasks);
  const [isPaused, setIsPaused] = useState(false);

  // Task processing simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'running') {
          const newProgress = Math.min(100, task.progress + Math.floor(Math.random() * 5));
          if (newProgress === 100) {
            return { 
              ...task, 
              progress: 100, 
              status: 'completed' as const, 
              completedAt: 'Just now' 
            };
          }
          return { ...task, progress: newProgress };
        }
        
        // Occasionally "revive" queued or failed tasks for demo purposes
        if (task.status === 'queued' && Math.random() > 0.9) {
          return { ...task, status: 'running' as const, startedAt: 'Just now', progress: 0, worker: 'worker-delta-01' };
        }

        return task;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeWorkerCount = 4;
  const queueLength = tasks.filter(t => t.status === 'queued').length;
  const totalProcessed = tasks.filter(t => t.status === 'completed').length;
  const errorRate = ((tasks.filter(t => t.status === 'failed').length / tasks.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Engine Intelligence Simulator</h1>
          <p className="text-sm mt-1 text-gray-400 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Backend Task Pipeline (Celery + Redis Broker)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-lg border transition-all ${
              isPaused ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
            }`}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-dark-700 border border-glass-border rounded-lg text-xs font-bold text-white hover:bg-dark-600 transition-all">
            <RefreshCcw className="w-4 h-4" /> Clear Queue
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-accent-gold text-dark-900 rounded-lg text-xs font-bold hover:brightness-110 transition-all">
            <Activity className="w-4 h-4" /> Trigger Global Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Workers', value: activeWorkerCount, icon: Cpu, color: 'text-blue-400' },
          { label: 'Tasks in Queue', value: queueLength, icon: Database, color: 'text-orange-400' },
          { label: 'Total Processed', value: totalProcessed, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pipeline Failure Rate', value: `${errorRate}%`, icon: AlertCircle, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div className="w-2 h-2 rounded-full bg-green-500 status-live"></div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Live Task Pipeline</h3>
            <span className="text-[10px] font-mono text-gray-500">POLLING: 2000ms</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-glass-border">
                  <th className="pb-3 font-medium">Task ID / Name</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Worker / Node</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <motion.tr 
                      key={task.id} 
                      layout 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group"
                    >
                      <td className="py-4">
                        <div className="max-w-[200px]">
                          <p className="text-xs font-bold text-white truncate">{task.name}</p>
                          <p className="text-[10px] font-mono text-gray-500">{task.id}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                          style={{ 
                            backgroundColor: `${getTaskStatusColor(task.status)}15`, 
                            color: getTaskStatusColor(task.status),
                            border: `1px solid ${getTaskStatusColor(task.status)}30`
                          }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-xs font-mono text-gray-400">{task.worker}</p>
                      </td>
                      <td className="py-4 w-40">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: getTaskStatusColor(task.status) }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-gray-500">{task.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Pipeline Metrics</h3>
            <div className="space-y-5">
              {[
                { label: 'CPU Usage', val: '42%', color: 'bg-blue-500' },
                { label: 'Memory Usage', val: '2.8GB', color: 'bg-purple-500' },
                { label: 'Redis Ops/sec', val: '1.2K', color: 'bg-red-500' },
                { label: 'Message Latency', val: '12ms', color: 'bg-green-500' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-400">{metric.label}</span>
                    <span className="text-xs font-bold text-white">{metric.val}</span>
                  </div>
                  <div className="w-full h-1 bg-dark-600 rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} w-[60%]`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">Worker Logs</h3>
            <div className="space-y-3 font-mono text-[10px]">
              {[
                { time: '18:42:01', msg: '[worker-alpha-01] Received task data_ingest', type: 'info' },
                { time: '18:41:55', msg: '[worker-beta-03] Sentiment analysis bloom-7b model loaded', type: 'success' },
                { time: '18:41:30', msg: '[scheduler] Generating 12 periodic scan tasks', type: 'info' },
                { time: '18:40:12', msg: '[worker-gamma-02] ERROR: DNS Timeout on GDELT mirror', type: 'error' },
                { time: '18:39:50', msg: '[redis] Cleaning up expired keys', type: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-gray-600 shrink-0">{log.time}</span>
                  <span className={
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    'text-gray-400'
                  }>{log.msg}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-glass-border rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white/5 transition-all">
              View Full Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
