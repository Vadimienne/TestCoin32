import { PureComponent } from "react"
import styles from 'styles/Filter.module.sass'

class Filter extends PureComponent {

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
        } = this.props.game

        let formattedDate = ''

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
                        <div className={styles.metacritic}>{metacritic? metacritic: 'N/A'}</div>
                    </div>
                : null}
            </>
        )
    }
}

export default Filter