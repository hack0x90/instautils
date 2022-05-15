const getInstaLinks = require('../');

const getLinks = async () => {
  const instaLinks = await getInstaLinks({
    instaShareUrl: 'https://www.instagram.com/p/CdgEhhNOzh-/',
    sessionId: process.env.INSTA_SESSION_ID
  });
  console.log(instaLinks);
}

getLinks();