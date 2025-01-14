export const utcDatetimeToLocalDate = (utc) => {
    if (typeof utc === 'string') {
        utc = new Date(utc);
    }
    utc = utc.toLocaleString('sv-SE').split(' ')[0];
    return utc;
};

export const localDateToUtcDatetime = (date) => {
    const utc =
        new Date(date).getTime() + getTimeZoneOffsetInHours() * 60 * 60 * 1000;
    return new Date(utc);
};

export const getDateFromDatetime = (dt) => {
    return dt.toISOString().split('T')[0];
};

export const localTimeToGlobalTime = (time) => {
    let [h, m] = time.split(':');
    h = Number(h) + getTimeZoneOffsetInHours();
    while (h < 0) h += 24;
    h %= 24;
    return `${h.toString().padStart(2, '0')}:${m}`;
};

export const globalTimeToLocalTime = (time) => {
    let [h, m] = time.split(':');
    h = Number(h) - getTimeZoneOffsetInHours();
    while (h < 0) h += 24;
    h %= 24;
    return `${h.toString().padStart(2, '0')}:${m}`;
};

// local + offset == global/utc/iso8601
// vn offset = -7
export const getTimeZoneOffsetInHours = () => {
    return new Date().getTimezoneOffset() / 60;
};
