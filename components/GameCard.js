import { PureComponent } from "react"
import styles from 'styles/GameCard.module.sass'

import { dateFormat } from 'utils/helpers.js'

class GameCard extends PureComponent {

    constructor(props){
        super(props)
        this.state = {}
    }

    componentDidMount(){
        
    }

    render(){

        let {
            name, 
            background_image,
            released, 
            metacritic,
            rating
        } = this.props.game

        let formattedDate = ''

        rating = rating.toString()
        if (rating.length > 3){
            rating = rating.substr(0, 3)
        }
        rating = rating.padStart(3)

        if(released) {
            formattedDate = dateFormat(released)
        }


        return(
            <>
                {this.props.game?
                    <div className={styles['game-card']}>
                        <img className={styles.poster} src={background_image}></img>
                        <p className={styles.name}>{name? name: 'N/A'}</p>
                        <span className={styles.released}>{formattedDate? formattedDate: 'N/A'}</span>
                        <div className={styles.metacritic}>{rating? rating: 'N/A'}</div>
                    </div>
                : null}
            </>
        )
    }
}

export default GameCard