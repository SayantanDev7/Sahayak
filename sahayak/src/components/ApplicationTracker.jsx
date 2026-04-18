import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FileText, Search, CheckCircle, FileWarning } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';

const trackerStages = [
  { id: 1, label: "Application Submitted", icon: FileText, status: "completed", date: "Oct 12" },
  { id: 2, label: "Document Verification", icon: Search, status: "active", date: "In Progress" },
  { id: 3, label: "Under Review (Officer)", icon: FileWarning, status: "pending", date: "Pending" },
  { id: 4, label: "Final Approval", icon: CheckCircle, status: "pending", date: "Pending" }
];

export function ApplicationTracker() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Application ID
            </p>
            <h3
              className="text-2xl font-black mt-1"
              style={{ color: "#000080" }} // navy
            >
              #RKA-992-11
            </h3>
          </div>

          <div className="text-right">
            <span
              className="inline-block px-4 py-2 font-bold rounded-lg text-lg"
              style={{
                backgroundColor: "#FFF3E0",
                color: "#FF9933"
              }} // saffron
            >
              In Progress
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4
          className="text-xl font-bold mb-8 mt-2"
          style={{ color: "#000080" }} // navy
        >
          Scholarship Application Status
        </h4>

        <div className="relative">
          <div className="absolute left-[28px] top-4 bottom-10 w-1.5 bg-gray-200 rounded-full z-0"></div>

          <ol className="space-y-10 relative z-10">
            {trackerStages.map((stage, index) => {
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "active";
              const isPending = stage.status === "pending";

              const Icon = stage.icon;

              return (
                <li key={stage.id} className="flex items-start">
                  
                  {/* Node */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-center justify-center w-14 h-14 rounded-full border-4 z-10 shrink-0"
                    style={{
                      backgroundColor: isCompleted
                        ? "#138808"
                        : isActive
                        ? "#ffffff"
                        : "#ffffff",
                      borderColor: isCompleted
                        ? "#138808"
                        : isActive
                        ? "#FF9933"
                        : "#d1d5db",
                      color: isCompleted
                        ? "#ffffff"
                        : isActive
                        ? "#FF9933"
                        : "#9ca3af",
                      boxShadow: isActive
                        ? "0 0 0 4px rgba(255,153,51,0.2)"
                        : "none"
                    }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={isCompleted || isActive ? 2.5 : 2} />
                  </motion.div>

                  {/* Content */}
                  <div className="ml-6 flex-grow pt-2">
                    <h5
                      className="text-2xl font-bold"
                      style={{
                        color: isCompleted
                          ? "#138808"
                          : isActive
                          ? "#000080"
                          : "#9ca3af",
                        textDecoration: isCompleted ? "line-through" : "none",
                        opacity: isCompleted ? 0.8 : 1
                      }}
                    >
                      {stage.label}
                    </h5>

                    {isCompleted && (
                      <p
                        className="text-lg mt-1 font-medium inline-block px-2 rounded"
                        style={{
                          color: "#138808",
                          backgroundColor: "#e6f4ea"
                        }}
                      >
                        Done on {stage.date}
                      </p>
                    )}

                    {isActive && (
                      <motion.p
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-lg mt-1 font-bold"
                        style={{ color: "#FF9933" }}
                      >
                        Currently processing...
                      </motion.p>
                    )}

                    {isPending && (
                      <p className="text-lg text-gray-400 mt-1 font-medium">
                        Waiting for previous step
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}