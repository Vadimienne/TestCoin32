import { Component, PureComponent } from "react"
import { withRouter } from 'next/router'

import { Carousel } from 'react-responsive-carousel'

import { dateFormat } from 'utils/helpers.js'

import styles from 'styles/GamePage.module.sass'


class GamePage extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            data: null,
            descriptionOpen: false
        }

        this.toggleDescription = this.toggleDescription.bind(this)
    }  

    toggleDescription(){
        this.setState({descriptionOpen: !this.state.descriptionOpen})
    }

    render() {

        let {
            name, 
            description_raw,
            released,
            metacritic,
            background_image,
            website
        } = this.props.game

        let { descriptionOpen } = this.state

        let { screenshots } = this.props

        let formattedDate = ''

        if(released) {
            formattedDate = dateFormat(released)
        }

        return(  
            <div className={styles.game_page}>
                
                
                <p className={styles.name} >{name}</p>

                <div className={styles.info_block}>
                    <div className={styles.metacritic}>
                                {metacritic}
                    </div>
                    <span className={styles.released}>{formattedDate}</span>
                </div>
                <div className={styles.carousel_desc_wrapper}>
                    <div className={styles.desc_block}>
                        <p className={`${styles.description} ${descriptionOpen? '' : styles.description_closed}`}>{description_raw}</p>
                        <button 
                            type='button'
                            onClick={this.toggleDescription}
                            className={styles.expand_btn}
                            >
                            {descriptionOpen? 'Hide': 'More'}
                        </button>
                        <a className={styles.website} href={website}>🔗{website}</a>
                    </div>  
                        
                    <Carousel>
                        {screenshots.map(el => <img src={el.image}></img>)}
                    </Carousel>
                </div>
                <div className={styles.page_art}>
                    <div className={styles.art_wrapper}>
                        <div 
                            className={styles.new_background_image} 
                            style={{
                                'background-image': `url('${background_image}')`,
                            }}>
                        
                        </div>
                    </div>
                </div>
            </div>
                
        )
    }
}

export default withRouter(GamePage)

export async function getServerSideProps(context){
    let slug = context.params.slug

    let game = await fetch(`https://api.rawg.io/api/games/${slug}`)
    let screenshots = await fetch(`https://api.rawg.io/api/games/${slug}/screenshots`)
    game = await game.json()
    screenshots = await screenshots.json()
    screenshots = screenshots.results

    return {props: {game, screenshots}}
}