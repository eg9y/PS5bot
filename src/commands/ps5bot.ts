import * as fs from 'fs'
import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'ps5bot',
  run: async toolbox => {
    const snakeCaseToSpaceSeparatedWord = (cronScheduleName: string) => {
      return cronScheduleName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str) {
          return str.toUpperCase()
        })
        .toLowerCase()
    }

    const input = async (cronScheduleName: string) => {
      const convertedcronScheduleName = snakeCaseToSpaceSeparatedWord(
        cronScheduleName
      )
      const result = await prompt.ask({
        type: 'input',
        name: cronScheduleName,
        message: `Enter your ${convertedcronScheduleName}.`
      })
      let cronSchedule: string
      if (result && result[cronScheduleName]) {
        cronSchedule = result[cronScheduleName]
      }
      // if they didn't provide one, we error out
      if (!cronSchedule) {
        print.error(`No ${convertedcronScheduleName} name specified!`)
        return
      }
      return cronSchedule
    }

    const { prompt, print } = toolbox
    print.info(`
    Welcome to your CLI. Please enter your checkout info in the following prompts.
    All data will only be stored in your computer. 
    You can choose to fill out the configs in config.json based on template provided in configTemplate.json.
    `)

    const { scheduleOption } = await prompt.ask({
      type: 'select',
      name: 'scheduleOption',
      message: `Do you want to run ps5bot immediately, or in a specific time and date?`,
      choices: ['immediate', 'later']
    })
    const isSchedule = scheduleOption === 'later'

    const firstName = await input('firstName')
    const lastName = await input('lastName')
    const phoneNumber = await input('phoneNumber')
    const email = await input('email')
    const state = await input('state')
    const city = await input('city')
    const address = await input('address')
    const zipCode = await input('zipCode')
    const creditCardNumber = await input('creditCardNumber')
    const expirationMonth = await input('expirationMonth')
    const expirationYear = await input('expirationYear')
    const cvv = await input('cvv')

    let cronSchedule = null
    if (isSchedule) {
      const result = await prompt.ask({
        type: 'input',
        name: 'cronSchedule',
        message: `Enter the schedule to run ps5bot. This field is optional and will run immediately as default. Schedule should be in cron format. Check this out: https://crontab-generator.org/`
      })
      if (result && result['cronSchedule']) {
        cronSchedule = result['cronSchedule']
      }
    }

    const config = {
      firstName,
      lastName,
      phoneNumber,
      email,
      state,
      city,
      address,
      zipCode,
      creditCardNumber,
      expirationMonth,
      expirationYear,
      cvv,
      cronSchedule
    }
    fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
  }
}

module.exports = command
