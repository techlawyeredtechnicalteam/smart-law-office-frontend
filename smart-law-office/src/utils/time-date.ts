const currentDate = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});
const currentTime = new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

export { currentDate, currentTime };
