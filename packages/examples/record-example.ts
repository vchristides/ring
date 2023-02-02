import 'dotenv/config'
import { RingApi } from '../ring-client-api'
import { cleanOutputDirectory, outputDirectory } from './util'
import * as path from 'path'

/**
 * This example records a 10 second video clip to output/example.mp4
 **/

async function example() {
  const ringApi = new RingApi({
      // Replace with your refresh token
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true,
    }),
    cameras = await ringApi.getCameras(),
    front = cameras[0],
    side = cameras[1]

  if (!front) {
    console.log('No cameras found')
    return
  }

  // clean/create the output directory
  await cleanOutputDirectory()

  console.log(`Starting Video from ${front.name} ...`)
  await front.recordToFile(path.join(outputDirectory, 'front.mp4'), 10)
  console.log('Done recording video')
  console.log(`Starting Video from ${side.name} ...`)
  await side.recordToFile(path.join(outputDirectory, 'side.mp4'), 10)
  console.log('Done recording video')
  process.exit(0)
}

example().catch((e) => {
  console.error(e)
  process.exit(1)
})
