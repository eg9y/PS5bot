import * as fs from 'fs'
import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'ps5bot',
  run: async toolbox => {
    const snakeCaseToSpaceSeparatedWord = (propertyName: string) => {
      return propertyName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str) {
          return str.toUpperCase()
        })
        .toLowerCase()
    }

    const input = async (propertyName: string) => {
      const convertedPropertyName = snakeCaseToSpaceSeparatedWord(propertyName)
      const result = await prompt.ask({
        type: 'input',
        name: propertyName,
        message: `Enter your ${convertedPropertyName}`
      })
      let property: string
      if (result && result[propertyName]) {
        property = result[propertyName]
      }
      // if they didn't provide one, we error out
      if (!property) {
        print.error(`No ${convertedPropertyName} name specified!`)
        return
      }
      return property
    }

    const { prompt, print } = toolbox
    print.info(`
    Welcome to your CLI. Please enter your checkout info in the following prompts.
    All data will only be stored in your computer. 
    You can choose to fill out the configs in config.json based on template provided in configTemplate.json.
    `)
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
      cvv
    }
    fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
  }
}

module.exports = command
