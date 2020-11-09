import * as puppeteer from 'puppeteer'

export const scrape = async (
  config: { [key: string]: string },
  existingBrowser?: puppeteer.Browser | null
) => {
  const {
    email,
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
    cvv
  } = config

  let browser
  if (existingBrowser) {
    browser = existingBrowser
  } else {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080'],
      defaultViewport: null
    })
  }

  try {
    const page = await browser.newPage()
    await page.goto(
      'https://direct.playstation.com/en-us/accessories/accessory/dualsense-wireless-controller.3005715'
    )
    // await page.goto('https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816');

    const productHero = await page.$('.productHero-desc')
    const shipItButton = await productHero.$('button[aria-label="Add to Cart"]')
    await shipItButton.click()

    await page.waitForTimeout(2000)
    const [editAndCheckout] = await page.$x(
      "//a[contains(., 'Edit and Checkout')]"
    )
    await editAndCheckout.click()

    await page.waitForTimeout(2000)

    await page.type('#monthInput', '01')
    await page.type('#dateInput', '01')
    await page.type('#yearInput', '1998')

    await page.waitForTimeout(2000)
    const [verifyAgeButton] = await page.$x("//button[contains(., 'Verify')]")
    await verifyAgeButton.click()

    await page.waitForTimeout(2000)

    const [nextFromCartToShipping] = await page.$x(
      "//button[contains(., 'Next')]"
    )
    await nextFromCartToShipping.click()

    await page.waitForTimeout(2000)
    await page.type('input[name="email"]', email)
    await page.type('#guestUserPhoneNo', phoneNumber)
    await page.type('#firstName', firstName)
    await page.type('#lastName', lastName)
    await page.$eval(
      'input[name="subscribeAcceptance"]',
      check => (check.checked = false)
    )

    // // street address
    await page.type('#line1', address)
    await page.type('#town', city)
    await page.type('#postalCode', zipCode)
    await page.type('#phoneNoInput', phoneNumber)

    const x = await page.$('#stateDropdown')
    await x.click()
    await page.waitForTimeout(4000)
    await page.keyboard.press('Enter') // Enter Key
    await page.evaluate(stateArg => {
      // tslint:disable-next-line: no-unnecessary-type-assertion
      return ((document.querySelector(
        '#stateDropdown'
      ) as any).value = stateArg)
    }, state)
    await page.waitForTimeout(4000)
    const shippingToCheckout = await page.$(
      '.order-summary-container__cta>.checkout-cta>.checkout-cta__next'
    )
    await shippingToCheckout.click()

    await page.waitForTimeout(6000)
    page.frames().find(async frame => {
      await frame.type('input[name="expiryMonth"]', expirationMonth)
      await frame.type('input[name="expiryYear"]', expirationYear)
      await frame.type('input[name="cvv"]', cvv)
      await frame.type(
        'input[name="accountHolderName"]',
        `${firstName} ${lastName}`
      )
      await page.mouse.click(360, 609)
      await page.keyboard.type(creditCardNumber)
    })
    await page.waitForTimeout(4000)
    const checkOutToReview = await page.$(
      '.order-summary-container__cta>.checkout-cta>.checkout-cta__review-order-total'
    )
    await checkOutToReview.click()

    // // Place Order
    // const LETS_GOGOGO = await page.$(
    //   '.order-summary-container__cta.place-order-enable>.checkout-cta>.checkout-cta__place-order'
    // )
    // LETS_GOGOGO.click()
  } catch (error) {
    console.log(error)
  } finally {
    // await browser.close();
  }
}
