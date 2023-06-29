/* Function that recieves a number in seconds and returns
a string on the hh:mm format */
const formatTime = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().slice(11, 16);
};

export default formatTime;
