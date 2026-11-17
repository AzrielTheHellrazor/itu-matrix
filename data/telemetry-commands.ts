export interface TelemetryMetrics {
  rfSignalDbm: number;
  batteryVoltage: number;
  cpuTemperatureC: number;
  activeSubsystems: string[];
  gpsFix: { lat: number; lng: number };
}

export interface CommandExecutionResult {
  command: string;
  args: string[];
  output: string[];
  status: "success" | "error" | "cleared";
}

export class TelemetrySession {
  private history: string[] = [];
  private metrics: TelemetryMetrics = {
    rfSignalDbm: -58,
    batteryVoltage: 24.8,
    cpuTemperatureC: 42.5,
    activeSubsystems: [
      "Mechanical",
      "Electronics",
      "Autonomous Software",
      "Science",
      "PR/Sponsorship",
    ],
    gpsFix: { lat: 38.4065, lng: -110.7925 },
  };

  execute(input: string): CommandExecutionResult {
    if (typeof input !== "string") {
      return { command: "", args: [], output: [], status: "success" };
    }
    const raw = input.trim();
    if (!raw) {
      return { command: "", args: [], output: [], status: "success" };
    }

    this.history.push(raw);
    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const fullCmd = tokens.join(" ").toLowerCase();

    if (fullCmd === "arm test") {
      return {
        command: "arm test",
        args: [],
        status: "success",
        output: [
          "INITIATING 6-DOF ROBOTIC ARM SELF-TEST SEQUENCE...",
          "  [PASS] J1 Base Yaw (-180° to +180°): OK",
          "  [PASS] J2 Shoulder Pitch (-45° to +90°): OK",
          "  [PASS] J3 Elbow Pitch (-90° to +90°): OK",
          "  [PASS] J4 Wrist Pitch (-90° to +90°): OK",
          "  [PASS] J5 Wrist Roll (-180° to +180°): OK",
          "  [PASS] J6 End-Effector Gripper (3.5kg Payload Capacity): READY",
          "ARM STATUS: NOMINAL. Ready for sample manipulation.",
        ],
      };
    }

    switch (cmd) {
      case "help":
        return {
          command: cmd,
          args,
          status: "success",
          output: [
            "ITU MATRIX TERMINAL - AVAILABLE COMMANDS",
            "---------------------------------------",
            "help         : Display command directory",
            "telemetry    : Real-time RF, power and thermal telemetry",
            "arm test     : Run 6-DOF robotic arm sweep sequence",
            "subsystems   : Status diagnostics for all 5 subsystems",
            "science      : Raman spectrometer and sample bay state",
            "rovers       : List vehicle generations (Altınay, İnan, Matrix)",
            "clear        : Clear terminal output buffer",
          ],
        };

      case "telemetry":
        return {
          command: cmd,
          args,
          status: "success",
          output: [
            `RF LINK       : 5.8 GHz High-Gain [RSSI: ${this.metrics.rfSignalDbm} dBm, SNR: 24 dB] CONNECTED`,
            `POWER BUS     : ${this.metrics.batteryVoltage}V Nominal (LiFePO4 8S) | 4.2A | Solar: 35W`,
            `THERMAL       : Jetson Orin CPU: ${this.metrics.cpuTemperatureC}°C | Motors: 38.0°C`,
            `NAVIGATION    : GPS Fix [${this.metrics.gpsFix.lat}°N, ${Math.abs(this.metrics.gpsFix.lng)}°W - MDRS Utah] FIX 3D`,
            `HEADING       : 042° NE | IMU Pitch: -1.2° | Roll: +0.8° | Yaw: 142.0°`,
          ],
        };

      case "subsystems":
        return {
          command: cmd,
          args,
          status: "success",
          output: [
            "[OK] Mechanical          : Rocker-Bogie 6WD (6 Hub Motors Active) NOMINAL",
            "[OK] Electronics & Power : 24V Regulated Bus Nominal ONLINE",
            "[OK] Autonomous Software : ROS2 Humble + LiDAR SLAM Online ONLINE",
            "[OK] Science Subsystem   : Raman Spectrometer & Soil Carousel Armed NOMINAL",
            "[OK] PR & Communications : 5.8GHz Telemetry Link Synchronized NOMINAL",
          ],
        };

      case "science":
        return {
          command: cmd,
          args,
          status: "success",
          output: [
            "[OK] Raman Spectrometer : Laser 532nm Calibrated",
            "[OK] Soil Carousel      : 6 Test Chambers Ready",
            "[OK] In-situ Assay      : Biomarker Detection Active (ATP, Amino Acids)",
          ],
        };

      case "rovers":
        return {
          command: cmd,
          args,
          status: "success",
          output: [
            "ITU MATRIX PLANETARY ROVER FLEET:",
            "  1st Gen (2017) : Altınay Mars Kaşifi (URC Pioneer)",
            "  2nd Gen (2018) : İnan (URC Best Science System Award)",
            "  4th Gen (2020) : Altınay (URC World 3rd Place)",
            "  5th Gen (2021) : İnan Evolution (ERC Silver Medal & Best Arm)",
            "  6th Gen (2026) : Matrix 2026 (Active Engineering Cycle)",
          ],
        };

      case "arm":
        if (args[0] && args[0].toLowerCase() === "test") {
          return {
            command: "arm test",
            args: args.slice(1),
            status: "success",
            output: [
              "INITIATING 6-DOF ROBOTIC ARM SELF-TEST SEQUENCE...",
              "  [PASS] J1 Base Yaw (-180° to +180°): OK",
              "  [PASS] J2 Shoulder Pitch (-45° to +90°): OK",
              "  [PASS] J3 Elbow Pitch (-90° to +90°): OK",
              "  [PASS] J4 Wrist Pitch (-90° to +90°): OK",
              "  [PASS] J5 Wrist Roll (-180° to +180°): OK",
              "  [PASS] J6 End-Effector Gripper (3.5kg Payload Capacity): READY",
              "ARM STATUS: NOMINAL. Ready for sample manipulation.",
            ],
          };
        }
        return {
          command: "arm",
          args,
          status: "error",
          output: [`Unknown arm subcommand: '${args.join(" ")}'. Usage: arm test`],
        };

      case "clear":
        return {
          command: cmd,
          args,
          status: "cleared",
          output: [],
        };

      default:
        return {
          command: cmd,
          args,
          status: "error",
          output: [
            `Command not recognized: '${cmd}'. Type 'help' for available commands.`,
          ],
        };
    }
  }

  getHistory(): string[] {
    return [...this.history];
  }

  getPreviousCommand(indexFromBack = 0): string | null {
    if (
      typeof indexFromBack !== "number" ||
      !Number.isInteger(indexFromBack) ||
      indexFromBack < 0
    ) {
      return null;
    }
    if (this.history.length === 0) return null;
    const idx = this.history.length - 1 - indexFromBack;
    if (idx < 0 || idx >= this.history.length) return null;
    return this.history[idx];
  }

  clearHistory(): void {
    this.history = [];
  }
}

export function createTelemetrySession(): TelemetrySession {
  return new TelemetrySession();
}
