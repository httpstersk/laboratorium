import '../../style.css';
import xs from 'xstream';

const hex = document.querySelector('#hex');
const hex$ = xs.periodic(1000)
  .map(() => {
    let date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((time) => time < 10 ? `0${time}` : time).join('');
  });

hex$.addListener({
  next: value => document.body.style.backgroundColor = hex.textContent = `#${value}`,
  error: err => console.error(err),
  complete: () => console.log('Finito!')
});
