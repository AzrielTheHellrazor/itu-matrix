"use client";

import React, { useState } from "react";
import { Play, Copy, Check, FileCode } from "lucide-react";

export interface CodeTab {
  id: string;
  filename: string;
  language: string;
  code: string;
  output: string[];
}

export const CODE_TABS: CodeTab[] = [
  {
    id: "autonomous_nav",
    filename: "autonomous_nav.py",
    language: "python",
    code: `import rclpy
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

def execute_autonomous_mission():
    rclpy.init()
    nav = BasicNavigator()
    
    # Set MDRS Utah GPS waypoint coordinates
    goal_pose = PoseStamped()
    goal_pose.header.frame_id = 'map'
    goal_pose.pose.position.x = 38.4065
    goal_pose.pose.position.y = -110.7925
    
    nav.goToPose(goal_pose)
    while not nav.isTaskComplete():
        feedback = nav.getFeedback()
        print(f"[NAV2] Waypoint distance: {feedback.distance_remaining:.2f}m")
    
    print("[NAV2] Goal reached successfully.")
    return True`,
    output: [
      "[INFO] [nav2_navigator]: Initializing Nav2 Autonomous Waypoint Follower...",
      "[INFO] [slam_toolbox]: Localization verified. Global costmap updated.",
      "[NAV2] Waypoint distance: 14.82m",
      "[NAV2] Waypoint distance: 6.40m",
      "[NAV2] Goal reached successfully.",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "arm_kinematics",
    filename: "arm_kinematics.py",
    language: "python",
    code: `import numpy as np
from ikfast_solver import IKFastSolver

def compute_ik(target_x, target_y, target_z, roll=0, pitch=0, yaw=0):
    solver = IKFastSolver(dof=6, payload_limit_kg=3.5)
    target_pose = np.array([target_x, target_y, target_z, roll, pitch, yaw])
    
    joint_angles = solver.calculate_joint_angles(target_pose)
    if joint_angles is not None:
        print(f"[IK] 6-DOF solution converged: {joint_angles}")
        return joint_angles
    return None`,
    output: [
      "[INFO] IKFast solver loaded for 6-DOF carbon fiber manipulator.",
      "[IK] Computing inverse kinematics for sample acquisition target...",
      "[IK] 6-DOF solution converged: [-12.4°, +34.2°, -45.1°, +10.0°, +85.3°, 0.0°]",
      "[INFO] Joint torque within 45 Nm limits. Gripper state: READY.",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "sensor_fusion",
    filename: "sensor_fusion.py",
    language: "python",
    code: `import numpy as np
from robot_localization import ExtendedKalmanFilter

def fuse_telemetry(imu_data, lidar_odometry, rtk_gps):
    ekf = ExtendedKalmanFilter(state_dim=15)
    ekf.predict(dt=0.02)
    state = ekf.update(imu=imu_data, lidar=lidar_odometry, gps=rtk_gps)
    print(f"[EKF] Fused state estimate: {state.position}")
    return state`,
    output: [
      "[INFO] [ekf_node]: Extended Kalman Filter node online at 50Hz.",
      "[EKF] Fusing 9-DOF IMU, 360 LiDAR odometry, and RTK-GNSS stream.",
      "[EKF] Fused state estimate: [X: 142.12m, Y: -84.30m, Z: 0.12m]",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "science_spectrometry",
    filename: "science_spectrometry.py",
    language: "python",
    code: `import numpy as np
from scipy.signal import find_peaks

def analyze_raman_spectrum(wavelengths, intensities):
    peaks, _ = find_peaks(intensities, height=0.6, distance=15)
    biomarkers = ['ATP', 'Amino_Acids', 'Carotenoids']
    detected = [biomarkers[i % len(biomarkers)] for i in peaks]
    print(f"[SCIENCE] In-situ sample processed. Detected: {detected}")
    return detected`,
    output: [
      "[INFO] Science Lab Auger drill completed 100mm core extraction.",
      "[SCIENCE] In-situ sample 04-B processed. Carousel chamber 2 locked.",
      "[SPECTRA] Raman peak detected at 1085 cm^-1 (Carbonate).",
      "[BIO] Organic biomarker confidence: 94.2%.",
      "Process finished with exit code 0",
    ],
  },
];

export function PyCharmWindow() {
  const [activeTab, setActiveTab] = useState(CODE_TABS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [stdout, setStdout] = useState<string[]>([]);

  const handleRun = () => {
    setIsRunning(true);
    setStdout(activeTab.output);
  };

  return (
    <div
      data-testid="pycharm-window"
      className="w-full rounded-xl bg-surface border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col font-mono"
    >
      {/* IDE Window Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-canvas/80 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
          <span className="ml-2 text-xs text-zinc-400 font-mono">
            itu_matrix &mdash; PyCharm IDE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            data-testid="run-simulation-btn"
            onClick={handleRun}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#27C93F]/20 hover:bg-[#27C93F]/30 text-[#27C93F] border border-[#27C93F]/30 text-xs transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Code Tab Bar */}
      <div data-testid="code-tabs" className="flex items-center overflow-x-auto bg-surface border-b border-white/5 px-2">
        {CODE_TABS.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.filename}
            onClick={() => {
              setActiveTab(tab);
              setStdout([]);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs border-b-2 transition-all whitespace-nowrap ${
              activeTab.id === tab.id
                ? "border-accent-yellow text-accent-yellow bg-white/5 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{tab.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Editor Area */}
      <div className="p-4 bg-canvas/60 text-xs font-mono overflow-x-auto min-h-[220px]">
        <pre className="text-zinc-300 leading-relaxed">
          <code>{activeTab.code}</code>
        </pre>
      </div>

      {/* Execution Stdout Console */}
      {stdout.length > 0 && (
        <div data-testid="simulation-stdout" className="border-t border-white/10 bg-canvas p-3 text-xs font-mono">
          <div className="text-zinc-500 mb-1 border-b border-white/5 pb-1">Run: {activeTab.filename}</div>
          <div className="space-y-1 text-zinc-300">
            {stdout.map((line, idx) => (
              <div key={idx} className={line.includes("exit code 0") ? "text-[#27C93F]" : ""}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
