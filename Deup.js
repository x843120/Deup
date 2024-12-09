class Spankbang extends Deup {
    config = {
      name: 'Spankbang',
      layout: 'cover',
      hasInput: false
    };
  
    _baseUrl = 'https://spankbang.com';
    _cookie = 'auth=IjM3MDIwMzYyOjo6ODQzMTIwIg._Ld35lHrMYf6AshjM5HgsWBH1w0';

    async get(object) {
      const response = await $axios.get(this._baseUrl+object.id);
      const [,streamData] = response.data.match(/var stream_data\s*=\s*(\{.*?\});/,);
      const parsedData = JSON.parse(streamData.replace(/'/g, '"'));
      const resolutions = ['4k', '1080p', '720p', '480p', '320p', '240p'];
      let videoSrc = null;
      for (const res of resolutions) {
         if (parsedData[res] && parsedData[res].length > 0) {
             videoSrc = res;
             break; 
          }
      }
    
      return {...object, url: parsedData[videoSrc][0], modified: videoSrc};
    }
  
    async list(object, offset, limit) {
      const response = await $axios.get(this._baseUrl, {
        headers: {
          Cookie: this._cookie,
        },
      });
      return this.parseVideoList(response.data);
    }

    async search(object, keyword, offset, limit) {
        const url = `${this._baseUrl}/s/${keyword}/`;
        const response = await $axios.get(url, {
          headers: {
            Cookie: this._cookie,
          },
        });
        return this.parseVideoList(response.data);
    }
  
    parseVideoList(data) {
      const $ = $cheerio.load(data);
  
      return $('div.video-list').children('div').map((i, el) => {
          const $a = $(el).find('a').first();
          const $image = $(el).find('img.cover').first();
          const cover = $image.attr('data-src');
          return {
            id: $a.attr('href'),
            name: $a.attr('title'),
            thumbnail: cover,
            cover: cover,
            poster: cover,
            type: 'video',
          };
        }).get();
    }
  }
  
  Deup.execute(new Spankbang());
