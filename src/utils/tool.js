export const extractVideoID = (row) => {
  const originalUrl = row.originalUrl[0]
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/

  const match = originalUrl.match(regex)
  return match ? match[1] : null
}
