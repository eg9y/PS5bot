import * as puppeteer from 'puppeteer'
import * as notifier from 'node-notifier'

export const scrapeTarget = async (config: { [key: string]: string }) => {
  const {
    phoneNumber,
    firstName,
    lastName,
    state,
    city,
    zipCode,
    address,
    creditCardNumber,
    expirationMonth,
    expirationYear,
    cvv,
    targetEmail,
    targetPassword
  } = config

  if (!targetEmail || !targetPassword) {
    throw new Error(
      'targetEmail and targetPassword settings not set in config.json'
    )
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
    defaultViewport: null
  })

  try {
    const page = await browser.newPage()
    await page.setRequestInterception(true)

    page.on('request', async req => {
      if (req.resourceType() === 'image') {
        await req.abort()
      } else {
        await req.continue()
      }
    })

    await page.goto('https://www.target.com')
    const accountDropdown = await page.$('#account')
    await accountDropdown.click()

    await page.waitForTimeout(6000)
    const signInButton = await page.$('#accountNav-signIn')
    await signInButton.click()
    await page.waitForTimeout(6000)
    await page.type('#username', targetEmail)
    await page.type('#password', targetPassword)
    await page.keyboard.press('Enter')

    await page.waitForTimeout(6000)
    const isJoinRequest = await page.$('#circle-join-free')
    if (isJoinRequest) {
      console.log('join request exists')
      const skipButton = await page.$('#circle-skip')
      await skipButton.click()
    } else {
      console.log("join request doesn't exists")
    }

    await page.goto(
      'https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596'
    )
    // await page.goto(
    //   'https://www.target.com/p/dualsense-wireless-controller-for-playstation-5/-/A-81114477'
    // )

    await page.waitForTimeout(4000)

    while (true) {
      try {
        await page.waitForSelector('button[data-test="shipItButton"]', {
          timeout: 10000
        })
        break
      } catch (error) {
        await page.reload()
      }
    }

    const shipItButton = await page.$('button[data-test="shipItButton"]')
    await shipItButton.click()
    await page.waitForTimeout(4000)

    const noCoverageButton = await page.$(
      'button[data-test="espModalContent-declineCoverageButton"]'
    )
    await noCoverageButton.click()

    await page.waitForTimeout(4000)
    const addToCartModalViewCartCheckout = await page.$(
      'button[data-test="addToCartModalViewCartCheckout"]'
    )
    await addToCartModalViewCartCheckout.click()

    await page.waitForTimeout(6000)
    const checkoutButton = await page.$('button[data-test="checkout-button"]')
    await checkoutButton.click()

    await page.waitForTimeout(6000)
    const isCreditCardSavedAttemptOne = await page.$(
      'button[data-test="verify-card-button"]'
    )
    if (isCreditCardSavedAttemptOne) {
      await page.type('#creditCardInput-cardNumber', creditCardNumber)
      // expiration date format: MM/YY e.g. 08/24
      await isCreditCardSavedAttemptOne.click()
      await page.waitForTimeout(6000)
      await page.type('#creditCardInput-cvv', cvv)
      await page.keyboard.press('Enter')
    } else {
      // checkout page
      const existingAddress = await page.$('div[data-test="address-0"]')
      if (existingAddress) {
        console.log('address exists')
        await existingAddress.click()
        const saveAndContinueButton = await page.$(
          'button[data-test="save-and-continue-button"]'
        )
        await saveAndContinueButton.click()
      } else {
        console.log("address doesn't exists")
        await page.type('#full_name', `${firstName} ${lastName}`)
        await page.type('#address_line1', address)
        await page.type('#zip_code', zipCode)
        await page.type('#city', city)
        await page.type('#mobile', phoneNumber)
        await page.select('#state', state)
        const saveAndContinueButton = await page.$(
          'button[data-test="saveButton"]'
        )
        await saveAndContinueButton.click()
      }
      await page.waitForTimeout(6000)
      await page.type('#creditCardInput-cardNumber', creditCardNumber)

      const isCreditCardSaved = await page.$(
        'button[data-test="verify-card-button"]'
      )
      if (!isCreditCardSaved) {
        // expiration date format: MM/YY e.g. 08/24
        await page.type(
          '#creditCardInput-expiration',
          `${expirationMonth}/${expirationYear.slice(2, 4)}`
        )
        await page.type('#creditCardInput-cvv', cvv)
        await page.type('#creditCardInput-cardName', `${firstName} ${lastName}`)
        const saveAndContinueButton = await page.$(
          'button[data-test="save-and-continue-button"]'
        )
        await saveAndContinueButton.click()
      } else {
        await isCreditCardSaved.click()
        await page.waitForTimeout(6000)
        await page.type('#creditCardInput-cvv', cvv)
        await page.keyboard.press('Enter')
      }
    }

    notifier.notify({
      title: 'Target',
      message: 'Ready to place order!',
      sound: true
    })

    // await page.waitForTimeout(4000)
    // const placeOrderButton = await page.$(
    //   'button[data-test="placeOrderButton"]'
    // )
    // await placeOrderButton.click()
  } catch (error) {
    console.log(error)
  } finally {
    // await browser.close();
  }
}
