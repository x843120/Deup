class Spankbang extends Deup {
config = {
  name: 'Spankbang',
  layout: 'poster',
  pageSize: 100,
  hasInput: false
};

_baseUrl = 'https://spankbang.com';
_cookie = 'coe=ww; videos_layout=four-col; ana_vid=cb04d31ae836a987c1f5e5c847190ade39003bac99bfec88e8bca2e100786f19; age_pass=1; age_pass=1; _hjSessionUser_5012962=eyJpZCI6IjdmMzgzMzI1LTczMWUtNTAyMS1iNjI0LTc2NmVjNTE4MDYzOSIsImNyZWF0ZWQiOjE3MzI3MjI1MDIxMTIsImV4aXN0aW5nIjp0cnVlfQ==; UUID=d326d139-85cc-599d-8596-503aaa8d8b72; coc=CN; cor=AH; _ga=GA1.1.1806101748.1732722498; player_quality=720; auth=IjM3MDIwMzYyOjo6ODQzMTIwIg._Ld35lHrMYf6AshjM5HgsWBH1w0; cfc_ok=00|2|ww|www|master|37020362; pg_interstitial_v5=1; backend_version=main; __cf_bm=.pOkB9Dpy3n8iQYT_6uFU_Bsn8dXIvgpZppmm6alWRo-1733920381-1.0.1.1-lVSiwjObrsoaJs7QfbdQnO47RrFfS2OZCiCwNGy5O3JNQ1DLVt5b6sGoC0gJAhqj0d3DIa_QzmSFC2Z2Do2XsQ; cf_clearance=_VpUI3cO_OLnxWuCb_w6zEo7DQLuYukArusV.f3wOmc-1733920382-1.2.1.1-WxKAK4AxAf39R4ZeJ3lVRwZrHjGk5EdJEQd7B3uv3540Dk2aV6SNSsIUfswO7Le.C5mbRchhBU4mX01hlf.8LB_okp.L6bOSI.e5gAnWi3W6Ued0TbR8KI1HO5oMiKdnTCAGflelP2yVc.jK_XOWW4wZAlsx8jmZUiuJlPBHSKu7M0GM.RfxTocdahPiy7PAXbjJmULMhy70I4rliOnsQrsBcmq5Sidz..BeJHEaG9a7kRYIoGVlQQpNP_3YGXvCKXwU5Q6diUyASYfu.lJznCTQuEKw13shfdBXDJZTA5.9V14oI.JOpP6ONM0XN_5vbUALpfv_ht_xQRWJdicFjsMi.k35eKGtmPY2dAU6Sq.QrZMAehbSDY8J_SPVtpVGpGVMG9jEicT3qzHWOqO0U.bPGEXqRQpREaYsF4hybSsrxOTx6dXyOaBkcGyuOdafbAgDPKjuXSCPtkvFTzcj5Q; sb_session=.eJwFwUEOhCAMBdC7dO3CMS1TuQwB8knMONUUXBnv7ns3pRP-zwYbFIdfmKh2b2kcPxhFAodcRZSZZSkI37KCq2goc4No_RSVgEVpos0G3PKerg6n2PLe8bwSpB-E.Z1mGvA.1nfmQV5YJirCv9oZsJ_FOZx5joI; _ga_D3Y7J48ZCJ=GS1.1.1733920386.20.1.1733920449.0.0.0';
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
         object.id = res;       
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
      'Cookie': this._cookie,
      ':authority': 'spankbang.com,
      ':method': 'GET',
      ':path': '/users/recommendations',
      ':scheme': 'https',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'max-age=0',
      'priority': 'u=0, i',
      'referer': 'https://spankbang.com/',
      'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-arch': "x86",
      'sec-ch-ua-bitness': "64",
      'sec-ch-ua-full-version': "131.0.2903.86",
      'sec-ch-ua-full-version-list': '"Microsoft Edge";v="131.0.2903.86", "Chromium";v="131.0.6778.109", "Not_A Brand";v="24.0.0.0"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-model': "",
      'sec-ch-ua-platform': "Windows",
      'sec-ch-ua-platform-version': "15.0.0",
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
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
        type: 'video',
      };
    }).get();
}
}

Deup.execute(new Spankbang());
