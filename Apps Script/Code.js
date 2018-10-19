function getAllPosts() {
  var communityId = "102471985047225101769";
  var firebaseBaseUrl = "https://apps-script-community-archive.firebaseio.com/";
  var maxNbOfPostsToRetrieve = 30;

  var token = ScriptApp.getOAuthToken();
  var fb = FirebaseApp.getDatabaseByUrl(firebaseBaseUrl, token);
  var nextPageToken = null;
  var count = 0;
  do {
    var activityFeed = Plus.Activities.search("community:" + communityId, {pageToken: nextPageToken});
    nextPageToken = activityFeed.nextPageToken;
    var posts = activityFeed.items;

    for (var i in posts) {
      count++;
      var postId = posts[i].id;
      fb.setData("posts/" + postId, posts[i]);

      // retrieve comments
      var comments = Plus.Comments.list(postId).items;
      for (var j in comments) {
        var commentId = FirebaseApp.encodeAsFirebaseKey(comments[j].id);
        fb.setData("comments/" + postId + "/" + commentId, comments[j]);
      }

      // retrieve plusoners
      var plusoners = Plus.People.listByActivity(postId, "plusoners").items;
      for (var j in plusoners) {
        var plusoneId = plusoners[j].id;
        fb.setData("plusoners/" + postId + "/" + plusoneId, plusoners[j]);
      }

      // retrieve resharers
      var resharers = Plus.People.listByActivity(postId, "resharers").items;
      for (var j in resharers) {
        var reshareId = resharers[j].id;
        fb.setData("resharers/" + postId + "/" + reshareId, resharers[j]);
      }
    }
  } while (nextPageToken && count < maxNbOfPostsToRetrieve);
}