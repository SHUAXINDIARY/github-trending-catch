const url = "https://github.com/trending/javascript";
const Crawler = require('crawler')

const init = () => {
  const c = new Crawler({
    // maxConnections: 10,
    callback: (err, res, done) => {
      if (err) {
        console.log(err)
      }
      done()
    }
  })
  c.queue({
    url,
    jQuery: true,
    since: 'daily',
    callback: (err, res, done) => {
      if (err) {
        done()
      }
      const $ = res.$
      let result = [];
      // 获取要爬取的dom
      const box = $(".Box");
      // 获取header
      const header = box.find(".Box-header");
      // 获取内容
      const list = box.find(".Box-row");
      for (let i = 0; i < list.length; i++) {
        // 当前dom
        const item = $(list[i])
        // 获取要的数据 文本信息去除换行 + 空格
        const title = item.find('h1').find('a').text().trim().replace(/[\r\n]|[ ]/g,"");
        const href = `https://github.com/${$(item).find("h1").find("a").attr("href").trim()}`;
        const desc = $(item).find("p").text().trim();
        const starCount = $($(item).find(".f6").find('a')['0']).text().replace(/[\r\n]|[ ]/g,"");
        const forkCount = $($(item).find(".f6").find('a')['1']).text().replace(/[\r\n]|[ ]/g,"");;
        const data = {
          title,
          href,
          desc,
          starCount,
          forkCount
        };
        result.push(data);
      }
      console.log(result)
      done()
    }
  })
}
init()
