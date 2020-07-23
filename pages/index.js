import React from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'

import InfiniteScroll from 'react-infinite-scroll-component';
import Dropdown from 'react-dropdown';
import LoadingOverlay from 'react-loading-overlay';


import GameCard from 'components/GameCard.js'
import Input from 'components/Input.js'

import styles from 'styles/index.module.sass'

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            nextFetchURL: '',
            games: [],
            platformSortValue: '',
            searchInput: '',
            searchTimeout: 0,
            isFetching: false
        }

      this.fetchNextGames = this.fetchNextGames.bind(this)
      this.onPlatformSortSelect = this.onPlatformSortSelect.bind(this)
      this.toggleDateSort = this.toggleDateSort.bind(this)
      this.toggleRatingSort = this.toggleRatingSort.bind(this)
      this.onSearchInput = this.onSearchInput.bind(this)
    }

    async componentDidMount(){
        let games = this.props.games
        let nextFetchURL = this.props.nextGamesURL
        this.setState({games: games}, 
            () => {
                this.setState({nextFetchURL: nextFetchURL})
            })
        
    }

    async fetchNextGames(){
        
        let res = await fetch(this.state.nextFetchURL)
        let json = await res.json()
        let extGames = this.state.games.concat(json.results)
        this.setState({games: extGames}, () => this.setState({nextFetchURL: json.next}))
    }

    async onPlatformSortSelect(val){
        this.setState({isFetching: true})
        
        let games = await fetch(`https://api.rawg.io/api/games?platforms=${val.value}`)
        let json = await games.json()
        games = json.results
        let nextFetchURL = json.next
        this.setState({platformSortValue: val}, 
            () => this.setState({games},
                () => this.setState({nextFetchURL})
        ))
        this.setState({isFetching: false})
    }
    
    async toggleDateSort(){
        this.setState({isFetching: true})
        let games = await fetch(`https://api.rawg.io/api/games?ordering=${this.state.dateSort == 'new' ? '-': ''}released`)
        let json = await games.json()
        games = json.results
        let nextFetchURL = json.next
        this.setState({dateSort: this.state.dateSort == 'new'? 'old': 'new'}, 
            () => this.setState({games},
                () => this.setState({nextFetchURL})
        ))
        this.setState({isFetching: false})
    }

    async toggleRatingSort(){
        this.setState({isFetching: true})
        let games = await fetch(`https://api.rawg.io/api/games?ordering=${this.state.ratingSort == 'top' ? '': '-'}rating`)
        let json = await games.json()
        games = json.results
        let nextFetchURL = json.next
        this.setState({ratingSort: this.state.ratingSort == 'top'? 'bottom': 'top'}, 
            () => this.setState({games},
                () => this.setState({nextFetchURL})
        ))
        this.setState({isFetching: false})
    }

    onSearchInput(e){
        let value = e.target.value
        let timeout = this.state.searchTimeout

        
        if (timeout) {  
            clearTimeout(this.state.searchTimeout);
        }
        timeout = setTimeout(async () => {
            this.setState({isFetching: true})
            let games = await fetch(`https://api.rawg.io/api/games?search=${value}`)
            let json = await games.json()
            games = json.results
            this.setState({games: games}, () => this.setState({nextFetchURL: json.next}))
            this.setState({isFetching: false})
        }, 1500);
        this.setState({searchTimeout: timeout})
        
        
    }
  
    render() {

      let { 
          games, 
          nextFetchURL, 
          platformSortValue, 
          dateSort, 
          ratingSort,
          searchInput,
          isFetching
      } = this.state

      let { platforms } = this.props

      let mappedPlatforms = platforms.map(el => {return {label: el.name, value: el.id}})


      if (!games){
        return 0
      }



      return (
        <LoadingOverlay
            active={isFetching}
            spinner
        >
            <div className={styles.layout}>
                <Input placeholder='Max Payne 3...' value={searchInput} onChange={this.onSearchInput}></Input>
                <div className={styles.content_filters_container}>
                    <div className={styles.filters}>
                        <Dropdown 
                            options={mappedPlatforms} 
                            onChange={this.onPlatformSortSelect} 
                            value={platformSortValue}
                            placeholder='Select platform...'
                        />
                        <button className={styles.sorting_btn} onClick={this.toggleRatingSort}>
                            📈{ratingSort? (ratingSort == 'top' ? '▼': '▲') : '▲'}
                        </button>
                        <button className={styles.sorting_btn} onClick={this.toggleDateSort}>
                            📅{dateSort? (dateSort == 'new' ? '▼': '▲') : '▲'}
                        </button>
                    </div>
                    <InfiniteScroll
                        dataLength={games.length}
                        next={this.fetchNextGames}
                        hasMore={nextFetchURL}
                        className={styles.gamesContainer}
                    >
                        {games.map(el => 
                            <Link href='/game/[slug]' as={`/game/${el.slug}`}>
                                <a className={styles.game_card_link_wrapper}>
                                    <GameCard game={el}></GameCard>
                                </a>
                            </Link>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
      </LoadingOverlay>
      );
    }
  }




export default Component


export async function getServerSideProps(context){

    let games = await fetch('https://api.rawg.io/api/games')
    let json = await games.json()
    games = json.results
    let nextGamesURL = json.next
    
    let platforms = await fetch('https://api.rawg.io/api/platforms?ordering=-games_count')
    let pljson = await platforms.json()
    platforms = pljson.results.slice(0,12)

    return {props: {games, platforms, nextGamesURL}}
}