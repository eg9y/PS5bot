import * as fs from 'fs'
import { GluegunToolbox } from 'gluegun'
import * as schedule from 'node-schedule'
import { scrape } from '../utils/scrape'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.scrape = async () => {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
    const cronJobSchedule = config.cronSchedule

    if (!cronJobSchedule) {
      await scrape(config)
    } else {
      toolbox.print.info('scheduled ps5bot for checkout')
      schedule.scheduleJob(cronJobSchedule, async () => {
        await scrape(config)
      })
    }
  }
}
