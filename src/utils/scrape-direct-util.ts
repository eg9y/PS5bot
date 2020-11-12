import * as puppeteer from 'puppeteer'
import * as notifier from 'node-notifier'

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const waitTillSelectorAppears = async (
  page,
  selector: string,
  delay: number = 10000,
  isReload: boolean = true
) => {
  while (true) {
    try {
      const button = await page.evaluate(currSelector => {
        const btn = document.querySelector(currSelector)

        if (!btn) {
          throw new Error(`btn is null ${currSelector}`)
        }

        return getComputedStyle(btn).display
      }, selector)

      if (button && (button === 'none' || button === '')) {
        await timeout(delay)
        throw new Error(button)
      }
      break
    } catch (error) {
      if (isReload) {
        await page.reload()
      } else {
        console.log(error)
      }
    }
  }
}

export const scrapeDirect = async (config: { [key: string]: string }) => {
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

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
    defaultViewport: null
  })

  try {
    const page = await browser.newPage()
    // await page.goto(
    //   'https://direct.playstation.com/en-us/accessories/accessory/dualsense-wireless-controller.3005715'
    // )
    await page.goto(
      'https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816'
    )

    await waitTillSelectorAppears(
      page,
      'button[aria-label="Add to Cart"]',
      10000
    )

    const productHero = await page.$('.productHero-desc')
    const shipItButton = await productHero.$('button[aria-label="Add to Cart"]')
    await shipItButton.click()

    await page.waitForTimeout(2000)
    const [editAndCheckout] = await page.$x(
      "//a[contains(., 'Edit and Checkout')]"
    )
    await editAndCheckout.click()

    await page.waitForSelector('#monthInput', {
      timeout: 10000
    })
    await page.$eval('#monthInput', check => ((check as any).value = '01'))
    await page.$eval('#dateInput', check => ((check as any).value = '01'))
    await page.$eval('#yearInput', check => ((check as any).value = '1998'))
    await page.waitForTimeout(3000)
    const [verifyAgeButton] = await page.$x("//button[contains(., 'Verify')]")
    await verifyAgeButton.click()

    await page.waitForTimeout(3000)
    const [nextFromCartToShipping] = await page.$x(
      "//button[contains(., 'Next')]"
    )
    await nextFromCartToShipping.click()

    await page.waitForSelector('input[name="email"]', {
      timeout: 10000
    })
    await page.type('input[name="email"]', email)
    await page.type('#guestUserPhoneNo', phoneNumber)
    await page.type('#firstName', firstName)
    await page.type('#lastName', lastName)
    await page.$eval(
      'input[name="subscribeAcceptance"]',
      check => ((check as any).checked = false)
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

    notifier.notify({
      title: 'PlayStation Direct',
      message: 'Ready to place order!',
      sound: true
    })

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
