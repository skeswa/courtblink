import { h, Component } from 'preact'

import { IGameSummary } from 'common/api/schema/generated'

import * as style from './style.css'

type Props = {
  game: IGameSummary
}

type State = {}

class PregameInfo extends Component<Props, State> {
  public render(): JSX.Element {
    return <div />
  }
}

export default PregameInfo