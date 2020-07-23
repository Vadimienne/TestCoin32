import months from 'utils/months.js'

export function dateFormat(input){
    let date = new Date(input)
    return `
        ${months[date.getMonth()]}
        ${date.getDate() < 10? '0' + date.getDate(): date.getDate()}
        '${date.getFullYear().toString().substr(2)}`
}