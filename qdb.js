function home() {
    let d = [];
    d.push({
        title: '很抱歉现在不在分享时间内,所以你只能看到这个页面',
        desc: '不过你可以点我尝试获取更新',
        col_type: 'text_center_1',
        url: $()
            .lazyRule(() => {
            let file = "hiker://files/rules/joker/qdb.js";
            let gitfile = 'http://hiker.nokia.press/hikerule/rulelist.json?id=1564';
            let gitfile2 = 'https://gitee.com/Joker_tx/hiker/raw/master/qdb.js';
            let text = fetch(gitfile);
            if (text.indexOf('无法查看') == -1) {
                writeFile(file, text);
                refreshPage();
                return 'toast://依赖文件更新成功,请尽情享用'
            } else {
                writeFile(file, fetch(gitfile2));
                refreshPage();
                return 'toast://不在分享时间内无法更新哦'
            }
        })
    })
    setResult(d);
}

function pre() {}