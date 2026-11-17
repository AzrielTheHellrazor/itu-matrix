"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Terminal, Copy, Check, FileCode2, GitBranch } from "lucide-react";
import { CodeSnippetTab, CODE_SNIPPETS, DARCULA_PALETTE } from "@/data/code-snippets";

const PYCHARM_SNIPPETS: CodeSnippetTab[] = [
  {
    id: "autonomous-nav",
    filename: "autonomous_nav.py",
    language: "python",
    subsystem: "Autonomous Software Systems",
    path: "itu_matrix > src > autonomy > autonomous_nav.py",
    description:
      "ROS 2 Nav2 Simple Commander autonomous waypoint navigation and dynamic terrain costmap traversal.",
    code: `import rclpy
from rclpy.node import Node
from nav2_simple_commander.robot_navigator import BasicNavigator, TaskResult
from geometry_msgs.msg import PoseStamped


class AutonomousNavNode(Node):
    """
    ITU Matrix Planetary Rover - Autonomous Waypoint Navigation Node.
    Coordinates ROS 2 Nav2 Simple Commander with dynamic costmap layers.
    """

    def __init__(self):
        super().__init__("autonomous_nav_controller")
        self.navigator = BasicNavigator()
        self.get_logger().info("ROS 2 Nav2 Simple Commander Initialized.")

    def navigate_to_waypoint(self, x: float, y: float, yaw: float) -> bool:
        goal_pose = PoseStamped()
        goal_pose.header.frame_id = "map"
        goal_pose.header.stamp = self.navigator.get_clock().now().to_msg()
        goal_pose.pose.position.x = x
        goal_pose.pose.position.y = y
        goal_pose.pose.orientation.w = 1.0

        self.navigator.goToPose(goal_pose)
        while not self.navigator.isTaskComplete():
            feedback = self.navigator.getFeedback()
            self.get_logger().info(
                f"Distance remaining: {feedback.distance_remaining:.2f} m"
            )

        result = self.navigator.getResult()
        if result == TaskResult.SUCCEEDED:
            self.get_logger().info(
                "Goal waypoint reached successfully with 99.4% confidence."
            )
            return True
        return False


def main(args=None):
    rclpy.init(args=args)
    nav_node = AutonomousNavNode()
    nav_node.navigate_to_waypoint(38.4065, -110.7925, 0.0)
    rclpy.shutdown()


if __name__ == "__main__":
    main()`,
    output: [
      "[INFO] [autonomous_nav_controller]: ROS 2 Nav2 Simple Commander Initialized.",
      "[INFO] [autonomous_nav_controller]: Global Costmap loaded (Resolution: 0.05m/cell).",
      "[INFO] [autonomous_nav_controller]: Target waypoint dispatched: MDRS Utah [38.4065°N, 110.7925°W].",
      "[INFO] [autonomous_nav_controller]: D* Lite path generated: 42 waypoints over rough terrain.",
      "[INFO] [autonomous_nav_controller]: Traversal underway: 1.2 m/s velocity clamp.",
      "[INFO] [autonomous_nav_controller]: Distance remaining: 14.80 m",
      "[INFO] [autonomous_nav_controller]: Distance remaining: 0.02 m",
      "[INFO] [autonomous_nav_controller]: Goal waypoint reached successfully with 99.4% confidence.",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "arm-kinematics",
    filename: "arm_kinematics.py",
    language: "python",
    subsystem: "Mechanical & Structural Engineering",
    path: "itu_matrix > src > manipulator > arm_kinematics.py",
    description:
      "Analytical 6-DOF inverse kinematics solver with sub-millimeter torque-limited precision.",
    code: `import numpy as np
from itu_matrix_arm.ikfast import IKFastSolver
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint


class MatrixArmController:
    """
    ITU Matrix 6-DOF Precision Robotic Manipulator Controller.
    Utilizes analytical IKFastSolver for closed-loop sub-millimeter positioning.
    Awarded ERC Best Robotic Arm Special Award.
    """

    def __init__(self):
        self.dof = 6
        self.solver = IKFastSolver(model="itu_6dof_carbon_v2")
        self.joint_limits = {
            "J1_base_yaw": (-np.pi, np.pi),
            "J2_shoulder_pitch": (-np.pi / 4, np.pi / 2),
            "J3_elbow_pitch": (-np.pi / 2, np.pi / 2),
            "J4_wrist_pitch": (-np.pi / 2, np.pi / 2),
            "J5_wrist_roll": (-np.pi, np.pi),
            "J6_gripper_roll": (-np.pi, np.pi),
        }

    def compute_ik(self, target_pose: list) -> list:
        """Calculates closed-form inverse kinematics angles in <0.05ms."""
        q_solutions = self.solver.solve_ik(target_pose)
        if not q_solutions:
            raise ValueError("Target coordinate outside reachable workspace.")
        return q_solutions[0]

    def execute_trajectory(self, target_pose: list) -> JointTrajectory:
        joint_angles = self.compute_ik(target_pose)
        trajectory = JointTrajectory()
        point = JointTrajectoryPoint(positions=joint_angles)
        trajectory.points.append(point)
        return trajectory`,
    output: [
      "[INFO] [arm_controller]: Initializing 6-DOF Manipulator Controller (Rover İnan)...",
      "[INFO] [arm_controller]: Analytical IKFastSolver engine loaded: itu_6dof_carbon_v2.",
      "[INFO] [arm_controller]: Target end-effector pose: [x=0.45m, y=-0.20m, z=0.15m].",
      "[INFO] [arm_controller]: compute_ik execution: 8 analytical solutions calculated in 0.042ms.",
      "[INFO] [arm_controller]: Optimal joints: [J1: 14.2°, J2: 32.5°, J3: -45.1°, J4: 12.8°, J5: 0.0°, J6: -15.4°].",
      "[INFO] [arm_controller]: Torque limits verified (42.8 Nm < 60 Nm threshold).",
      "[INFO] [arm_controller]: Trajectory dispatched to CAN-FD bus. Payload secured.",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "sensor-fusion",
    filename: "sensor_fusion.py",
    language: "python",
    subsystem: "Electronics & Avionics Engineering",
    path: "itu_matrix > src > perception > sensor_fusion.py",
    description:
      "Extended Kalman Filter (EKF) state estimation fusing 3D LiDAR, RealSense depth, and BNO055 IMU.",
    code: `import numpy as np
from itu_matrix_autonomy.filters import ExtendedKalmanFilter
from sensor_msgs.msg import Imu, PointCloud2


class MatrixSensorFusionNode:
    """
    Multi-Modal Sensor Fusion via Extended Kalman Filter (EKF).
    Fuses Ouster OS1-32 LiDAR, Intel RealSense D435i, and Bosch BNO055 IMU.
    """

    def __init__(self):
        self.ekf = ExtendedKalmanFilter(dim_x=15, dim_z=9)
        self.state_covariance = np.eye(15) * 1e-3
        self.lidar_hz = 10.0
        self.imu_hz = 100.0

    def predict_imu(self, linear_accel: np.ndarray, angular_velocity: np.ndarray, dt: float):
        """Propagates state forward based on high-frequency IMU dynamics."""
        self.ekf.predict(linear_accel, angular_velocity, dt)

    def update_lidar_odometry(self, measurement: np.ndarray):
        """Corrects state estimation drift with 3D LiDAR scan-to-map registration."""
        self.ekf.update(measurement, sensor_type="lidar_pointcloud")
        return self.ekf.get_current_pose()`,
    output: [
      "[INFO] [sensor_fusion]: Initializing Multi-Modal EKF State Estimator...",
      "[INFO] [sensor_fusion]: Subscribing to Ouster OS1-32 LiDAR point cloud (10 Hz).",
      "[INFO] [sensor_fusion]: Subscribing to Intel RealSense D435i stereo depth (30 Hz).",
      "[INFO] [sensor_fusion]: Subscribing to Bosch BNO055 9-DOF IMU (100 Hz).",
      "[INFO] [sensor_fusion]: ExtendedKalmanFilter state vector initialized: [x, y, z, vx, vy, vz, q0..q3].",
      "[INFO] [sensor_fusion]: LiDAR-Inertial Odometry converged. Drift: <0.02% over 100m.",
      "[INFO] [sensor_fusion]: Robot pose estimate: [38.4065°N, 110.7925°W, Alt: 1420m].",
      "Process finished with exit code 0",
    ],
  },
  {
    id: "science-spectrometry",
    filename: "science_spectrometry.py",
    language: "python",
    subsystem: "Science & Astrobiology",
    path: "itu_matrix > src > science > science_spectrometry.py",
    description:
      "Automated Raman spectrometry and astrobiological biomarker detection assay.",
    code: `import numpy as np
from scipy.signal import find_peaks
from itu_matrix_science.spectrometer import RamanSpectrometer


class ScienceSpectrometrySuite:
    """
    In-situ Astrobiology Analysis Suite - Raman Laser Spectrometer.
    Conferred URC Best Science System Award for autonomous sample evaluation.
    """

    def __init__(self):
        self.spectrometer = RamanSpectrometer(laser_nm=532)
        self.sample_bay = "hermetic_carousel_ch6"

    def analyze_raman_spectrum(self, raw_sample: np.ndarray) -> str:
        """Distinguishes biological signatures from mineral baselines."""
        wavelengths, intensity = self.spectrometer.acquire_scan(integration_ms=2500)
        peaks, _ = find_peaks(intensity, height=0.45, distance=25)

        if any(abs(wavelengths[p] - 1085.0) < 3.0 for p in peaks):
            return "Raman peak detected at 1085 cm^-1: Calcite/Carbonate mineral presence confirmed."

        return "Baseline mineral profile recorded."`,
    output: [
      "[INFO] [science_spectrometry]: Science Carousel Rotary Chamber 3 selected.",
      "[INFO] [science_spectrometry]: 532nm DPSS excitation laser armed. Integration: 2500ms.",
      "[INFO] [science_spectrometry]: Executing analyze_raman_spectrum...",
      "[INFO] [science_spectrometry]: Raman spectral shift curve calculated (200 - 3500 cm^-1).",
      "[INFO] [science_spectrometry]: Raman peak detected at 1085 cm^-1: Calcite/Carbonate mineral presence confirmed.",
      "[INFO] [science_spectrometry]: Biomarker assay: Amino acid fluorescence detected at 460nm.",
      "[INFO] [science_spectrometry]: Astrobiology telemetry packet logged to science database.",
      "Process finished with exit code 0",
    ],
  },
];

interface SyntaxToken {
  text: string;
  color: string;
}

const PYTHON_KEYWORDS = new Set([
  "import", "from", "as", "class", "def", "return", "if", "elif", "else",
  "while", "for", "in", "not", "and", "or", "is", "None", "True", "False",
  "with", "try", "except", "finally", "raise", "pass", "break", "continue",
  "yield", "lambda", "async", "await", "global", "nonlocal", "assert", "del",
]);

export function tokenizePythonDarcula(code: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const pushToken = (text: string, color: string) => {
    if (!text) return;
    const last = tokens[tokens.length - 1];
    if (last && last.color === color && color === DARCULA_PALETTE.identifier) {
      last.text += text;
    } else {
      tokens.push({ text, color });
    }
  };

  let i = 0;
  let expectDefOrClass = false;
  const len = code.length;

  while (i < len) {
    const ch = code[i];

    if (ch === "#") {
      let end = code.indexOf("\n", i);
      if (end === -1) end = len;
      pushToken(code.slice(i, end), DARCULA_PALETTE.comment);
      expectDefOrClass = false;
      i = end;
      continue;
    }

    const isPrefixedString =
      (ch === "f" || ch === "F" || ch === "r" || ch === "R" ||
       ch === "b" || ch === "B" || ch === "u" || ch === "U") &&
      (code[i + 1] === '"' || code[i + 1] === "'");

    if (ch === '"' || ch === "'" || isPrefixedString) {
      const quoteStart = isPrefixedString ? i + 1 : i;
      const quoteChar = code[quoteStart];
      const isTriple =
        code[quoteStart + 1] === quoteChar && code[quoteStart + 2] === quoteChar;

      let j = quoteStart + (isTriple ? 3 : 1);
      while (j < len) {
        if (code[j] === "\\" && j + 1 < len) {
          j += 2;
          continue;
        }
        if (isTriple) {
          if (code[j] === quoteChar && code[j + 1] === quoteChar && code[j + 2] === quoteChar) {
            j += 3;
            break;
          }
        } else {
          if (code[j] === quoteChar) {
            j += 1;
            break;
          }
          if (code[j] === "\n") break;
        }
        j += 1;
      }
      pushToken(code.slice(i, j), DARCULA_PALETTE.string);
      expectDefOrClass = false;
      i = j;
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      const numMatch = code.slice(i).match(/^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
      if (numMatch) {
        pushToken(numMatch[0], DARCULA_PALETTE.number);
        expectDefOrClass = false;
        i += numMatch[0].length;
        continue;
      }
    }

    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_") {
      const idMatch = code.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (idMatch) {
        const word = idMatch[0];
        const nextIdx = i + word.length;
        if (PYTHON_KEYWORDS.has(word)) {
          pushToken(word, DARCULA_PALETTE.keyword);
          expectDefOrClass = word === "def" || word === "class";
        } else if (expectDefOrClass) {
          pushToken(word, DARCULA_PALETTE.function);
          expectDefOrClass = false;
        } else {
          let k = nextIdx;
          while (k < len && (code[k] === " " || code[k] === "\t")) k++;
          if (code[k] === "(") {
            pushToken(word, DARCULA_PALETTE.function);
          } else {
            pushToken(word, DARCULA_PALETTE.identifier);
          }
          expectDefOrClass = false;
        }
        i = nextIdx;
        continue;
      }
    }

    if (ch === " " || ch === "\t") {
      pushToken(ch, DARCULA_PALETTE.identifier);
      i += 1;
      continue;
    }

    pushToken(ch, DARCULA_PALETTE.identifier);
    expectDefOrClass = false;
    i += 1;
  }

  return tokens;
}

const DEFAULT_SNIPPETS: CodeSnippetTab[] =
  CODE_SNIPPETS.length > 0 ? CODE_SNIPPETS : PYCHARM_SNIPPETS;

export interface PyCharmWindowProps {
  snippets?: CodeSnippetTab[];
  className?: string;
}

export function PyCharmWindow({
  snippets = DEFAULT_SNIPPETS,
  className = "",
}: PyCharmWindowProps) {
  const safeSnippets =
    snippets && snippets.length > 0 ? snippets : DEFAULT_SNIPPETS;
  const [activeTab, setActiveTab] = useState<CodeSnippetTab>(safeSnippets[0]);
  const [stdout, setStdout] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTab = activeTab ?? safeSnippets[0];
  const currentCode = currentTab?.code ?? "";

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleTabClick = (tab: CodeSnippetTab) => {
    if (activeTab && activeTab.id === tab.id) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveTab(tab);
    setStdout([]);
    setIsRunning(false);
  };

  const handleRunSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(true);
    setStdout([]);
    const lines = currentTab?.output ?? [];
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < lines.length) {
        const line = lines[currentIndex];
        currentIndex++;
        setStdout((prev) => [...prev, line]);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        if (activeTab) {
          setStdout(activeTab.output);
        }
      }
    }, 90);
  };

  const handleCopyCode = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(currentCode);
        setCopied(true);
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
  };

  const lineCount = currentCode.split("\n").length;
  const highlightedTokens = useMemo(
    () => tokenizePythonDarcula(currentCode),
    [currentCode]
  );

  return (
    <section
      id="ide"
      className={`py-20 px-4 sm:px-6 lg:px-8 bg-canvas border-t border-white/10 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-accent-yellow" />
              <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase">
                {"// AUTONOMY CODE DECK & DARCULA IDE"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              PyCharm Rover Code Simulation
            </h2>
            <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Inspect authentic ROS 2 waypoint navigation, analytical 6-DOF IKFast arm kinematics, EKF sensor fusion, and Raman spectrometry modules.
            </p>
          </div>

          {/* Darcula Syntax Palette Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DARCULA_PALETTE.keyword }} />
              Keyword
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DARCULA_PALETTE.function }} />
              Function
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DARCULA_PALETTE.string }} />
              String
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DARCULA_PALETTE.number }} />
              Number
            </span>
          </div>
        </div>

        {/* PyCharm IDE Window Frame */}
        <motion.div
          data-testid="pycharm-window"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.45 }}
          className="rounded-xl border border-white/10 bg-surface shadow-2xl overflow-hidden"
        >
          {/* Window Chrome Title Bar */}
          <div className="min-h-11 py-1.5 sm:py-0 bg-bg-toolbar border-b border-white/10 px-3 sm:px-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 select-none">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block border border-black/20" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block border border-black/20" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block border border-black/20" />
            </div>

            {/* Project Breadcrumb & PyCharm Title */}
            <div className="min-w-0 font-mono text-xs text-zinc-400 flex items-center gap-2 truncate">
              <span className="text-white font-semibold">itu_matrix — <span className="text-accent-yellow">PyCharm 2026.1</span></span>
              <span className="hidden sm:inline text-zinc-400">|</span>
              <span className="hidden sm:inline text-zinc-400 truncate">
                {currentTab?.path ?? ""}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
                <GitBranch className="h-3 w-3" />
                main
              </span>
            </div>

            {/* Execute Simulation Action */}
            <button
              type="button"
              data-testid="run-simulation-btn"
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[11px] sm:text-xs font-mono font-semibold transition-colors disabled:opacity-50"
            >
              <Play className="h-3 w-3 fill-emerald-400" />
              <span>{isRunning ? "Running..." : "Execute Simulation"}</span>
            </button>
          </div>

          {/* Code Tabs Strip */}
          <div
            data-testid="code-tabs"
            className="flex items-center border-b border-white/10 bg-[#19191C] overflow-x-auto"
          >
            {safeSnippets.map((tab) => {
              const isActive = currentTab?.id === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 border-r border-white/10 font-mono text-xs whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-surface text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pycharm-active-tab"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-accent-yellow"
                    />
                  )}
                  <FileCode2 className="h-3.5 w-3.5 text-accent-cyan" />
                  <span>{tab.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Main Editor & Stdout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[430px]">
            {/* Python Editor Pane */}
            <div className="lg:col-span-8 p-4 bg-surface overflow-x-auto border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400">
                  <span className="truncate">{currentTab?.description ?? ""}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="shrink-0 ml-3 min-h-[28px] px-2 py-1 rounded flex items-center gap-1 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab?.id ?? "tab"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="flex font-mono text-xs sm:text-[13px] leading-relaxed"
                  >
                    {/* Line Number Gutter */}
                    <div
                      aria-hidden="true"
                      className="select-none text-right pr-4 border-r border-white/10 text-[#808080]"
                    >
                      {Array.from({ length: lineCount }, (_, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {idx + 1}
                        </div>
                      ))}
                    </div>

                    {/* Clean Monospace Python Source */}
                    <div className="pl-4 flex-1 min-w-0 overflow-x-auto">
                      <pre className="text-[#A9B7C6] font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre">
                        <code>
                          {highlightedTokens.map((token, idx) => (
                            <span key={idx} style={{ color: token.color }}>
                              {token.text}
                            </span>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Editor Status Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-zinc-400">
                <span>Subsystem: {currentTab?.subsystem ?? ""}</span>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>LF</span>
                  <span className="text-accent-cyan">{currentTab?.language ?? "python"}</span>
                </div>
              </div>
            </div>

            {/* Run Console / Stdout Pane */}
            <div className="lg:col-span-4 bg-canvas p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-accent-yellow" />
                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      Run: {currentTab?.filename ?? ""}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">
                    stdout
                  </span>
                </div>

                <div
                  data-testid="simulation-stdout"
                  className="font-mono text-xs space-y-1.5 max-h-[340px] overflow-y-auto pr-1"
                >
                  {stdout.length === 0 && !isRunning && (
                    <div className="text-zinc-400 italic py-6 text-center">
                      Click Execute Simulation to run {currentTab?.filename ?? ""} on simulated rover hardware.
                    </div>
                  )}

                  {stdout.map((line, idx) => {
                    const isExit = line.includes("Process finished with exit code 0");
                    return (
                      <motion.div
                        key={`${currentTab?.id ?? "tab"}-${idx}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.14 }}
                        className={`text-[11px] leading-snug break-words ${
                          isExit
                            ? "text-emerald-400 font-bold pt-2"
                            : "text-zinc-300"
                        }`}
                      >
                        {line}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span>ROS 2 Humble Runtime</span>
                <span className="text-emerald-400">
                  {stdout.some((l) => l.includes("exit code 0"))
                    ? "Exit Code: 0"
                    : isRunning
                    ? "Executing..."
                    : "Ready"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
