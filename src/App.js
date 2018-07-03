import React from 'react';
import Header from '../src/header';
import IdeaPost from '../src/ideaPost';

var createReactClass = require('create-react-class');
var App = createReactClass({
  getInitialState: function() {
    return {loaded: false, isRecent: true, oldData: "{}"};
  },
  //returns all the cards on trello board in an array
  //TODO: Used a hack to nest objects in react state, clean that up later because
  //objects shouldn't be nested like that to begin with.
  componentWillMount: function() {
    fetch('http://vandyhacks-slackbot.herokuapp.com/api/cards', {
      method: 'GET',
    }).then(x => {return x.text()}).then(JSON.parse).then(this.sortAllByRecent).then(this.addTimeStampToAllCards).then(JSON.stringify).then((x) => {
      this.setState({
        loaded: true,
        data: x,
        initial: x,
        currentTag: "ALL"
      });
    });
  },
  addTimeStampToAllCards: function(cards) {
    return new Promise((resolve, reject) => {
      for(let i in cards) {
        this.addTimeStamp(cards[i])
        if(i==cards.length-1) {
          resolve(cards)
        }
      }
    })
  },
  sortAllByRecent: function(cards) {
    return new Promise((resolve, reject) => {
      cards.sort(function(a,b) {
        return Date.parse(a.dateLastActivity) - Date.parse(b.dateLastActivity);
      }).reverse()
      resolve(cards)
    })
  },
  addTimeStamp: function(card) { 
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let postedTime = new Date(card.dateLastActivity);
    let formattedTime = `${months[postedTime.getMonth()]} ${postedTime.getDate()}, ${postedTime.getFullYear()}`
    card.postedTime = `Last updated on ${formattedTime}`
    // const MINUTE = 60 * SECOND
    // const SECOND = 1
    // const HOUR = MINUTE * 60
    // const DAY = HOUR * 24
    // let postedTime = Date.parse(card.dateLastActivity);
    // let currentTime = Date.now();
    // console.log(typeof(postedTime));
    // console.log(postedTime);
    // let lastUpdated = currentTime - postedTime;
    // console.log(`Time diff ${lastUpdated/MINUTE}`)
    // if(lastUpdated/DAY >= 1) {
    //   card.lastUpdated = `Last updated ${Math.floor(lastUpdated/DAY)} days ago`;
    //   return;
    // }
    // if(lastUpdated/HOUR >= 1) {
    //   card.lastUpdated = `Last updated ${Math.floor(lastUpdated/DAY)} hours ago`;
    //   return;
    // }
    // if(lastUpdated/MINUTE >= 1) {
    //   card.lastUpdated = `Last updated ${Math.floor(lastUpdated/DAY)} minutes ago`;
    //   return;
    // }
    // if(lastUpdated/SECOND >= 1) {
    //   card.lastUpdated = `Last updated ${Math.floor(lastUpdated/DAY)} seconds ago`;
    //   return;
    // }
  },
  sortIdeas: function() {
    if(!this.state.isRecent) {
      // this.setState({
      //   data: this.state.oldData,
      //   isRecent: true
      // })
      this.filterTag(this.state.currentTag);
      this.setState({
        isRecent: true
      })
      return;
    }
    new Promise((resolve, reject) => {
      let sortByUpvotes = []
      let cards = JSON.parse(this.state.data);
      this.addTimeStamp(cards[0])
      for (let i in cards) {
        let upvotes = 0;
        if(cards[i].desc.indexOf("Upvotes: ")!=-1) {
          if(cards[i].desc.indexOf("Edited")==-1) {
            upvotes = cards[i].desc.substring(cards[i].desc.indexOf("Upvotes: ")+("Upvotes: ").length, cards[i].desc.length);
          } else {
            upvotes = cards[i].desc.substring(cards[i].desc.indexOf("Upvotes: ")+("Upvotes: ").length, cards[i].desc.indexOf("Edited"));
          }
        }
        sortByUpvotes.push([upvotes,cards[i]]);
      }
      sortByUpvotes.sort().reverse()
      let sortedCards = [];
      for (let i in sortByUpvotes) sortedCards.push(sortByUpvotes[i][1]);
      resolve(sortedCards);
      reject("whoops");
    }).then(sortedCards  => {
      this.setState((prevState, props) => {return {
        oldData: prevState.data
      }});
      this.setState({
        data: JSON.stringify(sortedCards)
      });
      this.setState({
        isRecent: false
      });
    });
  },
  filterTag: function(tag) {
    console.log(this.state.isRecent);
    new Promise((resolve, reject) => {
      let cards = JSON.parse(this.state.initial);
      if(tag!=="ALL") {
        let filteredCards = []
        for(let i in cards) {
          if(cards[i].desc.substring(cards[i].desc.indexOf("Committee:")+("Committee:").length+1, cards[i].desc.indexOf("Submitted")-1)==tag) {
            filteredCards.push(cards[i])
          }
        }
        resolve(filteredCards);
      }
        if(!this.state.isRecent) {
          console.log("ok please");
          this.sortAllByRecent(cards);
        }
        resolve(cards);
        reject("whoopsies!!!!");
    }).then(filteredCards => {
      this.setState({
        data: JSON.stringify(filteredCards)
      });
      this.setState({
        currentTag: tag
      })
      if(!this.state.isRecent) {
        this.setState({
          isRecent: true
        })
        this.sortIdeas()
      }
    })
  },
  render: function() {
    if (this.state.loaded) {
      return (
        <div>
          <Header sortIdeas = {this.sortIdeas} filterTag = {this.filterTag}/>
          {
            JSON.parse(this.state.data).map((card, i) => {
              return (
                <div key={i + card.desc}>
                <IdeaPost ideaName = {card.name} ideaDesc = {card.desc} lastChanged = {card.postedTime} />
                </div>
              )
          })}

          <style jsx>{`
            html {
              background-color: #0F0C2D;
            }
            `}</style>
        </div>
      );
    } else {
      return (
        <div>
              <Header />
              <h2 className = "idea">Loading...</h2>
              <style jsx>{`
                .idea {
                  background-color: #F4CDA5;
                  padding: 12px;
                  border-radius: 8px;
                  font-weight: bold;
                }
                html {
                  background-color: #0F0C2D;
                }
                `}</style>
              </div>
            );
    }
  }
});

export default App;
