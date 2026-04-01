
function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút`;
  if (hours < 24) return `${hours} giờ`;
  return `${days} ngày`;
}

export {formatTime}