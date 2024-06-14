import { spawn } from 'node:child_process';

export default async function setup() {
  return new Promise((resolve, reject) => {
    console.log('FUEL_CORE_PATH', process.env.FUEL_CORE_PATH);

    const cp = spawn('pnpm tsx packages/fuels/src/setupLaunchNodeServer.ts', {
      detached: true,
      shell: 'sh',
    });

    cp.stderr.on('data', (chunk) => {
      console.log(chunk.toString());
    });

    cp.stdout?.on('data', (chunk) => {
      console.log(chunk.toString());
      // teardown
      resolve(() => {
        // https://github.com/nodejs/node/issues/2098#issuecomment-169549789
        process.kill(-cp.pid!);
      });
    });

    cp.on('error', (err) => {
      console.log('failed to start launchNode server', err);
      reject();
    });
  });
}
