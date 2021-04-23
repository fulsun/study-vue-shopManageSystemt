export function formatDate(dateStr, time) {
  // 得到特定的时间
  var date = new Date(dateStr)
  var year = date.getFullYear()
  // ES6语法填充：var month = (date.getMonth()+1).toString().padStart(2, '0');
  var month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  // return `${year}-${month}-${day}`;
  if (time && time.toLowerCase() === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`
  } else if (time && time.toLowerCase() === 'hh:mm:ss') {
    return `${hh}:${mm}:${ss}`
  } else {
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
  }
}
