export function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) {
    return singular;
  }
  return plural ?? `${singular}s`;
}

export function pluralizeWithCount(
  count: number,
  singular: string,
  plural?: string
) {
  return `${count} ${pluralize(count, singular, plural)}`;
}

export function hoursMinutesNormalized(hours: number, minutes: number) {
  if (hours > 0) {
    // Use 'h' and 'm' format if there are any hours
    let result = `${hours}h`;
    if (minutes > 0) {
      result += ` ${minutes}m`;
    }
    return result;
  }
  // Only minutes, use pluralized 'min' or 'mins'
  if (minutes > 0) {
    return `${minutes} ${pluralize(minutes, "min", "mins")}`;
  }
  return "";
}
