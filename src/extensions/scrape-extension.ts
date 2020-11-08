import * as fs from 'fs'
import { GluegunToolbox } from 'gluegun'
import * as schedule from 'node-schedule'
import { TARGET } from '../contants'
import { scrapeTarget } from '../utils/scrape-target-util'
import { scrape } from '../utils/scrape-util'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.scrape = async (site: string) => {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
    const cronJobSchedule = config.cronSchedule

    let scraperToRun = site === TARGET ? scrapeTarget : scrape

    if (!cronJobSchedule) {
      await scraperToRun(config)
    } else {
      toolbox.print.info('scheduled ps5bot for checkout')
      schedule.scheduleJob(cronJobSchedule, async () => {
        await scraperToRun(config)
      })
    }
  }
}
