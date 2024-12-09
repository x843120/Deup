class Spankbang extends Deup {
    config = {
      name: 'Spankbang',
      layout: 'poster',
      pageSize: 100,
      hasInput: true
    };
  
    _baseUrl = 'https://spankbang.com';
    _cookie = '';
    _param = '?q=fhd&d=0';//hd fhd uhd
    inputs = {
        path: {
          label: '页面路径',
          required: true,
          placeholder: '请输入页面路径'
        },
        username: {
          label: '账号',
          required: false,
          placeholder: '请输入账号'
        },
        password: {
          label: '密码',
          required: false,
          placeholder: '请输入密码'
        }
      };
    
    // 推荐 /users/recommendations
    // 趋势 /trending_videos/
    // 未来 /upcoming/
    // 最新 /new_videos/
    // 流行 /most_popular/
    
    async check() {
        const timestamp = Date.now();
        
        const csrf_token = await $axios.get(this._baseUrl+'/users/auth?ajax=1&login=1&_='+timestamp);
        
        const [,token] = csrf_token.data.match(/<input[^>]*id="csrf_token"[^>]*value="([^"]*)"/);
        
        const response = await $axios.post(this._baseUrl+'/users/auth?ajax=1&login=1', {l_username: (await $storage.inputs).username, l_password: (await $storage.inputs).password, csrf_token: token});
        
        $alert(response);
        
        const setCookieHeader = response.headers['set-cookie'];
        
        if (setCookieHeader) this._cookie = setCookieHeader.map(cookie => cookie.split(';')[0]);
        
        return true;
    };
    
    async get(object) {
      const response = await $axios.get(this._baseUrl+object.id);
      const [,streamData] = response.data.match(/var stream_data\s*=\s*(\{.*?\});/,);
      const parsedData = JSON.parse(streamData.replace(/'/g, '"'));
      const resolutions = ['4k', '1080p', '720p', '480p', '320p', '240p'];
      for (const res of resolutions) {
         if (parsedData[res] && parsedData[res].length > 0) {
             object.url = parsedData[res][0];
             object.id = `[res]${object.id}`;
             return {...object};
          }
      }
    }
  
    async list(object, offset, limit) {
      let page = Math.floor(offset / limit) + 1;
      page = page>1 ? page+'/':''
      const path = (await $storage.inputs).path
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
          const cover = $image.attr('data-src');
          return {
            id: $a.attr('href'),
            name: $a.attr('title'),
            remark: $a.attr('title'),
            thumbnail: cover,
            cover: cover,
            poster: cover,
            path: 'video',
          };
        }).get();
    }
  }
  
  Deup.execute(new Spankbang());
  
  
  
