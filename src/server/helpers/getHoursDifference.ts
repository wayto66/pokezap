export function getHoursDifference(date1: Date, date2: Date) {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60)
  return diffInHours
}
