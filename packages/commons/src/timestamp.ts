export const timestamp = () => Math.floor((new Date()).getTime() / 1000);

export const dateFromTimestamp = (ts: number) => new Date(ts*1000);