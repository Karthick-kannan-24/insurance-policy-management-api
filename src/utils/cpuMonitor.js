import os from "os";
import { exec } from "child_process";

const CPU_THRESHOLD = 70;
const CHECK_INTERVAL = 5000;

const getCpuUsage = () => {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    idle += cpu.times.idle;

    total +=
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys +
      cpu.times.idle +
      cpu.times.irq;
  }

  return {
    idle,
    total,
  };
};

const calculateCpuPercentage = (previous, current) => {
  const idleDifference = current.idle - previous.idle;
  const totalDifference = current.total - previous.total;

  if (totalDifference === 0) {
    return 0;
  }

  return 100 - (idleDifference / totalDifference) * 100;
};

const restartServer = () => {
  console.log(
    `CPU usage exceeded ${CPU_THRESHOLD}%. Restarting server...`
  );

  exec("pm2 restart insurance-api", (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to restart server:", error.message);
      return;
    }

    if (stderr) {
      console.error("PM2 error:", stderr);
    }

    console.log(stdout);
  });
};

export const startCpuMonitor = () => {
  let previousCpu = getCpuUsage();
  let restartTriggered = false;

  const monitor = setInterval(() => {
    const currentCpu = getCpuUsage();

    const cpuUsage = calculateCpuPercentage(
      previousCpu,
      currentCpu
    );

    previousCpu = currentCpu;

    console.log(
      `CPU Usage: ${cpuUsage.toFixed(2)}%`
    );

    if (
      cpuUsage >= CPU_THRESHOLD &&
      !restartTriggered
    ) {
      restartTriggered = true;

      clearInterval(monitor);

      restartServer();
    }
  }, CHECK_INTERVAL);

  return monitor;
};