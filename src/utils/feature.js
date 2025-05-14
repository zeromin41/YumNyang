export const formatDate = (dateString) =>{
   
  const date = new Date(dateString);
  
  // 한국 시간으로 변환
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const kstOffset = 9 * 60 * 60000; // UTC시간에 +9시간
  const kstTime = new Date(utc + kstOffset);
  
  const year = kstTime.getFullYear();
  const month = String(kstTime.getMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getDate()).padStart(2, '0');
  const hours = String(kstTime.getHours()).padStart(2, '0');
  const minutes = String(kstTime.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
  
}