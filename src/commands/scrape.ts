import { GluegunToolbox } from 'gluegun'
import { PLAYSTATION_DIRECT, TARGET, WALMART } from '../contants'

module.exports = {
  name: 'scrape',
  alias: ['s'],
  description: 'Runs the webscraper',
  run: async (toolbox: GluegunToolbox) => {
    // retrieve the tools from the toolbox that we will need
    const { scrape, prompt } = toolbox

    const { sitesToScrape }: { sitesToScrape: string[] } = await prompt.ask({
      type: 'multiselect',
      name: 'sitesToScrape',
      message: `Which sites do you want to scrape? (press space to select)`,
      choices: [PLAYSTATION_DIRECT, TARGET, WALMART]
    })

    if (sitesToScrape.length === 0) {
      await Promise.allSettled([
        scrape(TARGET),
        scrape(WALMART),
        scrape(PLAYSTATION_DIRECT)
      ])
    } else {
      if (sitesToScrape.includes(TARGET)) {
        await scrape(TARGET)
      } else if (sitesToScrape.includes(WALMART)) {
        await scrape(WALMART)
      } else {
        await scrape(PLAYSTATION_DIRECT)
      }
    }
  }
}
