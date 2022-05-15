# Instautils Instagram Downloader
A simple NPM package to get download links from Instagram post share link. This package does not have any external dependencies. Working demo can be accessed at https://instautils.com/en
## Prerequisites
- You need `curl` executable in PATH.
- To use this package make sure you get value of `sessionid` cookie from your browser and create an env variable named `INSTA_SESSION_ID` with value of sessionid cookie value.

```bash
# Create INSTA_SESSION_ID env variable
export INSTA_SESSION_ID="You sessionid cookie value"
```

## Module Usage
Instagram post share link must look like `https://www.instagram.com/p/CdgEhhNOzh-/`.
```js
const getInstaLinks = require('@hack0x90/instautils');

const getLinks = async () => {
  const instaLinks = await getInstaLinks({
    instaShareUrl: 'https://www.instagram.com/p/CdgEhhNOzh-/',
    sessionId: process.env.INSTA_SESSION_ID
  });
  console.log(instaLinks);
}

getLinks();
```

The output from above code. 
```js
{
  type: 'image',
  resolution: '1080 X 1350',
  url: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280752070_675174807113608_3779942454923625239_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=z5pHkfMEMiYAX9r8qNU&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNzI4NzY2MDgyNzY1NDI3MA%3D%3D.2-ccb7-4&oh=00_AT94giM4sf1JHpvVni9eHrYNSwnCjLqwSGGiGOr7Csquhw&oe=6287C8A6&_nc_sid=83d603',
  thumbnail: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280752070_675174807113608_3779942454923625239_n.webp?stp=dst-jpg_e35_p240x240&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=z5pHkfMEMiYAX9r8qNU&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNzI4NzY2MDgyNzY1NDI3MA%3D%3D.2-ccb7-4&oh=00_AT_vnVEVctUN6x_nX16WQkRw7Q6bd7-_s4yCqhEAVgj7ig&oe=6287C8A6&_nc_sid=83d603'
}
```
Possible values of 'type' in above object are `image`, `video` or `carousel`.

## Handling Carousels
The output for Instagram carousel is a bit different from single image/video posts.
```js
{
  type: 'carousel',
  items: [
    type: 'image',
      resolution: '1080 X 1350',
      url: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280386283_1351347165376889_6228591442054453714_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=C2-aVe-NuiIAX-qnDzq&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNjY5NjIzOTMyNDc0MTM0OA%3D%3D.2-ccb7-4&oh=00_AT-jdWA2Jyzc00kPexgxuQlp1QhT9dSW0Zj2avaXIYGz9Q&oe=6288F9AC&_nc_sid=83d603',
      thumbnail: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280386283_1351347165376889_6228591442054453714_n.webp?stp=dst-jpg_e35_p240x240&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=C2-aVe-NuiIAX-qnDzq&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNjY5NjIzOTMyNDc0MTM0OA%3D%3D.2-ccb7-4&oh=00_AT_nDkUlxG-9kRmPbuqYjYOApAo0hUK3DBbY1wJ---0ltA&oe=6288F9AC&_nc_sid=83d603'
    },
    {
      type: 'image',
      resolution: '1078 X 1343',
      url: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280534660_311617901155272_5570918473713607424_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=6NS0YeY0XHkAX_et-4m&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNjY5NjIzOTY5MzY3MjA5OQ%3D%3D.2-ccb7-4&oh=00_AT-Av_7YfaZedffPQ78Q4zk-qri8uXQ38I_0zV_cwxjuxg&oe=62882AFC&_nc_sid=83d603',
      thumbnail: 'https://instagram.fkhi6-1.fna.fbcdn.net/v/t51.2885-15/280534660_311617901155272_5570918473713607424_n.webp?stp=dst-jpg_e35_p240x240&_nc_ht=instagram.fkhi6-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=6NS0YeY0XHkAX_et-4m&edm=AABBvjUBAAAA&ccb=7-4&ig_cache_key=MjgzNjY5NjIzOTY5MzY3MjA5OQ%3D%3D.2-ccb7-4&oh=00_AT-nUMCb67oStt3JkMDK6SMv43t8d4cvLzuxhE-650yDUg&oe=62882AFC&_nc_sid=83d603'
    }
  ]
}
```

## Dealing with Instagram CORS restrictions
You can download above images/videos/thumbnails using `curl` or any other similar utility. But if you are using this script on a website then you have to download it on your server and then return the response to user. To avoid this downloading issue, create a generic forwarding route on your server that will stream data from Instagram to your user
```js
// Generic forwardning route
app.get('/api/getFile', async (req, res) => getFile(req, res));

// Handler for above route
const getFile = (req, res) => {
  const { url } = req.query;
  https.get(url, (stream) => {
    stream.pipe(response);
    stream.on('end', () => {
      response.end();
    })
  });
};
```

So to display thumbnails or images from Instragram, your `img` tag will be something like below.

```html
<img src="https://yourwebsite.com/api/getFile?url={Link for Instagram image or audio}">
```