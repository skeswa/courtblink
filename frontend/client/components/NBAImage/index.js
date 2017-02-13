
import classNames from 'classnames'
import { h, Component } from 'preact'

import FadeInImage from 'components/FadeInImage'

const NBAImage = props => {
  let imageURL
  switch (props.type) {
    case 'team':
      imageURL = `//i.cdn.turner.com/nba/nba/assets/logos/teams/secondary/web/${props.id}.svg`
      break
    case 'player':
      imageURL = `//ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${props.id}.png`
      break
    default:
      return null
  }

  return <FadeInImage src={imageURL} />
}

export default NBAImage
