const url = "https://github.com/trending/javascript";
const Crawler = require('crawler')

const get = async () => {
  return await new Promise((resolve, reject) => {
    const c = new Crawler({
      maxConnections: 10,
      callback: (err, res, done) => {
        if (err) {
          console.log(err)
        }
        done()
      }
    })
    c.direct({
      url,
      callback: (err, res) => {
        if (err) {
          done()
          reject(err)
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
          const title = item.find('h1').find('a').text().trim()
            .replace(/[\r\n]|[ ]/g, "");
          const href =
            `https://github.com/${$(item).find("h1").find("a").attr("href").trim()}`;
          const desc = $(item).find("p").text().trim();
          const starCount = $($(item).find(".f6").find('a')['0'])
            .text().replace(/[\r\n]|[ ]/g, "");
          const forkCount = $($(item).find(".f6").find('a')['1'])
            .text().replace(/[\r\n]|[ ]/g, "");;
          const data = {
            title,
            href,
            desc,
            starCount,
            forkCount
          };
          result.push(data);
        }
        resolve(result)
      }
    })
  })
}
const init = async () => {
  const res = await get()
  console.log(res)
}
init()
