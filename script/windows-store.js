const ChildProcess = require('child_process')
const path = require('path')

const metadata = require('../package')

const command = path.join(__dirname, '..', 'node_modules', '.bin', 'todo-store.cmd')
const args = [
  '--input-directory',
  path.join(__dirname, '..', 'out', 'toDO-win32-ia32'),
  '--output-directory',
  path.join(__dirname, '..', 'out', 'windows-store'),
  '--flatten',
  true,
  '--package-version',
  metadata.version + '.0',
  '--package-name',
  metadata.name,
  '--package-display-name',
  metadata.productName,
  '--assets',
  path.join(__dirname, '..', 'assets', 'tiles'),
  '--package-description',
  metadata.description
]

const windowsStore = ChildProcess.spawn(command, args, {stdio: 'inherit'})
windowsStore.on('close', (code) => {
  process.exit(code)
})
