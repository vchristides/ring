import 'dotenv/config'
import { PushNotificationAction, RingApi } from '../ring-client-api'
//import { createOutputDirectory, outputDirectory, nextDirectory, getUpdatedDate, logfile_name } from './util'
import { skip } from 'rxjs/operators'
import { readFile, writeFile, mkdir } from 'fs'
import * as path from 'path'
import { promisify } from 'util'

/**
 * This example records a 10 second video clip to output/example.mp4
 **/
 
var now = new Date();
var logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 +now.getDate() + " " + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
var outputDirectory = path.join(__dirname, 'output')
var nextDirectory = path.join(outputDirectory, logfile_name)


async function getUpdatedDate() {
  now = new Date();
  //logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 +now.getDate() + " " + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
  logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth()) + "-" + 0 +now.getDate() + " " + now.getHours() + "h" + now.getMinutes() + "m" + now.getSeconds() + "s" + now.getMilliseconds() + "ms";
  nextDirectory = path.join(outputDirectory, logfile_name)
  now = new Date();
}
 
 
async function createOutputDirectory() {
	
	getUpdatedDate()
	promisify(mkdir)(nextDirectory)
	
}

async function example_test() {
  const ringApi = new RingApi({
      // Replace with your refresh token
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true,
    }),
	locations = await ringApi.getLocations(),
    cameras = await ringApi.getCameras(),
    front = cameras[0],
    side = cameras[1]
	
	console.log(`Found ${locations.length} location(s) with ${cameras.length} camera(s).`)
  
  for (const location of locations) {
    location.onConnected.pipe(skip(1)).subscribe((connected) => {
      const status = connected ? 'Connected to' : 'Disconnected from'
      console.log(`**** ${status} location ${location.name} - ${location.id}`)
	  getUpdatedDate()
    })
  }

  for (const location of locations) {
    const cameras = location.cameras,
      devices = await location.getDevices()
	  getUpdatedDate()
    console.log(
      `\nLocation ${location.name} (${location.id}) has the following ${cameras.length} camera(s):`
    )

    for (const camera of cameras) {
      console.log(`- ${camera.id}: ${camera.name} (${camera.deviceType})`)
    }
  }
 
   if (cameras.length) {
    cameras.forEach((camera) => {
      camera.onNewNotification.subscribe((notification) => {
        const event = notification.action === PushNotificationAction.Motion
            ? 'Motion detected'
            : notification.action === PushNotificationAction.Ding
            ? 'Doorbell pressed'
            : `Video started (${notification.action})`

        console.log(
          `${event} on ${camera.name} camera. Ding id ${
            notification.ding.id
          }.  Received at ${new Date()}`
		)
		getUpdatedDate()
		createOutputDirectory()
		console.log(`Starting Video from ${front.name}...`)
		front.recordToFile(path.join(nextDirectory, 'front.mp4'), 15)
		console.log('Done recording video')
		console.log(`Starting Video from ${side.name}...`)
		side.recordToFile(path.join(nextDirectory, 'side.mp4'), 15)
		console.log('Done recording video')
	})
	})
	
	console.log('Listening for motion and doorbell presses on your cameras.')
  }
  

} 

example_test().catch((e) => {
  console.error(e)
  process.exit(1)
})
