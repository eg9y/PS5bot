import * as fs from 'fs'
import { GluegunToolbox } from 'gluegun'
import * as schedule from 'node-schedule'
import { TARGET, WALMART } from '../contants'
import { scrapeTarget } from '../utils/scrape-target-util'
import { scrapeDirect } from '../utils/scrape-direct-util'
import { scrapeWalmart } from '../utils/scrape-walmart-util'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.scrape = async (site: string) => {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
    const cronJobSchedule = config.cronSchedule

    let scraperToRun = scrapeDirect

    if (site === TARGET) {
      scraperToRun = scrapeTarget
    } else if (site === WALMART) {
      scraperToRun = scrapeWalmart
    }

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
