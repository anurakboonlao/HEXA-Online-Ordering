import dayjs from "dayjs";


export const dateToInterFormat = (date:Date) => {
    return dayjs(date).format('YYYY-MM-DD');
}