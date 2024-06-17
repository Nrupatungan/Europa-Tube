function getInitials(fullName: string) : string {
    return fullName
      .split(' ')
      .map(name => name[0].toUpperCase())
      .join('');
}

const formatDuration = (duration: number): string => {
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = Math.floor(duration % 60)

  // Format seconds and minutes with leading zeros
  seconds = parseInt(seconds.toString().padStart(2, '0'));
  minutes = parseInt(minutes.toString().padStart(2, '0'));

  // Format the duration based on the length
  if (hours > 0) {
    // Format hours with leading zeros if needed
    hours = parseInt(hours.toString().padStart(2, '0'));
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

const timeSince = (videoTimestamp: string) => {
  const date = new Date(videoTimestamp);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // 365 days
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000; // 30 days
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400; // 24 hours
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600; // 60 minutes
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
}

export {getInitials, timeSince, formatDuration}