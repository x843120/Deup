class Spankbang extends Deup {
    config = {
      name: 'Spankbang',
      layout: 'poster',
      pageSize: 100,
      hasInput: false
    };
  
    _baseUrl = 'https://spankbang.com';
    _cookie = 'auth=IjM3MDIwMzYyOjo6ODQzMTIwIg._Ld35lHrMYf6AshjM5HgsWBH1w0';
    _param = '?q=fhd&d=0';//hd fhd uhd

    // 推荐 /users/recommendations
    // 趋势 /trending_videos/
    // 未来 /upcoming/
    // 最新 /new_videos/
    // 流行 /most_popular/
    
    check = () => true;
    
    async get(object) {
      const response = await $axios.get(this._baseUrl+object.id);
      const [,streamData] = response.data.match(/var stream_data\s*=\s*(\{.*?\});/,);
      const parsedData = JSON.parse(streamData.replace(/'/g, '"'));
      for (const res of ['4k', '1080p', '720p', '480p', '320p', '240p']) {
         if (parsedData[res] && parsedData[res].length > 0) {
             object.url = parsedData[res][0];
             object.id = `[res]${object.id}`;
             return {...object};
          }
      }
    }
  
    async list(object, offset, limit) {
      let page = Math.floor(offset / limit) + 1;
      page = page > 1 ? `/${page}/` : '';
      const path = (await $storage.inputs).path || '/users/recommendations'
      const url = `${this._baseUrl}${path}${page}${this._param}`;
      const response = await $axios.get(url, {
        headers: {
          Cookie: this._cookie,
        },
      });
      return this.parseVideoList(response.data);
    }

    async search(object, keyword, offset, limit) {
        let page = Math.floor(offset / limit) + 1;
        const url = `${this._baseUrl}/s/${keyword}/${page}/${this._param}&o=trending`;
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
          return {
            id: $a.attr('href'),
            name: $a.attr('title'),
            remark: $a.attr('title'),
            thumbnail: $image.attr('data-src'),
            cover: $image.attr('data-src'),
            poster: $image.attr('data-src'),
            path: 'video',
          };
        }).get();
    }
  }
  
  Deup.execute(new Spankbang());
  
  
  
