const Twitter = require('twitter');
const config = require('./credentials');
const T = new Twitter(config);

var express = require("express");
var app = express();
var mongoose = require('./db_connection');
var Tweet = require('./models/twitter');
var user = require('./models/user');
var sent = require('./sentiment');

//get method
function get_request(req,res){
    var topic = req.params.query;

    Tweet.find({ topic: topic }).then((doc) => {
            // console.log("success" + doc)
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });
            res.end(JSON.stringify(doc));
        }).catch((err) => {
            console.log(err);
            console.log("Inside 400 response")
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.end("Error in fetching data");
        });


}

//post request and update request combined
function post_request(req,res){
    var topic = req.body.topic;
  const params = {
      q: req.body.topic,
      count: 100,
      result_type: 'recent',
      lang: 'en'
    }
    var tweetsArray = []
  
  Tweet.findOne({topic:topic}).then(doc => {

    if(doc){
      T.get('search/tweets', params).then(response => {
    
        for(let i=0;i<response.statuses.length;i++){
          var time = response.statuses[i].created_at.split(" ")
          
          var jsonData = {};
          jsonData["name"]=response.statuses[i].user.name;
          jsonData["screen_name"]=response.statuses[i].user.screen_name;
          jsonData["tweet"] = response.statuses[i].text;
          jsonData["time"] = time[1]+ " " +time[2];
          jsonData["retweet_count"] = response.statuses[i].retweet_count;
          jsonData["location"] = response.statuses[i].user.location;
          jsonData["followers_count"] = response.statuses[i].user.followers_count;
            
          doc.tweets.push(jsonData)
          let match = null;
          var re = /#\S*\w/g;
          do {
            match = re.exec(response.statuses[i].text);
            if (match) {
              doc.hashtags.push(match[0]);
            }
          } while(match);
        }
        Tweet.findOneAndUpdate({topic:topic},{$set: {hashtags: doc.hashtags, tweets : doc.tweets}} ).then( docu => {
          // var responseObject = {
          //   "topic": req.body.topic,
          //   "hashtags": doc.hashtags,
          //   "tweets": doc.tweets
          // }
          res.redirect("/analysis/"+topic);
          // res.render("tab2", {res: responseObject});
        }).catch(e => {
          console.log("eror in update" + e)
          res.writeHead(500, {
            "Content-Type": "text/plain"
          });
          res.end("Error in update!");
        })
      }).catch(e => {
        console.log("error in tweet get")
        res.writeHead(500, {
          "Content-Type": "text/plain"
        });
        res.end("Internal server error!");
      })
      
    } else{
      console.log("Not found")
      T.get('search/tweets', params).then(response => {
        var hashtag_array = [];
          for(let i=0;i<response.statuses.length;i++){
            
            var time = response.statuses[i].created_at.split(" ")
            var jsonData = {};
            jsonData["name"]=response.statuses[i].user.name;
            jsonData["screen_name"]=response.statuses[i].user.screen_name;
            jsonData["tweet"] = response.statuses[i].text;
            jsonData["time"] = time[1]+ " " +time[2];
            jsonData["retweet_count"] = response.statuses[i].retweet_count;
            jsonData["location"] = response.statuses[i].user.location;
            jsonData["followers_count"] = response.statuses[i].user.followers_count;

            tweetsArray.push(jsonData);
            let match = null;
            var re = /#\S*\w/g;
            do {
              match = re.exec(response.statuses[i].text);
              if (match) {
                hashtag_array.push(match[0]);
              }
            } while(match);
          }
          var tweet = new Tweet({
              topic: req.body.topic,
              hashtags: hashtag_array,  
              tweets: tweetsArray
            });
      
          tweet.save().then(docu => {
            // console.log("Tweet added successfully" + docu)
            // var responseObject = {
            //   "topic": req.body.topic,
            //   "hashtags": hashtag_array,
            //   "tweets": tweetsArray
            // }
            // console.log("document: "+docu);
            res.redirect("/analysis/"+topic);
            // res.render("tab2", {res: responseObject});
          }).catch(e => {
            console.log("Error in saving")
            res.writeHead(500, {
              "Content-Type": "text/plain"
            });
            res.end("Error in create!");
          })
        })
    }
  }).catch(e => {
    console.log("Error in findone initial")
    res.writeHead(500, {
      "Content-Type": "text/plain"
    });
    res.end("Internal server error");
  })
}

//delete request
function delete_request(req,res){
    var topic = req.params.query;
  Tweet.findOne({topic : topic}).then(doc => {
    if(doc){
      Tweet.findOneAndDelete(topic).then(response => {
        // console.log("Deleted" + response)
        res.redirect('/home')
      }).catch(e => {
        console.log("Error in Deletion")
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Unsuccessful delete");
      })
    } else{
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("No tweets found for this topic");
    }
  }).catch(e => {
    console.log("Error in finding one")
    res.writeHead(400, {
      "Content-Type": "text/plain"
    });
    res.end("internal sserver error");
  })

}

// //trends
// function get_trends(req,res){
//   var woeid = new Object();
//   woeid["World"] = 1;
//   woeid["India"] = 23424848;
//   woeid["USA"] = 23424977;
//   woeid["UK"] = 23424975;
//   woeid["Canada"] = 23424775;
//   woeid["Australia"] = 23424748;
//   if(req.params.place in woeid){
//   var query_id = woeid[req.params.place];
//   }else{
//     var query_id = 1
//   }

//   const params = {
//       id: query_id
//     }

//     T.get('trends/place', params).then(response => {
//       // console.log("params: " + params.id);
//       var trends_length = response[0].trends.length; 
//       // console.log("trends fetched : " + trends_length);
//         var trendsArray = [];
//         for(let i=0;i<trends_length;i++){
//          if(response[0].trends[i].tweet_volume != null){  
//          trendsArray.push({name:response[0].trends[i].name, volume:response[0].trends[i].tweet_volume})
//         // trendsArray.push([response[0].trends[i].name, response[0].trends[i].tweet_volume])
//          }
//         }
        
//         // var result = (trendsArray.sort((a,b) => b.volume-a.volume)).slice(0,15)
//         var result = trendsArray.slice(0,15);
//         var out = new Array();
//         result.forEach(element => {
//           out.push([element.name, element.volume])
//         });
//         console.log(out);
//         res.render("home", {"topics" : out});
//       })
// }

//trends
function get_trends ( req, res, callback ) {
  // console.log("get_trends")
  var woeid_arr = [ 1, 23424848, 23424977, 23424975, 23424775 ]
  var loc_arr = [ "WORLD", "INDIA", "USA", "UK", "CANADA" ]
  trendsObject = new Object()

  trend_by_place( trendsObject, woeid_arr, loc_arr, 0, callback )
  // return trendsObject;
}

function trend_by_place ( trendsObject, woeid_arr, loc_arr, ind, callback ) {
  // console.log("trend_by_place")
  if( ind > 4 ) {
    callback( trendsObject )
  } else {
    const params = {
      id: woeid_arr[ ind ],
      exclude: "hashtags"
    }
    var trendsArray = []
    T.get( 'trends/place', params ).then( response => {
      var trends_length = response[ 0 ].trends.length;

      for( let i = 0; i < trends_length; i++ ) {
        if( response[ 0 ].trends[ i ].tweet_volume != null ) {
          trendsArray.push( {name: response[ 0 ].trends[ i ].name, volume: response[ 0 ].trends[ i ].tweet_volume} )
        }
      }
      var result = ( trendsArray.sort( ( a, b ) => b.volume - a.volume ) ).slice( 0, 10 )

      trendsObject[ loc_arr[ ind ] ] = result

      trend_by_place( trendsObject, woeid_arr, loc_arr, ind + 1, callback )
    } ).catch(e => {
      console.log("Error in finding one")
    })
  }

}

function storeUser(username, password, req, res) {
  user.find({ username: username }).then((doc) => {
    if (doc.length > 0) {
      return res.render('login', {error: "Usernaeme already exists", dynamicLoad: "Sign Up"});
    } else {
      var User = new user({
        username: username,
        password: password
      });
      User.save().then(docu => {
        res.redirect("/login");
      }).catch(e => {
        console.log(e);
        return "error"
      });
    }
  });
}

function getUser(username, password, req, res) {
  user.find({ username: username }).then((doc) => {
    if (doc.length > 0) {
      if (doc[0].password == password) {
        req.session.user = {username: username}; 
        res.cookie('user', 'user');
        res.redirect('/home');
      } else {
        res.render("login", {error: "Username or Password is incorrect", dynamicLoad: "Login"})
      }
    } else {
      res.render("login", {error: "Username or Password is incorrect", dynamicLoad: "Login"})
    }
  }).catch((err) => {
      console.log(err);
      console.log("Inside 400 response")
      res.end("error");
  });
}

//analysis
function analysis(req,res,cities){
    sent.sentiment_analysis(req,res,cities);
}


module.exports = {
    get_request: get_request,
    post_request: post_request,
    delete_request: delete_request,
    analysis: analysis,
    get_trends: get_trends,
    storeUser: storeUser,
    getUser: getUser    
}