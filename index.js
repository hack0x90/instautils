const { URL } = require('url');
const { spawn } = require('child_process');

const IS_DEBUG = false;

const _getInstagramData = (curlArgs) => {
  return new Promise((resolve, reject) => {
    const curl = spawn ("curl", curlArgs);
    let chunks = [];
    curl.stdout.on("data", data => { chunks.push(data); });
    curl.on('error', (error) => {
      if (IS_DEBUG) {
        console.log(`error: ${error.message}`);
      }
      reject(error);
    });
    curl.on("close", () => {
      let body = Buffer.concat(chunks);
      const data = JSON.parse(body.toString());
      resolve(data);
    });
  });
};

const _getInstagramDownloadLinks = (data) => {
  if (!data.items || data.items.length < 1) {
    throw new Error('Invalid Instagram response.');
  }
  const item = data.items[0];
  const links = {};
  if (item.media_type === 1) {
    const originalWidth = item.original_width;
    const originalHeight = item.original_height;
    const originalAspectRatio = (originalHeight / originalWidth).toFixed(2);
    links.type = 'image'
    links.resolution = `${originalWidth} X ${originalHeight}`;
    item.image_versions2.candidates.forEach((el) => {
      if ((el.height / el.width).toFixed(2) === originalAspectRatio) {
        let maxWidth = 100000;
        let maxHeight = 100000;
        if (el.width === originalWidth && el.height === originalHeight) {
          links['url'] = el.url;
        }
        if (el.width < maxWidth && el.height < maxHeight) {
          links['thumbnail'] = el.url;
          maxHeight = el.height;
          maxWidth = el.width;
        }
      }
    });
  } else if (item.media_type === 2) {
    const originalWidth = item.original_width;
    const originalHeight = item.original_height;
    const originalAspectRatio = (originalHeight / originalWidth).toFixed(2);
    let maxWidth = 100000;
    let maxHeight = 100000;
    let minWidth = 0;
    let minHeight = 0;
    let fallBackIndex = -1;

    links.type = 'video'
    links.resolution = `${originalWidth} X ${originalHeight}`;

    item.video_versions.forEach((el, idx) => {
      if (el.width > minWidth && el.height > minHeight) {
        minHeight = el.height;
        minWidth = el.width;
        fallBackIndex = idx;
      }
      if (el.width === originalWidth && el.height === originalHeight) {
        links['url'] = el.url;
      }
    });

    if (!links.url && fallBackIndex > -1) {
      links.url = item.video_versions[fallBackIndex].url;
    }

    item.image_versions2.candidates.forEach((candidate) => {
      if ((candidate.height / candidate.width).toFixed(2) === originalAspectRatio) {
        if (candidate.height < maxHeight && candidate.width < maxWidth) {
          links.thumbnail = candidate.url;
          maxWidth = candidate.width;
          maxHeight = candidate.height;
        }
      }
    });
  } else if (item.media_type === 8) {
    links.type = 'carousel'
    links.items = [];
    item.carousel_media.forEach((el) => {
      if (el.media_type === 1) {
        const tmp = {};
        let maxWidth = 100000;
        let maxHeight = 100000;
        const originalWidth = el.original_width;
        const originalHeight = el.original_height;
        const originalAspectRatio = (originalHeight / originalWidth).toFixed(2);

        el.image_versions2.candidates.forEach((candidate) => {
          if ((candidate.height / candidate.width).toFixed(2) === originalAspectRatio) {
            if (candidate.width === originalWidth && candidate.height === originalHeight) {
              tmp.type = 'image';
              tmp.resolution = `${originalWidth} X ${originalHeight}`;
              tmp.url = candidate.url;
              // links.items.push({ type: 'image', resolution: `${originalWidth} X ${originalHeight}`, url: candidate.url });
            }
            if (candidate.width < maxWidth && candidate.height < maxHeight) {
              tmp.thumbnail = candidate.url;
              maxWidth = candidate.width;
              maxHeight = candidate.height;
            }
          }
        });
        links.items.push(tmp);
      } else if (el.media_type === 2) {
        const originalWidth = el.original_width;
        const originalHeight = el.original_height;
        const originalAspectRatio = (originalHeight / originalWidth).toFixed(2);
        const tmp = {};
        let maxHeight = 100000;
        let maxWidth = 100000;
        let minWidth = 0;
        let minHeight = 0;
        let fallBackIndex = -1;

        for (let i = 0; i < el.video_versions.length; i++) {
          if (el.video_versions[i].width > minWidth && el.video_versions[i].height > minHeight) {
            minHeight = el.video_versions[i].height;
            minWidth = el.video_versions[i].width;
            fallBackIndex = i;
          }
          if (el.video_versions[i].width === originalWidth && el.video_versions[i].height === originalHeight) {
            // links.items.push({ type: 'video', resolution: `${originalWidth} X ${originalHeight}`, url: el.video_versions[i].url });
            tmp.type = 'video';
            tmp.resolution = `${originalWidth} X ${originalHeight}`;
            tmp.url = el.video_versions[i].url
            break;
          }
        }

        el.image_versions2.candidates.forEach((el) => {
          if ((el.height / el.width).toFixed(2) === originalAspectRatio) {
            if (el.height < maxHeight && el.width < maxWidth) {
              tmp.thumbnail = el.url;
            }
          }
        })

        if (!tmp.url && fallBackIndex > -1) {
          tmp.type = 'video';
          tmp.resolution = `${el.video_versions[fallBackIndex].width} X ${el.video_versions[fallBackIndex].height}`;
          tmp.url = el.video_versions[fallBackIndex].url
        }

        links.items.push(tmp);
      }
    });
  }

  return links;
}

const main = async (options) => {
  const { instaShareUrl, sessionId, proxy } = options;
  const url = new URL(instaShareUrl);
  const curlUrl = `${url.origin}${url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`}`;
  // Create arguments array for curl command
  let curlArgs = [];
  if (proxy) {
    curlArgs = curlArgs.concat(["-x", proxy]);
  }
  curlArgs = curlArgs.concat([
    "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
    "--cookie", `sessionid=${sessionId}`,
    `${curlUrl}?__a=1`
  ]);

  const instaData = await _getInstagramData(curlArgs);
  return _getInstagramDownloadLinks(instaData);
};

module.exports = main;