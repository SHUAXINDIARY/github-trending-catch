const url = "https://github.com/trending/javascript?since=daily";
const puppeteer = require("puppeteer");
const $ = require("jquery");
//因为要请求信息，这里我们加入async
const init = async () => {
    //1. 打开浏览器
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        // headless: false    //以无头浏览器的形式打开浏览器，没有界面显示，在后台运行的
    });
    //2. 创建tab标签页
    const page = await browser.newPage();
    //3. 跳转到指定网址
    await page.goto(url, {
        waitUntil: "networkidle2", //等待网络空闲时，在跳转加载页面
    });
    //4. 等待网址加载完成，开始爬取数据
    //开启延时器，延时2秒钟在开始爬取数据
    await timeout();

    let result = await page.evaluate(() => {
        //对加载好的页面进行dom操作
        //所有爬取的数据数组
        let result = [];
        // 获取要爬取的dom
        const box = $(".Box");
        // 获取header
        const header = box.find(".Box-header");
        // 获取内容
        const list = box.find(".Box-row");
        [...list].forEach((item) => {
            const title = `${$(item).find("h1").find(".text-normal").text}/${
                $(item).find("h1").find("a").text
            }`;
            const href = $(item).find("h1").find("a").attr("href");
            const desc = $(item).find("p").text();
            const starCount = $(item).find("a")[1].text;
            const data = {
                title,
                href,
                desc,
                starCount
            };
            result.push(data);
        });
        //将爬取的数据返回出去
        return result;
    });

    //5. 关闭浏览器
    await browser.close();

    //最终会将数据全部返回出去
    return result;
};

function timeout() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

// init();
