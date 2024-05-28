export const USER_NAME = "zohan";

export const BACKEND_BASE_URL =
  "https://take-home-assessment-423502.uc.r.appspot.com";

const dateTimeIntl = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
})

export const formatDateTime = (date: string) => dateTimeIntl.format(new Date(date))

export const fetchFn: typeof fetch = (input, init) => fetch(
  input,
  {
    ...init,
    headers: {
      ...init?.headers,
      accept: 'application/json',
      'content-type': 'application/json',
    }
  }
)
