#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

const IS_WIN = process.platform === 'win32';

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', blue: '\x1b[34m',
  yellow: '\x1b[33m', red: '\x1b[31m',
  cyan: '\x1b[36m', gray: '\x1b[90m'
};

const log = (color, tag, msg) => {
  const ts = new Date().toLocaleTimeString('en-IN', { hour12: false });
  process.stdout.write(`${C.gray}${ts}${C.reset} ${color}${C.bold}[${tag}]${C.reset} ${color}${msg}${C.reset}\n`);
};

function isPortFree(port) {
  return new Promise(resolve => {
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.once('listening', () => { s.close(); resolve(true); });
    s.listen(port, '127.0.0.1');
  });
}

function waitForBackend(port, timeoutMs = 30000) {
  const startedAt = Date.now();
  const url = `http://127.0.0.1:${port}/api/health`;

  return new Promise((resolve, reject) => {
    const ping = () => {
      fetch(url)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error(`Backend health returned ${res.status}`);
        })
        .then(resolve)
        .catch(err => {
          if (Date.now() - startedAt >= timeoutMs) {
            reject(new Error(`Backend did not become ready: ${err.message}`));
            return;
          }
          setTimeout(ping, 500);
        });
    };
    ping();
  });
}

function installDeps(dir, name) {
  const nm = path.join(dir, 'node_modules');
  if (fs.existsSync(nm)) {
    log(C.gray, 'SKIP', `${name} deps already installed`);
    return;
  }
  log(C.yellow, 'INSTALL', `Installing ${name} dependencies (first run)...`);
  const result = spawnSync(
    IS_WIN ? 'npm.cmd' : 'npm',
    ['install', '--no-audit', '--no-fund'],
    { cwd: dir, stdio: 'inherit', shell: false }
  );
  if (result.status !== 0) {
    log(C.red, 'ERROR', `Failed to install ${name} dependencies`);
    process.exit(1);
  }
  log(C.green, 'INSTALL', `${name} ready ✓`);
}

function spawnProcess(cmd, args, opts) {
  return spawn(cmd, args, { ...opts, shell: false });
}

function spawnWindowsCommand(command, opts) {
  const shell = process.env.ComSpec || 'cmd.exe';
  return spawn(shell, ['/d', '/s', '/c', command], { ...opts, shell: false });
}

async function main() {
  console.log(`\n${C.cyan}${C.bold}  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║   ReActivate AI  —  Dormant Account Intel   ║`);
  console.log(`  ╚══════════════════════════════════════════════╝${C.reset}\n`);

  const root = __dirname;
  const serverDir = path.join(root, 'server');
  const clientDir = path.join(root, 'client');

  if (!fs.existsSync(serverDir) || !fs.existsSync(clientDir)) {
    log(C.red, 'ERROR', 'server/ or client/ directory not found. Run from project root.');
    process.exit(1);
  }

  installDeps(serverDir, 'Backend');
  installDeps(clientDir, 'Frontend');

  const backendPort = 3001;
  const frontendPort = 5173;

  const [bFree, fFree] = await Promise.all([isPortFree(backendPort), isPortFree(frontendPort)]);
  if (!bFree) log(C.yellow, 'WARN', `Port ${backendPort} already in use — backend may fail`);
  if (!fFree) log(C.yellow, 'WARN', `Port ${frontendPort} already in use — Vite will pick another`);

  // ─── Backend ─────────────────────────────────────────────────────
  log(C.blue, 'START', 'Launching Express backend...');
  const nodeExe = IS_WIN ? 'node.exe' : 'node';
  const backend = spawnProcess(nodeExe, ['server.js'], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(backendPort), NODE_ENV: 'development' }
  });

  backend.stdout.on('data', d => {
    d.toString().split(/\r?\n/).filter(Boolean).forEach(line => {
      // Suppress duplicate lines (start.js already printed some)
      if (!line.includes('[SERVER]') && !line.includes('[ML]') && !line.includes('[DATA]')) return;
      // Already logged by server itself; skip re-logging from start.js to avoid doubles
    });
  });

  backend.stderr.on('data', d => {
    const lines = d.toString().split(/\r?\n/).filter(Boolean);
    lines.forEach(line => {
      if (
        line.includes('ExperimentalWarning') ||
        line.includes('DeprecationWarning') ||
        line.includes('tensorflow/tfjs') ||
        line.includes('node backend') ||
        line.includes('====')
      ) return;
      log(C.yellow, 'API', line);
    });
  });

  backend.on('exit', code => {
    if (code !== null && code !== 0) {
      log(C.red, 'API', `Backend exited with code ${code}`);
    }
  });

  backend.on('error', err => {
    log(C.red, 'API', `Failed to start backend: ${err.message}`);
  });

  // Wait for account generation and scoring before the UI starts fetching metrics.
  log(C.gray, 'WAIT', 'Waiting for backend data and AI scores...');
  await waitForBackend(backendPort);

  // ─── Frontend ─────────────────────────────────────────────────────
  log(C.green, 'START', 'Launching Vite frontend...');

  // Windows: route .cmd launchers through cmd.exe; direct .cmd spawn can throw EINVAL.
  let frontendProc;
  if (IS_WIN) {
    frontendProc = spawnWindowsCommand(`npx.cmd vite --port ${frontendPort}`, {
      cwd: clientDir,
      env: { ...process.env }
    });
  } else {
    frontendProc = spawn('npx', ['vite', '--port', String(frontendPort)], {
      cwd: clientDir,
      shell: false,
      env: { ...process.env }
    });
  }

  let announced = false;
  let actualPort = frontendPort;

  const handleFrontendLine = (line) => {
    if (!line.trim()) return;
    // Extract actual port Vite is using
    const portMatch = line.match(/localhost:(\d+)/);
    if (portMatch) actualPort = parseInt(portMatch[1]);

    if ((line.includes('localhost') || line.includes('ready')) && !announced) {
      announced = true;
      setTimeout(() => {
        console.log('');
        log(C.cyan, 'READY', `Backend  →  http://localhost:${backendPort}`);
        log(C.cyan, 'READY', `Frontend →  http://localhost:${actualPort}`);
        console.log(`\n${C.cyan}${C.bold}  Press Ctrl+C to stop${C.reset}\n`);

        // Open browser
        const url = `http://localhost:${actualPort}`;
        try {
          if (IS_WIN) {
            spawn('explorer.exe', [url], { detached: true, stdio: 'ignore' }).unref();
          } else {
            const opener = process.platform === 'darwin' ? ['open', url] : ['xdg-open', url];
            spawn(opener[0], opener.slice(1), { detached: true, stdio: 'ignore' }).unref();
          }
        } catch (_) {}
      }, 300);
    }
    log(C.green, 'UI', line.trim());
  };

  frontendProc.stdout.on('data', d => d.toString().split(/\r?\n/).forEach(handleFrontendLine));
  frontendProc.stderr.on('data', d => {
    d.toString().split(/\r?\n/).filter(Boolean).forEach(line => {
      if (!line.includes('ExperimentalWarning') && !line.includes('DeprecationWarning')) {
        log(C.yellow, 'UI', line);
      }
    });
  });

  frontendProc.on('error', err => {
    log(C.red, 'UI', `Failed to start frontend: ${err.message}`);
    log(C.yellow, 'TIP', 'Try manually: cd client && npx vite');
  });

  frontendProc.on('exit', code => {
    if (code !== null && code !== 0) log(C.red, 'UI', `Frontend exited with code ${code}`);
  });

  // ─── Shutdown ─────────────────────────────────────────────────────
  const shutdown = (sig) => {
    console.log(`\n${C.yellow}[STOP] Received ${sig} — shutting down...${C.reset}`);
    try { backend.kill(); } catch (_) {}
    try { frontendProc.kill(); } catch (_) {}
    setTimeout(() => process.exit(0), 1000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.stdin.resume();
}

main().catch(err => {
  console.error(`\x1b[31m[FATAL] ${err.message}\x1b[0m`);
  process.exit(1);
});
