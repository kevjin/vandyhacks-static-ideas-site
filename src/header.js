import React from 'react';

let createReactClass = require('create-react-class');

//credits to toggle css: https://stackoverflow.com/questions/39846282/how-to-add-the-text-on-and-off-to-toggle-button
let Header = createReactClass({
    sortIdeas: function() {
      this.props.sortIdeas();
    },
    render: function() {
      return(
          <div className = "wrapper">
            <h1 className = "header-text">VandyHacks Idea Board</h1>
            <label className="switch">
            <input type="checkbox" id="togBtn" onClick={this.sortIdeas}></input>
            <div className="slider round">
            <span className="on">Popular</span>
            <span className="off">Recent</span>
            </div>
            </label>

          <style jsx global>{`
            * {
              padding: none;
              margin: none;
            }
            `}</style>
          <style jsx>{`
          .wrapper {
            background-color: #5DB5A4;
            width: 98%;
            padding: 1%;
          }
          .header-text {
            color: white;
            font-family: 'Arial';
            font-size: 52px;
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 190px;
            height: 34px;
          }

          .switch input {display:none;}

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #F57A82;
            -webkit-transition: .4s;
            transition: .4s;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 88px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
          }

          input:checked + .slider {
            background-color: #ED5276;
          }

          input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
          }

          input:checked + .slider:before {
            -webkit-transform: translateX(95px);
            -ms-transform: translateX(95px);
            transform: translateX(95px);
          }

          /*------ ADDED CSS ---------*/
          .on
          {
            display: none;
          }

          .on, .off
          {
            color: white;
            position: absolute;
            transform: translate(-50%,-50%);
            top: 50%;
            font-size: 16px;
            font-family: Verdana, sans-serif;
            font-weight: bold;
          }
          .on {
            left: 25%;
          }
          .off {
            right: -5%;
          }

          input:checked+ .slider .on
          {display: block;}

          input:checked + .slider .off
          {display: none;}

          /*--------- END --------*/
}
          `}</style>
          </div>
      );
    }
});

export default Header;
