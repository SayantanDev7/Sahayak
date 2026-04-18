import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, CheckCircle, FileWarning } from 'lucide-react';

const trackerStages = [
  { id: 1, label: "Application Submitted", icon: FileText, status: "completed", date: "Oct 12" },
  { id: 2, label: "Document Verification", icon: Search, status: "active", date: "In Progress" },
  { id: 3, label: "Under Review (Officer)", icon: FileWarning, status: "pending", date: "Pending" },
  { id: 4, label: "Final Approval", icon: CheckCircle, status: "pending", date: "Pending" }
];

export function ApplicationTracker() {
  return (
    <div className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Application ID
            </p>
            <h3 className="text-2xl font-black mt-1 text-white">
              #RKA-992-11
            </h3>
          </div>
          <span className="inline-block px-4 py-2 font-bold rounded-lg text-base bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
            In Progress
          </span>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold mb-8 text-gray-300">
          Application Status Tracker
        </h4>

        <div className="relative">
          <div className="absolute left-[28px] top-4 bottom-10 w-1 bg-white/10 rounded-full z-0"></div>

          <ol className="space-y-8 relative z-10">
            {trackerStages.map((stage, index) => {
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "active";
              const isPending = stage.status === "pending";
              const Icon = stage.icon;

              return (
                <li key={stage.id} className="flex items-start">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-center justify-center w-14 h-14 rounded-full border-2 z-10 shrink-0"
                    style={{
                      backgroundColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.05)',
                      borderColor: isCompleted ? '#22c55e' : isActive ? '#ccff00' : 'rgba(255,255,255,0.15)',
                      color: isCompleted ? '#ffffff' : isActive ? '#ccff00' : 'rgba(255,255,255,0.3)',
                      boxShadow: isActive ? '0 0 0 4px rgba(204,255,0,0.15)' : 'none'
                    }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={isCompleted || isActive ? 2.5 : 2} />
                  </motion.div>

                  <div className="ml-5 flex-grow pt-2">
                    <h5
                      className="text-xl font-bold"
                      style={{
                        color: isCompleted ? '#22c55e' : isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        opacity: isCompleted ? 0.8 : 1
                      }}
                    >
                      {stage.label}
                    </h5>

                    {isCompleted && (
                      <p className="text-base mt-1 font-medium inline-block px-2 rounded bg-green-500/10 text-green-400">
                        Done on {stage.date}
                      </p>
                    )}

                    {isActive && (
                      <motion.p
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-base mt-1 font-bold text-[#ccff00]"
                      >
                        Currently processing...
                      </motion.p>
                    )}

                    {isPending && (
                      <p className="text-base text-gray-600 mt-1 font-medium">
                        Waiting for previous step
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}