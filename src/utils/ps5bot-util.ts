import { GluegunPrint, GluegunPrompt } from 'gluegun'

const snakeCaseToSpaceSeparatedWord = (cronScheduleName: string) => {
  return cronScheduleName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str) {
      return str.toUpperCase()
    })
    .toLowerCase()
}

export const input = async (
  cronScheduleName: string,
  prompt: GluegunPrompt,
  print: GluegunPrint
) => {
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

export const inputSchedule = async (prompt: GluegunPrompt) => {
  const { scheduleOption } = await prompt.ask({
    type: 'select',
    name: 'scheduleOption',
    message: `Do you want to run ps5bot immediately, or in a specific time and date?`,
    choices: ['later', 'immediate']
  })
  const isSchedule = scheduleOption === 'later'
  let cronSchedule = null
  if (isSchedule) {
    const currentDate = new Date()
    const chosenMonth = currentDate.getMonth().toString()
    let chosenDay: string
    let chosenHour: string
    let chosenMinute: string

    const day = await prompt.ask({
      type: 'input',
      name: 'day',
      message: `Enter date of month. Defaults to today`
    })
    if (day && day.day) {
      chosenDay = day.day
    } else {
      chosenDay = currentDate.getDate().toString()
    }

    const hour = await prompt.ask({
      type: 'input',
      name: 'hour',
      message: `Enter hour of day. Defaults to current hour.`
    })
    if (hour && hour.hour) {
      chosenHour = hour.hour
    } else {
      chosenHour = currentDate.getHours().toString()
    }

    const minute = await prompt.ask({
      type: 'input',
      name: 'minute',
      message: `Enter minute of hour. Defaults to first minute of the hour.`
    })
    if (minute && minute.minute) {
      chosenMinute = minute.minute
    } else {
      chosenMinute = currentDate.getMinutes().toString()
    }

    cronSchedule = {
      month: chosenMonth,
      date: chosenDay,
      hour: chosenHour,
      minute: chosenMinute
    }
  }

  return cronSchedule
}

export const inputTargetEmailPassword = async (
  prompt: GluegunPrompt,
  print: GluegunPrint,
  email: string
): Promise<{ email: string; password: string }> => {
  const { targetEmail } = await prompt.ask({
    type: 'input',
    name: 'targetEmail',
    message: `Enter your Target email. Defaults to email if no input`
  })
  const { targetPassword } = await prompt.ask({
    type: 'input',
    name: 'targetPassword',
    message: `Enter your Target password.`
  })

  const targetConfig: { email: string; password: string } = {
    email: '',
    password: ''
  }

  if (!targetEmail) {
    targetConfig.email = email
  } else {
    targetConfig.email = targetEmail
  }
  if (targetPassword) {
    targetConfig.password = targetPassword
  } else {
    // if they didn't provide one, we error out
    print.error(`No target password specified!`)
    return
  }
  return targetConfig
}
