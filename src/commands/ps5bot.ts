import * as fs from 'fs'
import { GluegunCommand } from 'gluegun'
import {
  input,
  inputSchedule,
  inputTargetEmailPassword
} from '../utils/ps5bot-util'

const command: GluegunCommand = {
  name: 'ps5bot',
  run: async toolbox => {
    const { prompt, print } = toolbox
    print.info(`
    Welcome to your CLI. Please enter your checkout info in the following prompts.
    All data will only be stored in your computer. 
    You can choose to fill out the configs in config.json based on template provided in configTemplate.json.
    `)
    const cronSchedule = await inputSchedule(prompt)
    const firstName = await input('firstName', prompt, print)
    const lastName = await input('lastName', prompt, print)
    const phoneNumber = await input('phoneNumber', prompt, print)
    const email = await input('email', prompt, print)
    const state = await input('state', prompt, print)
    const city = await input('city', prompt, print)
    const address = await input('address', prompt, print)
    const zipCode = await input('zipCode', prompt, print)
    const creditCardNumber = await input('creditCardNumber', prompt, print)
    const expirationMonth = await input('expirationMonth', prompt, print)
    const expirationYear = await input('expirationYear', prompt, print)
    const cvv = await input('cvv', prompt, print)

    print.info(`
    ...Saving config...
    The next settings are optional.
    `)
    const config: { [key: string]: string } = {
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

    const isScrapeTarget = await toolbox.prompt.confirm(
      'Do you want to scrape Target?'
    )
    let targetEmailPassword: { [key: string]: string } = {}
    if (isScrapeTarget) {
      targetEmailPassword = await inputTargetEmailPassword(prompt, print, email)
      config.targetEmail = targetEmailPassword.email
      config.targetPassword = targetEmailPassword.password
    }

    print.info(`
    ...Saving final config...
    `)
    fs.writeFileSync('config.json', JSON.stringify(config, null, 4))

    print.info(`
    We're ready to go. Enter the following comand to run the scraper:

      ps5bot scrape
    `)
  }
}

module.exports = command
