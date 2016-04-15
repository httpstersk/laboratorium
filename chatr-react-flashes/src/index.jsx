import React from 'react';
import {render} from 'react-dom';
import {Observable} from 'rx';
import axios from 'axios';

const URL = 'https://chatr.tv/api/flashes/0';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flash: {} };
  }

  componentWillMount() {
    Rx.Observable
      .interval(1000)
      .flatMap(() => Rx.Observable.fromPromise(axios.get(URL)))
      .filter(response => response.status === 200)
      .map(result => result.data.flash)
      .subscribe(data => this.setState({ flash: data }));
  }

  render() {
    let flash = this.state.flash;

    if (flash) {
      const stream = document.querySelector('#stream');
      stream.classList.add('🔘');
    }

    return (
      <div className='⚡'>
        <div className='🔥'>
          <div className='💬'>{flash.text}</div>
        </div>
        <div className='↕'>
          <div className='👍' style={(flash.choice_a_percent === 0 && flash.choice_b_percent === 0) ? {height: '50vh'} : {height: flash.choice_a_percent + 'vh'}}>
            <div>{flash.choice_a}</div>
            <div className='🎈'>{flash.choice_a_percent}</div>
          </div>
          <div className='👎' style={(flash.choice_a_percent === 0 && flash.choice_b_percent === 0) ? {height: '50vh'} : {height: flash.choice_b_percent + 'vh'}}>
            <div>{flash.choice_b}</div>
            <div className='🎈'>{flash.choice_b_percent}</div>
          </div>
        </div>
      </div>
    )
  }
}

render(<App/>, document.querySelector('#app'));
