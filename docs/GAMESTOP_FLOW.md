# GameStop Flow

1. checkout
   1. data-buttontext="Add to Cart"
2. goto <https://www.gamestop.com/checkout/>
3. shipping info
   1. email
      1. id = shipping-email
   2. first name
      1. id =  shippingFirstName
   3. last name
      1. id = shippingLastName
   4. address
      1. id = shippingAddressOne
   5. state
      1. id = shippingState
      2. select
      3. California
   6. city
      1. id = shippingAddressCity
   7. zip
      1. id = shippingZipCode
   8. phone
      1. id = shippingPhoneNumber
4. continue to payment button
   1. class =next-step-summary-button
5. if theres Use Proposed Address button
   1. click Use Proposed Address button
6. fill in credit card
   1. id = cardNumber
   2. select id = expirationMonth
   3. select id = expirationYear
   4. id = securityCode
7. .submit-payment button
8. .place-order button
