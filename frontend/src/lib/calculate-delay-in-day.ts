import moment from "moment";

/**
 * Parses a time string into a moment object.
 *
 * @param timeStr - A string representing time, e.g., "HH:mm" or "HH:mm:ss".
 * @returns A moment object if the string is valid, or null if invalid.
 */
function parseTimeString(timeStr: string): moment.Moment | null {
  if (!timeStr) return null;
  const formats = ["HH:mm", "HH:mm:ss"];
  const parsed = moment(timeStr, formats, true);
  return parsed.isValid() ? parsed : null;
}

/**
 * Calculates the delay in days based on the start time, delay in days, and end time.
 *
 * @param startTime - The start time as a string, e.g., "HH:mm" or "HH:mm:ss".
 * @param delayInDays - The initial delay in days.
 * @param timeEnd - The end time as a string, e.g., "HH:mm" or "HH:mm:ss".
 * @returns The total delay in days, which includes an additional day if the start time is the same or later than the end time.
 */
export function calculateDelayInDay(
  startTime: string,
  delayInDays: number,
  timeEnd: string
): number {
  let delay = delayInDays || 0;
  const startMoment = parseTimeString(startTime);
  const endMoment = parseTimeString(timeEnd);
  if (!startMoment || !endMoment) {
    return delay;
  }
  if (startMoment.isSameOrAfter(endMoment)) {
    delay += 1;
  }
  return delay;
}
