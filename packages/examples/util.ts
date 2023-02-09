/* import * as path from 'path'
import { promisify } from 'util'
import { mkdir } from 'fs'
const rimraf = require('rimraf')

export now = new Date();
export logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 +now.getDate() + " " + now.getHours() + now.getMinutes()+ now.getSeconds() + now.getMilliseconds();

export outputDirectory = path.join(__dirname, 'output')
export nextDirectory = path.join(outputDirectory, logfile_name)

export async function getUpdatedDate() {
  export now = new Date();
  export logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 +now.getDate() + " " + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
  export nextDirectory = path.join(outputDirectory, logfile_name)
  console.log("Logfile name: " + logfile_name)
  console.log("NextDirectory name: " + nextDirectory)
  export now = new Date();
}


export async function createOutputDirectory() {
	
	getUpdatedDate()
	promisify(mkdir)(nextDirectory)
} */