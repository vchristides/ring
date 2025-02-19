import 'dotenv/config'
import { PushNotificationAction, RingApi } from '../ring-client-api'
//import { promisify, cleanOutputDirectory, outputDirectory } from './util'
import { outputDirectory } from './util'
import { skip } from 'rxjs/operators'
import { readFile, writeFile } from 'fs'
import * as path from 'path'


async function example() {
  const ringApi = new RingApi({
      // Replace with your refresh token
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: false,
    }),
    locations = await ringApi.getLocations(),
    allCameras = await ringApi.getCameras()
	frontcam = allCameras[0],
	sidecam = allCameras[1]

  console.log(`Found ${locations.length} location(s) with ${allCameras.length} camera(s).`)


  for (const location of locations) {
    location.onConnected.pipe(skip(1)).subscribe((connected) => {
      const status = connected ? 'Connected to' : 'Disconnected from'
      console.log(`**** ${status} location ${location.name} - ${location.id}`)
    })
  }

  for (const location of locations) {
    const cameras = location.cameras,
      devices = await location.getDevices()

    console.log(
      `\nLocation ${location.name} (${location.id}) has the following ${cameras.length} camera(s):`
    )

    for (const camera of cameras) {
      console.log(`- ${camera.id}: ${camera.name} (${camera.deviceType})`)
    }

    for (const device of devices) {
      console.log(`- ${device.zid}: ${device.name} (${device.deviceType})`)
    }
  }

  if (allCameras.length) {
    allCameras.forEach((camera) => {
      camera.onNewNotification.subscribe((notification) => {
        const event =
          notification.action === PushNotificationAction.Motion
            ? 'Motion detected'
            : notification.action === PushNotificationAction.Ding
            ? 'Doorbell pressed'
            : `Video started (${notification.action})`

        console.log(
          `${event} on ${camera.name} camera. Ding id ${
            notification.ding.id
          }.  Received at ${new Date()}`
		)
		await cleanOutputDirectory()
		console.log(`Starting Video from ${frontcam.name} ...`)
		frontcam.recordToFile(path.join(outputDirectory, 'frontcam.mp4'), 10)
		console.log('Done recording video')
		console.log(`Starting Video from ${sidecam.name} ...`)
		sidecam.recordToFile(path.join(outputDirectory, 'sidecam.mp4'), 10)
		console.log('Done recording video')
		process.exit(0)
      })
    })

    console.log('Listening for motion and doorbell presses on your cameras.')
  }
}

example().catch((e: any) => {
  console.error('Example threw an error:', e)
})
