import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
startButton.disabled = true;
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate <= new Date()) {
      userSelectedDate = null;
      startButton.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
      });

      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};
flatpickr('#datetime-picker', options);
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  datetimePicker.disabled = true;
  startTimer();
});
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function updateTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}
function startTimer() {
  if (!userSelectedDate) {
    return;
  }
  const timeLeft = userSelectedDate - new Date();
  updateTimer(convertMs(timeLeft));

  timerId = setInterval(() => {
    const timeLeft = userSelectedDate - new Date();

    if (timeLeft <= 0) {
      clearInterval(timerId);

      updateTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      datetimePicker.disabled = false;
      return;
    }
    updateTimer(convertMs(timeLeft));
  }, 1000);
}
