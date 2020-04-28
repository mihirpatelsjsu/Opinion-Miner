const Twitter = require('twitter');
const config = require('./credentials');
const T = new Twitter(config);
const aposToLexForm = require('apos-to-lex-form');
var Sentiment = require('sentiment');

var express = require("express");
var app = express();
var mongoose = require('./db_connection');
var Tweet = require('./models/twitter');


function sentiment_analysis(req, res, cities){
    var topic = req.params.query;

    Tweet.find({ topic: topic }).then((doc) => {
            var sentiment = new Sentiment();
            
            var data = doc[0].tweets;
            var hashtag_array = doc[0].hashtags;
            var positive_tweets = new Object();
            var negative_tweets = new Object();
            var positive_tweets_locations = new Array();
            var negative_tweets_locations = new Array();
            var positive_visibility = 0;
            var negative_visibility = 0;
            
            for(let i=0; i<data.length; i++){
                var t = aposToLexForm(data[i].tweet).toLowerCase();
                t = t.replace(/[^a-zA-Z\s]+/g, '');
                t = t.replace("rt","");
                
                var score = sentiment.analyze(t).score
                if (score>=0){
                    positive_tweets[t] = [score, data[i].followers_count, data[i].location, data[i].hashtags];
                    
                    if (data[i].location != "") {
                        var isIn;
                        if ((data[i].location).includes(",")){
                            isIn = cities.find(element => element['city'].toUpperCase() == ((data[i].location).split(",")[0]).toUpperCase());
                        } else {
                            isIn = cities.find(element => element['city'].toUpperCase() == (data[i].location).toUpperCase());
                        }
                        if (isIn) {
                            positive_tweets_locations.push([isIn['city'], isIn['latitude'], isIn['longitude']]);
                        }
                    }
                    positive_visibility += data[i].followers_count;
                }else{
                    negative_tweets[t] = [score, data[i].followers_count, data[i].location, data[i].hashtags]; 
                    if (data[i].location != "") {
                        var isIn;
                        if ((data[i].location).includes(",")){
                            isIn = cities.find(element => element['city'].toUpperCase() == ((data[i].location).split(",")[0]).toUpperCase());
                        } else {
                            isIn = cities.find(element => element['city'].toUpperCase() == (data[i].location).toUpperCase());
                        }
                        if (isIn) {
                            negative_tweets_locations.push([isIn['city'], isIn['latitude'], isIn['longitude']]);
                        }
                    }
                    negative_visibility += data[i].followers_count;
                }
            }

            var wordcloud_map = new Object();
            var val = "";
            for (let i=0;i <hashtag_array.length; i++){
                val = hashtag_array[i];
                if (val in wordcloud_map){
                    wordcloud_map[val] += 1
                } else {
                    wordcloud_map[val] = 1
                }
            }

            var wordcloud_array = [];
            for (var key in wordcloud_map) {
                wordcloud_array.push([key, wordcloud_map[key]]);
            }

            var positive_tweets_length = Object.keys(positive_tweets).length
            var negative_tweets_length = Object.keys(negative_tweets).length
            var json = {"positive" : positive_tweets_length, "negative" : negative_tweets_length}
        
            res.render("piechart", {"positive_tweets" : positive_tweets_length,
                                    "negative_tweets" : negative_tweets_length,
                                    "positive_visibility" : positive_visibility,
                                    "negative_visibility" : negative_visibility,
                                    "positive_tweets_locations" : positive_tweets_locations,
                                    "negative_tweets_locations" : negative_tweets_locations,
                                    "wordcloud" : wordcloud_array,
                                    "topic" : topic,
                                    "tweets" : data,
                                    "topic": topic})
            
        }).catch((err) => {
            console.log(err);
            console.log("Inside 400 response")
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.end("Error in fetching data");
        });


}


module.exports = {
    sentiment_analysis: sentiment_analysis
}