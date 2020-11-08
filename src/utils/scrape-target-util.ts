import * as puppeteer from 'puppeteer'

export const scrapeTarget = async (config: { [key: string]: string }) => {
  // const {
  //   email,
  //   phoneNumber,
  //   firstName,
  //   lastName,
  //   state,
  //   city,
  //   zipCode,
  //   address,
  //   creditCardNumber,
  //   expirationMonth,
  //   expirationYear,
  //   cvv
  // } = config

  // const targetAccountPassword = 'randompassword!!!'

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
    defaultViewport: null
  })
  try {
    const page = await browser.newPage()
    await page.goto(
      'https://www.target.com/p/dualsense-wireless-controller-for-playstation-5/-/A-81114477'
    )

    const shipItButton = await page.$('button[data-test="shipItButton"]')
    shipItButton.click()
    await page.waitForTimeout(2000)

    const noCoverageButton = await page.$(
      'button[data-test="espModalContent-declineCoverageButton"]'
    )
    noCoverageButton.click()

    // const [editAndCheckout] = await page.$x(
    //   "//a[contains(., 'Edit and Checkout')]"
    // )
    // editAndCheckout.click()

    // await page.waitForTimeout(2000)
  } catch (error) {
    console.log(error)
  } finally {
    // await browser.close();
  }
}
