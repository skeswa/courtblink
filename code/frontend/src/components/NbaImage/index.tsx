import * as classNames from 'classnames'
import { h, Component } from 'preact'

import FadeInImage from 'components/FadeInImage'

type Props = {
  id?: string
  type?: 'player' | 'team'
}

const NbaImage = (props: Props) => {
  let imageURL
  switch (props.type) {
    case 'team':
      switch (props.id) {
        case 'EST':
        case 'WST':
          imageURL =
            `https://i.cdn.turner.com/nba/nba/assets/logos/` +
            `tentpoles/${new Date().getFullYear()}/${props.id}.svg`
          break
        default:
          imageURL =
            `https://i.cdn.turner.com/nba/nba/assets/logos/teams/` +
            `secondary/web/${props.id}.svg`
          break
      }
      break
    case 'player':
      imageURL =
        `https://ak-static.cms.nba.com/wp-content/uploads/` +
        `headshots/nba/latest/260x190/${props.id}.png`
      break
    default:
      return null
  }

  return <FadeInImage src={imageURL} />
}

export default NbaImage
