
import { h, Component } from 'preact'

import style from './style.css'
import Loader from 'components/Loader'
import Carousel from 'components/Carousel'

class App extends Component {
  render() {
    return (
      <div className={style.main}>
        <div className={style.back}>
        </div>
        <div className={style.front}>
          <div className={style.top}></div>
          <div className={style.middle}>
            <Loader />
          </div>
          <div className={style.bottom}>
            <Carousel />
          </div>
        </div>
      </div>
    )
  }
}

export default App
