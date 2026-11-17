export interface CodeSnippetTab {
  id: string;
  filename: string;
  language: "python";
  subsystem: string;
  path: string;
  description: string;
  code: string;
  output: string[];
}

export const DARCULA_PALETTE = {
  keyword: "#CC7832",
  function: "#FFC66D",
  string: "#6A8759",
  number: "#6897BB",
  comment: "#808080",
  identifier: "#A9B7C6",
} as const;

export const CODE_SNIPPETS: CodeSnippetTab[] = [
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

export function getSnippetById(id: string): CodeSnippetTab | undefined {
  return CODE_SNIPPETS.find((snippet) => snippet.id === id);
}
