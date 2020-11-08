import { GluegunToolbox } from 'gluegun'
import { PLAYSTATION_DIRECT, TARGET } from '../contants'

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
      choices: [PLAYSTATION_DIRECT, TARGET]
    })

    if (sitesToScrape.length && sitesToScrape.includes(TARGET)) {
      await scrape(TARGET)
    } else {
      await scrape(PLAYSTATION_DIRECT)
    }
  }
}
