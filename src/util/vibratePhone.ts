const vibratePhone = () => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(100);
  }
};

export default vibratePhone;
