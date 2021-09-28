function pre() {
    var defaultConfig = {
        detailsViewConfig: "eval(fetch(getVar('qdb_file')));detailsView(type, id);"
    }

    let file = "hiker://files/rules/joker/qdb_config.js";
    if (!fetch(file)) {
        writeFile(file, JSON.stringify(defaultConfig));
    }
    putVar({
        key: "qdb_config",
        value: file
    });
}

function home() {
    let d = [];
    d.push({
        title: '',
        img: 'https://gitee.com/Joker_tx/hiker/raw/master/img/豆瓣.png',
        desc: '0',
        col_type: 'card_pic_1',
        url: $('hiker://empty#noHistory')
            .rule(() => {
            let d = [];
            d.push({
                title: '点我更新依赖',
                desc: '没事别总更新',
                col_type: 'text_center_1',
                url: $('hiker://empty')
                    .lazyRule(() => {
                    let file = "hiker://files/rules/joker/qdb.js";
                    //let gitfile = 'https://gitee.com/Joker_tx/hiker/raw/master/qdb.js';
                    let gitfile = 'http://hiker.nokia.press/hikerule/rulelist.json?id=1564';
                    writeFile(file, fetch(gitfile));
                    refreshPage();
                    return 'toast://依赖文件更新成功'
                })
            })
            let c = JSON.parse(fetch(getVar('qdb_config')))
                .detailsViewConfig;
            d.push({
                title: '自定义影片详情页面',
                desc: '小白勿触',
                col_type: 'text_center_1',
                url: $(c, '先eval（）你的文件' + '\n' + '再调用你写的详情页面函数' + '\n' + '(函数的传入参数为影片type和id)')
                    .input(() => {
                    let config = JSON.parse(fetch(getVar('qdb_config')));
                    config.detailsViewConfig = input;
                    writeFile(getVar('qdb_config'), JSON.stringify(config));
                    refreshPage();
                    return "toast://设置更改已保存";
                })
            })
            d.push({
                title: '恢复默认设置',
                desc: '重生',
                col_type: 'text_center_1',
                url: $("")
                    .lazyRule(() => {
                    let defaultConfig = {
                        detailsViewConfig: "eval(fetch(getVar('qdb_file')));detailsView(type, id);"
                    }
                    writeFile(getVar('qdb_config'), JSON.stringify(defaultConfig));
                    refreshPage();
                    return "toast://已恢复默认设置";
                })
            })
            setResult(d);
        })
    })

    let s = ["找影视", "热门", "分类", "片单", "榜单", "将上映"];
    let img = "https://gitee.com/Joker_tx/hiker/raw/master/img/";
    for (let i in s) {
        d.push({
            title: s[i],
            img: img + s[i] + '.jpg',
            col_type: 'icon_2',
            url: MY_URL + '$page{fypage}/#/' + s[i] + "#noHistory#"
        })
    }
    setResult(d);
}

function search() {
    let wd = MY_URL.split("/#/")[1];
    let page = getPage();
    let pageObj = getDoubanRes('https://frodo.douban.com/api/v2/search/subjects?q=' + wd + (page ? '&start=' + (page - 1) * 20 : '&start=0') + '&count=20');

    let list = pageObj.items;
    let items = list.map(data => ({
        title: data.target.title,
        img: data.target.cover_url + "@Referer=" + data.target.cover_url,
        desc: data.type_name,
        content: data.target.card_subtitle,
        url: $('hiker://empty')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [data.target_type, data.target.id])
    }));

    setSearchResult({
        data: items
    });
}

function erji() {
    let choice = MY_URL.split('/#/')[1].split('#')[0];
    switch (choice) {
        case "找影视":
            eval(fetch(getVar("qdb_file")));
            findList(getPage(), 8);
            break;
        case "热门":
            eval(fetch(getVar("qdb_file")));
            hotList(getPage(), 20);
            break;
        case "分类":
            eval(fetch(getVar("qdb_file")));
            classList(getPage(), 30);
            break;
        case "片单":
            eval(fetch(getVar("qdb_file")));
            playList(getPage(), 15);
            break;
        case "榜单":
            eval(fetch(getVar("qdb_file")));
            subjectCollectionList(getPage(), 10);
            break;
        case "将上映":
            eval(fetch(getVar("qdb_file")));
            comingList(getPage(), 10);
            break;
        default:
            eval(fetch(getVar("qdb_file")));
            subjectCollectionList();
            break;
    }
}

function getDoubanRes(url) {
    if (url.indexOf('apikey') == -1) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + "apikey=0dad551ec0f84ed02907ff5c42e8ec70"
    }
    let s = fetch(url, {
        headers: {
            "User-Agent": "Rexxar-Core/0.1.3 api-client/1 com.douban.frodo/7.9.0.beta2(215) Android/25 product/TAS-AL00 vendor/HUAWEI model/TAS-AL00  rom/android  network/wifi  platform/mobile com.douban.frodo/7.9.0.beta2(215) Rexxar/1.2.151  platform/mobile 1.2.151"
        },
        method: 'POST'
        //body: 'host=frodo.douban.com&accept=*/*'
    });
    return JSON.parse(s);
}
//"Authorization": "Bearer 18a7c2ea80b2154049f748bf82163fc0"
//"User-Agent":"Rexxar-Core/0.1.3 api-client/1 com.douban.frodo/7.9.0.beta2(215) Android/25 product/TAS-AL00 vendor/HUAWEI model/TAS-AL00  rom/android  network/wifi  udid/59ee7ab3fc379199a62a83c35abdf80675ddb67e  platform/mobile com.douban.frodo/7.9.0.beta2(215) Rexxar/1.2.151  platform/mobile 1.2.151"
//"User-Agent":"Rexxar-Core/0.1.3 api-client/1 com.douban.frodo/6.36.0(186) Android/23 product/cancro vendor/HUAWEI model/Mate 10 rom/android network/wifi platform/mobile com.douban.frodo/6.36.0(186) Rexxar/1.2.151 platform/mobile 1.2.151"
//"User-Agent":"api-client/1 com.douban.frodo/6.36.0(186) Android/23 product/cancro vendor/HUAWEI model/Mate 10 rom/android network/wifi platform/mobile"
//"User-Agent": "api-client/1 com.douban.frodo/6.44.0(196)"

function getPage() {
    var t = new RegExp("\\$page\\{(.*?)\\}");
    return MY_URL.match(t)[1]
}

function getDetails(type, id) {
    let config = JSON.parse(fetch(getVar('qdb_config')));
    eval(config.detailsViewConfig);
}

function computeRating(e, t) { //评分星星
    let i = "";
    for (let r = 0; r < 5; r++) r < Math.round(t / (e / 5)) ? i += "★" : i += "☆";
    return i
}

function rating(type, id) { //评分+详情页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/rating");
    let r = "<h2>评分统计</h2>";
    i.stats.reverse()
        .forEach(((value, index) => {
        r += '<font color="#7c7a7b">' + ["★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"][index] + "</font>&nbsp;" + function(e) {
            let t = '<font color="#ffac2d">';
            for (let i = 0; i < e; i++) t += "▇";
            if (t += "</font>", 10 != e) {
                t += '<font color="#e5e1e4">';
                for (let i = 0; i < 10 - e; i++) t += "▇";
                t += "</font>"
            }
            return t
        }((10 * value)
            .toFixed(0)) + '&nbsp;<small><font color="grey">' + (100 * value)
            .toFixed(1) + "%</font></small><br/>"
    }));
    r += '<small><font color="grey">' + [i.done_count ? i.done_count + "人看过" : "", i.doing_count ? i.doing_count + "人在看" : "", i.wish_count ? i.wish_count + "人想看" : ""].join("&nbsp;&nbsp;") + "</font></small>";

    i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/desc");
    let l = i.html.replace(/[\n\t\r]/g, "")
        .replace(/<td\s*[^>]*>(.*?)<\/td>/g, "<span>$1</span>")
        .replace(/<tr\s*[^>]*>(.*?)<\/tr>/g, "<teng>$1</teng><br/>");
    parseDomForArray(l, "section&&teng")
        .forEach((e => {
        let t = parseDomForArray(e, "span");
        l = l.replace(t[0], '<font color="grey">' + t[0].replace(/<span\s*[^>]*>(.*?)<\/span>/g, "$1") + "：</font>")
    }));
    r += l;

    setHomeResult({
        data: [{
            title: r,
            col_type: "rich_text"
        }]
    })
}

function stillsList(type, id) { //剧照页面
    let page = getPage();
    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/photos?start=" + 30 * (page - 1) + "&count=30");
    let l = r.photos.map((e => ({
        title: e.create_time,
        img: e.image.small.url + "@Referer=" + e.image.small.url,
        url: e.image.large.url + "?type=.jpg@Referer=" + e.image.large.url + "?type=.jpg",
        col_type: "pic_2"
    })));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        l.unshift({
            title: "<big>共<strong> " + r.total + ' </strong>张剧照</big><br/><small><font color="grey">官方剧照：' + r.o + "张&nbsp;截图：" + r.c + "张&nbsp;工作照：" + r.w + "张&nbsp;新闻图片：" + r.n + "张&nbsp;粉丝图片：" + r.f + "张</font></small>",
            col_type: "rich_text"
        })
    }
    setHomeResult({
        data: l
    })
}

function credits(type, id) { //演职人员页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/credits");
    let r = [];
    i.credits.forEach((e => {
        r.push({
            title: e.title,
            col_type: "rich_text"
        });
        e.celebrities.forEach((e => {
            r.push({
                title: e.name + "\n" + e.latin_name,
                desc: e.character,
                img: e.cover_url + "@Referer=" + e.cover_url,
                url: $('hiker://empty/#/$page{fypage}')
                    .rule((e) => {
                    eval(fetch(getVar("qdb_file")));
                    elessarWorks(e.uri.split("subject_id=")[1]);
                }, e)
            })
        }))
    }));
    setHomeResult({
        data: r
    })
}

function shortCommentList(type, id) { //短评页面
    let page = getPage();
    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/interests?start=" + 30 * (page - 1) + "&count=30");
    let l = [];
    r.interests.forEach((e => {
        let t = "";
        if (e.rating) {
            t = computeRating(e.rating.max, e.rating.value);
        }
        l.push({
            title: e.user.name,
            img: e.user.avatar,
            url: e.user.url,
            col_type: "avatar"
        });
        l.push({
            title: e.comment + (t ? '<br/><small>看过 <font color="#ffac2d">' + t + "</font></small>" : "") + '<br/><small><font color="grey">' + e.vote_count + "赞•" + /\d{4}-\d{1,2}-\d{1,2}/g.exec(e.create_time) + "</font></small>",
            col_type: "rich_text"
        });
        l.push({
            col_type: "line"
        })
    }));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        l.unshift({
            title: "<big>共<strong> " + r.total + " </strong>条短评</big>",
            col_type: "rich_text"
        });
    }
    setHomeResult({
        data: l
    })
}

function dramaReviewList(type, id) { //剧评页面
    let page = getPage()
    let r = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/reviews?start=" + 15 * (page - 1) + "&count=15");
    let l = [];
    r.reviews.forEach((e => {
        let t = "";
        if (e.rating) {
            t = computeRating(e.rating.max, e.rating.value);
        }
        let i = e.comments_count ? e.comments_count + "回复" : "",
        r = e.useful_count ? e.useful_count + "有用" : "",
        o = e.reshares_count ? e.reshares_count + "转发" : "";

        r = i && r ? "•" + r : r;
        o = (i || r) && o ? "•" + o : o;
        l.push({
            title: e.user.name,
            img: e.user.avatar,
            url: e.user.url,
            col_type: "avatar"
        })
        l.push({
            title: "<strong>" + e.title + "</strong><br/>" + e.abstract + '   <small>(<a href="hiker://empty@rule=js:eval(fetch(getVar(`qdb_file`)));dramaReviewView(' + e.id + ')">更多</a>)</small>' + (t ? '<br/><small>看过 <font color="#ffac2d">' + t + "</font></small>" : "") + '<br/><small><font color="grey">' + i + r + o + "</font></small>",
            col_type: "rich_text"
        })
        l.push({
            col_type: "line"
        })
    }));

    if (page == 1) {
        l.unshift({
            col_type: "blank_block"
        });
        l.unshift({
            title: "<big>共<strong> " + r.total + " </strong>条剧评</big>",
            col_type: "rich_text"
        });
    }
    setHomeResult({
        data: l
    })
}

function trailers(type, id) { //预告片页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/trailers")
        .trailers;
    i.forEach((e => {
        e.col_type = "movie_2", e.desc = e.subject_title + "•" + e.create_time, e.img = e.cover_url, e.url = e.video_url
    }));

    let r = i.filter((e => "A" == e.type));
    let l = i.filter((e => "B" == e.type));
    let o = i.filter((e => "C" == e.type));

    if (r.length > 0) {
        r.unshift({
            title: "预告",
            col_type: "rich_text"
        })
    }
    if (l.length > 0) {
        l.unshift({
            title: "片段",
            col_type: "rich_text"
        })
    }
    if (o.length > 0) {
        o.unshift({
            title: "花絮",
            col_type: "rich_text"
        })
    }

    setHomeResult({
        data: r.concat(l)
            .concat(o)
    })
}

function videoComment(type, id) { //视频评论页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id + "/videos")
        .videos;
    i.forEach((e => {
        e.col_type = "movie_2", e.desc = e.author.name + "•" + e.create_time, e.img = e.cover_url + "@Referer=" + e.cover_url, e.url = e.video_url
    }))
    if (i.length > 0) {
        i.unshift({
            title: "视频评论",
            col_type: "rich_text"
        })
    }
    setHomeResult({
        data: i
    })
}

function elessarWorks(id) { //演职人员详情页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/elessar/subject/" + id);
    let t = "", r = "";
    i.modules.forEach((e => {
        if (e.type == "work_collections") {
            t = e.payload.id;
            r = e.payload.collections[0].title;
        }
    }))
    i = getDoubanRes("https://frodo.douban.com/api/v2/elessar/work_collections/" + t + "/works?start=" + 30 * (getPage() - 1) + "&count=30&collection_title=" + r);

    let l = [];
    i.works.forEach((e => {
        let t = "";
        if (e.subject.extra.rating_group.rating) {
            t = computeRating(e.subject.extra.rating_group.rating.max, e.subject.extra.rating_group.rating.value) + " " + e.subject.extra.rating_group.rating.value + "分";
        }
        l.push({
            title: e.subject.title,
            img: e.subject.cover.normal.url + "@Referer=" + e.subject.cover.normal.url,
            desc: e.roles.join("•") + "\n" + t,
            url: $('hiker://empty')
                .rule((t) => {
                eval(fetch(getVar('qdb_file')));
                getDetails(t[0], t[1]);
            }, [e.subject.subtype, e.subject.id])
        })
    }))

    if (getPage() == 1) {
        l.unshift({
            col_type: "blank_block"
        })
        l.unshift({
            title: "<big>共<strong> " + i.total + " </strong>部作品</big>",
            col_type: "rich_text"
        })
    }
    setHomeResult({
        data: l
    })
}

function dramaReviewView(id) { //剧评更多页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/review/" + id);

    i.photos.forEach((e => {
        i.content = i.content.replace('id="' + e.tag_name + '"', 'src="' + e.image.large.url + "@Referer=" + e.image.large.url + '"')
    }));

    let l = getDoubanRes("https://frodo.douban.com/api/v2/review/" + id + "/comments");
    let o = [{
        col_type: "blank_block"
    }, {
        title: "<big><strong>评论：</strong></big>",
        col_type: "rich_text"
    }];

    l.comments.length > 0 ? l.comments.forEach((e => {
        o.push({
            title: e.author.name,
            img: e.author.avatar,
            url: e.author.url,
            col_type: "avatar"
        })
        o.push({
            title: e.text + (e.replies.length > 0 ? ' <small><a href="hiker://empty@rule=js:eval(fetch(getVar(`qdb_file`)));dramaReviewReplyView(' + e.id + ');">[查看回复]</a></small>' : ""),
            col_type: "rich_text"
        })
        o.push({
            col_type: "line"
        })
    })) : o.push({
        title: '<font color="grey">( •̥́ ˍ •̀ू )还没有人评论...</font>',
        col_type: "rich_text"
    });

    let a = "";
    if (i.rating) {
        a = computeRating(i.rating.max, i.rating.value);
    }

    let s = [{
        title: "<big><strong>" + i.title + "</strong></big>",
        col_type: "rich_text"
    }, {
        title: i.user.name + " 的剧评",
        img: i.user.avatar,
        url: i.user.url,
        col_type: "avatar"
    }, {
        title: (i.spoiler ? "<code><em>这篇影评可能有剧透</em></code><br/>" : "") + (a ? '<small>看过 <font color="#ffac2d">' + a + "</font><br/></small>" : "") + '<small><font color="grey">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(i.create_time) + "</font></small>",
        col_type: "rich_text"
    }, {
        col_type: "line_blank"
    }, {
        title: i.content.replace(/<div\s*[^>]*>(.*?)<\/div>/g, "$1") + (i.is_original ? '<small><font color="grey">&copy;本文版权归该作者所有，任何形式转载请联系作者。</font></small>' : ""),
        col_type: "rich_text"
    }];

    setHomeResult({
        data: s.concat(o)
    })
}

function dramaReviewReplyView(id) { //剧评更多回复页面
    let t = getDoubanRes("https://frodo.douban.com/api/v2/review/comment/" + id + "/replies");
    let i = [];
    t.replies.forEach((e => {
        i.push({
            title: e.author.name,
            img: e.author.avatar,
            url: e.author.url,
            col_type: "avatar"
        })
        i.push({
            title: (e.ref_comment.has_ref ? '回复@<font color="blue">' + e.ref_comment.author.name + "</font>：" : "") + e.text,
            col_type: "rich_text"
        })
        i.push({
            col_type: "line"
        })
    }))

    setHomeResult({
        data: i
    })
}

function detailsView(type, id) { //影片详情页面
    let i = getDoubanRes("https://frodo.douban.com/api/v2/" + type + "/" + id);

    let info = "";
    if (i.is_tv) {
        info = [i.countries ? i.countries.join(" ") : null, i.genres ? i.genres.join(" ") : null, i.pubdate ? i.pubdate[0] + "首播" : null, i.episodes_count ? "共" + i.episodes_count + "集" : null, i.durations ? "单集片长" + i.durations : null].filter((e => null !== e))
            .join(" / ");
    } else {
        info = [i.countries ? i.countries.join(" ") : null, i.genres ? i.genres.join(" ") : null, i.pubdate ? i.pubdate[0] + "首播" : null, i.durations ? "片长" + i.durations : null].filter((e => null !== e))
            .join(" / ");
    }
    let infoItems = [{
        title: i.title + "\n" + i.original_title + "(" + i.year + ")",
        url: "hiker://search?s=" + i.title,
        desc: info || i.card_subtitle,
        img: i.pic.normal + "@Referer=" + i.pic.normal,
        col_type: "movie_1_vertical_pic"
    }];

    let rating = "";
    if (i.rating) {
        rating = computeRating(i.rating.max, i.rating.value);
    };
    let ratingItems = [];
    if (rating) {
        ratingItems = [{
            title: '““””<strong>豆瓣评分™</strong><br/><font color="#ffac2d">' + rating + "</font>&nbsp;&nbsp;<strong><big>" + i.rating.value.toFixed(1) + "分</big></strong>",
            col_type: "text_center_1",
            url: $('hiker://empty')
                .rule((t) => {
                eval(fetch(getVar("qdb_file")));
                rating(t[0], t[1]);
            }, [i.subtype, i.id])
        }];
    };

    let relatedItems = [{
        title: "剧照",
        img: "https://cdn.jsdelivr.net/gh/Lingyan000/pic@master/img/20201119220332.png",
        url: $('hiker://empty/#/$page{fypage}')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            stillsList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "演职",
        img: "https://cdn.jsdelivr.net/gh/Lingyan000/pic@master/img/20201119221134.png",
        url: $('hiker://empty/#/$page{fypage}')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            credits(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "短评",
        img: "https://cdn.jsdelivr.net/gh/Lingyan000/pic@master/img/20201119220839.png",
        url: $('hiker://empty/#/$page{fypage}')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            shortCommentList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }, {
        title: "剧评",
        img: "https://cdn.jsdelivr.net/gh/Lingyan000/pic@master/img/20201119220645.png",
        url: $('hiker://empty/#/$page{fypage}')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            dramaReviewList(t[0], t[1]);
        }, [i.subtype, i.id]),
        col_type: "icon_round_small_4"
    }];

    let introItems = [{
        title: "<big><strong>剧情简介：</strong></big>",
        col_type: "rich_text"
    }, {
        title: i.intro.replace(/\n/g, "<br/>")
            .replace(/\s/g, " ")
            .replace(/\t/g, " "),
        col_type: "rich_text"
    }];

    let videoRelatedItems = [];
    if (i.trailer) {
        videoRelatedItems.push({
            title: "<big><strong>预告：</strong></big>",
            col_type: "rich_text"
        });
        videoRelatedItems.push({
            title: i.trailer.title,
            img: i.trailer.cover_url,
            url: i.trailer.video_url,
            desc: i.trailer.subject_title + "•" + i.trailer.create_time,
            col_type: "movie_2"
        });
        videoRelatedItems.push({
            img: "https://cdn.jsdelivr.net/gh/Lingyan000/photos/img/20201104163813.gif",
            col_type: "movie_2",
            url: $('hiker://empty/#/$page{fypage}')
                .rule((t) => {
                eval(fetch(getVar("qdb_file")));
                trailers(t[0], t[1]);
            }, [i.subtype, i.id]),
        });
    }
    if (i.video) {
        videoRelatedItems.push({
            title: "<big><strong>视频评论：</strong></big>",
            col_type: "rich_text"
        });
        videoRelatedItems.push({
            title: i.video.title,
            img: i.video.cover_url + "@Referer=" + i.video.cover_url,
            url: i.video.video_url,
            desc: i.video.author.name + "•" + i.video.create_time,
            col_type: "movie_2"
        });
        videoRelatedItems.push({
            img: "https://cdn.jsdelivr.net/gh/Lingyan000/photos/img/20201104163813.gif",
            col_type: "movie_2",
            url: $('hiker://empty/#/$page{fypage}')
                .rule((t) => {
                eval(fetch(getVar("qdb_file")));
                videoComment(t[0], t[1]);
            }, [i.subtype, i.id]),
        });
    };

    let videoItems = i.vendors.map((e => ({
        title: e.title + (e.episodes_info ? "•" + e.episodes_info : ""),
        img: e.icon,
        url: e.url,
        col_type: "avatar"
    })));
    if (videoItems.length > 0) {
        videoItems.unshift({
            title: "<big><strong>在线观看：</strong></big>",
            col_type: "rich_text"
        });
    };

    setHomeResult({
        data: infoItems.concat(ratingItems)
            .concat(relatedItems)
            .concat([{
            col_type: "line_blank"
        }])
            .concat(videoItems)
            .concat(videoRelatedItems)
            .concat(introItems)
    })
}

function findList(page, count) { //找影视
    let a = [];
    a.push({
        title: '电影',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("find","movie");refreshPage();"hiker://empty"'
    })
    a.push({
        title: '电视剧',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("find","tv");refreshPage();"hiker://empty"'
    })

    let u = getVar('find', 'movie');
    let url = "https://frodo.douban.com/api/v2/" + u + "/recommend?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=8");
    let l = getDoubanRes(url)
    let m = l.items.filter(e => e.type !== "ad" && e.type !== "tags");
    let i = m.map((e => ({
        title: e.subtitle || e.title + "（" + e.year + "）",
        url: $('hiker://empty/$page{fypage}#noHistory#')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            if (t[0] == "playlist") {
                douList(t[1], getPage(), 10);
            } else {
                getDetails(t[0], t[1]);
            }
        }, [e.type, e.id]),
        img: e.pic ? e.pic.normal + "@Referer=" + e.pic.normal : e.cover_url + "@Referer=" + e.cover_url,
        desc: e.type != "playlist" ? (e.tags.map((e => e.name))
            .join(",") + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")) : (e.title + "\n" + e.tags.join(",") + "\n共" + e.items_count + "部")
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

function hotList(page, count) { //热门
    let a = [];
    a.push({
        title: '电影',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("hot","movie");refreshPage();"hiker://empty"'
    })
    a.push({
        title: '电视剧',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("hot","tv");refreshPage();"hiker://empty"'
    })

    let u = getVar('hot', 'movie');
    let s = "", l = "";
    if (u == 'movie') {
        s = getDoubanRes("https://frodo.douban.com/api/v2/movie/hot_gaia" + (page ? "?start=" + (page - 1) * (count || 30) + "&count=" + (count || 30) : ""));
        l = s.items;
    } else {
        s = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/tv_hot/items" + (page ? "?start=" + (page - 1) * (count || 30) + "&count=" + (count || 30) : ""));
        l = s.subject_collection_items;
    }
    let i = l.map((e => ({
        title: e.title + "（" + e.year + "）",
        url: $('hiker://empty#noHistory#')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [e.type, e.id]),
        img: e.pic.normal + "@Referer=" + e.pic.normal,
        desc: e.tags.map((e => e.name))
            .join(",") + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

function classList(page, count) {
    let items = {
        subtype: ["全部形式", "电影", "电视剧", "综艺", "动漫", "纪录片", "短片"],
        local: ["全部地区", "中国大陆", "美国", "中国香港", "中国台湾", "日本", "韩国", "英国", "法国", "德国", "意大利", "西班牙", "印度", "泰国", "俄罗斯", "伊朗", "加拿大", "澳大利亚", "爱尔兰", "瑞典", "巴西", "丹麦"],
        type: ["全部类型", "剧情", "喜剧", "动作", "爱情", "科幻", "动画", "悬疑", "惊悚", "恐怖", "犯罪", "同性", "音乐", "歌舞", "传记", "历史", "战争", "西部", "奇幻", "冒险", "灾难", "武侠", "情色"],
        year: ["全部年代", "2021", "2020", "2019", "2010年代", "2000年代", "90年代", "80年代", "70年代", "60年代", "更早"],
        class: ["全部特色", "经典", "青春", "文艺", "搞笑", "励志", "魔幻", "感人", "女性", "黑帮", "治愈", "美食", "宗教", "小说改编", "超级英雄"]
    }
    let rank = {默认排序: "U",
        热度: "T",
        评分: "S",
        时间: "R"
    }
    let temp = JSON.parse(getVar('classlist', '{"subtype":"","local":"","year":"","class":"","rank":"U","type":""}'));
    let a = [];
    for (item in items) {
        for (let i = 0; i < items[item].length; i++) {
            a.push({
                title: items[item][i],
                col_type: 'scroll_button',
                url: $('hiker://empty')
                    .lazyRule((e) => {
                    let temp = JSON.parse(getVar('classlist', '{"subtype":"","local":"","year":"","class":"","rank":"U","type":""}'));
                    temp[e[1]] = e[0].indexOf("全部") != -1 ? "" : e[0];
                    putVar("classlist", JSON.stringify(temp));
                    refreshPage();
                    return 'hiker://empty'
                }, [items[item][i], item])
            })
        }
        a.push({
            col_type: 'blank_block'
        })
    }
    for (r in rank) {
        a.push({
            title: r,
            col_type: 'scroll_button',
            url: $('hiker: //empty')
                .lazyRule((e) => {
                let temp = JSON.parse(getVar('classlist', '{"subtype":"","local":"","year":"","class":"","rank":"U","type":""}'));
                temp.rank = e;
                putVar("classlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, rank[r])
        })
    }

    let url = "https://frodo.douban.com/api/v2/movie/tag?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=30") + "&q=" + temp.subtype + "," + temp.local + "," + temp.type + "," + temp.year + "," + temp.class + "&sort=" + temp.rank + "&score_range=0,10";
    let l = getDoubanRes(url);
    let i = l.data.map((e => ({
        title: e.title,
        col_type: 'movie_3',
        url: $('hiker://empty#noHistory#')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [e.type, e.id]),
        img: e.cover_url + "@Referer=" + e.cover_url,
        desc: e.null_rating_reason || e.rating.value
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

function playList(page, count) {
    let items = {全部: "all",
        片单: "official",
        精选: "selected",
        经典: "classical",
        获奖: "prize",
        高分: "high_score",
        榜单: "movie_list",
        冷门佳片: "dark_horse",
        主题: "topic",
        导演: "director",
        演员: "actor",
        系列: "series",
        华语: "chinese",
        欧美: "western",
        日本: "japanese",
        韩国: "korea",
        喜剧: "comedy",
        动作: "action",
        爱情: "love",
        科幻: "science_fiction",
        动画: "cartoon",
        悬疑: "mystery",
        惊悚: "panic",
        恐怖: "horrible",
        犯罪: "criminal",
        同性: "lgbt",
        战争: "war",
        奇幻: "fantasy",
        情色: "erotica",
        音乐: "music",
        纪录片: "documentary",
        治愈: "cure",
        艺术: "art",
        黑色幽默: "dark_humor",
        青春: "youth",
        女性: "female",
        真实事件改编: "real_event",
        暴战争: "violence",
        黑白: "black_white",
        美食: "food",
        旅行: "travel",
        惊悚童: "child",
        人性: "humanity",
        家庭: "family",
        文艺: "literary_art",
        小说改编: "novel",
        感人: "moving",
        励志: "inspiration"
    }
    let subtype = {全部: "",
        电影: "movie",
        电视剧: "tv"
    }
    let temp = JSON.parse(getVar('playlist', '{"subtype":"","type":"all"}'));
    let a = [];
    for (i in items) {
        a.push({
            title: i,
            col_type: 'scroll_button',
            url: $('hiker://empty')
                .lazyRule((t) => {
                let temp = JSON.parse(getVar('playlist', '{"subtype":"","type":"all"}'));
                temp.type = t;
                putVar("playlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, items[i])
        })
    }
    a.push({
        col_type: "blank_block"
    });
    for (i in subtype) {
        a.push({
            title: i,
            col_type: 'scroll_button',
            url: $('hiker: //empty')
                .lazyRule((t) => {
                let temp = JSON.parse(getVar('playlist', '{"subtype":"","type":"all"}'));
                temp.subtype = t;
                putVar("playlist", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, subtype[i])
        })
    }

    let url = "https://frodo.douban.com/api/v2/skynet/new_playlists?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=10") + "&category=" + temp.type + "&subject_type=" + temp.subtype;
    let l = getDoubanRes(url);
    let i = l.data[0].items.map((e => ({
        title: e.title,
        url: $('hiker://empty/$page{fypage}#noHistory#')
            .rule((t) => {
            eval(fetch(getVar("qdb_file")));
            if (t[0] == "playlist") {
                douList(t[1], getPage(), 10);
            } else {
                subjectCollectionList(getPage(), 10, t[1]);
            }
        }, [e.type, e.id]),
        img: e.cover_url + "@Referer=" + e.cover_url,
        desc: "共" + e.items_count + "部"
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

function subjectCollectionList(page, count, id) { //榜单
    let a = [];
    a.push({
        title: '电影',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("ranking","movie_real_time_hotest");refreshPage();"hiker://empty"'
    })
    a.push({
        title: '电视剧',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("ranking","tv_real_time_hotest");refreshPage();"hiker://empty"'
    })
    a.push({
        title: '口碑',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("ranking","movie_weekly_best");refreshPage();"hiker://empty"'
    })
    a.push({
        title: 'top-250',
        col_type: 'scroll_button',
        url: 'hiker://empty@lazyRule=.js:putVar("ranking","movie_top250");refreshPage();"hiker://empty"'
    })

    let e = id || getVar('ranking', 'movie_real_time_hotest');
    let t = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/" + e);
    let i = [{
        title: t.title,
        desc: t.description,
        img: t.header_bg_image + "@Referer=" + t.header_bg_image,
        url: t.header_bg_image + "?type=.jpg@Referer=" + t.header_bg_image + "?type=.jpg",
        col_type: "text_1"
    }]

    let s = getDoubanRes("https://frodo.douban.com/api/v2/subject_collection/" + e + "/items?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=10"));
    let r = s.subject_collection_items.map((e => ({
        title: e.title,
        url: $('hiker://empty#noHistory#')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [e.type, e.id]),
        img: e.pic.normal + "@Referer=" + e.pic.normal,
        desc: e.card_subtitle.split("/")
            .filter(((e, t) => {
            if (t < 3) return e
        }))
            .join(",") + "\n" + (e.rating ? computeRating(e.rating.max, e.rating.value) + " " + e.rating.value.toFixed(1) + "分" : "暂无评分")
    })));

    setHomeResult({
        data: page > 1 ? r : (id ? i.concat(r) : a.concat(i)
            .concat(r))
    })
}

function comingList(page, count) { //将上映
    let temp = JSON.parse(getVar('coming', '{"type":"movie","rank":"","local":""}'));
    let a = [];
    a.push({
        title: '电影',
        col_type: 'scroll_button',
        url: $('hiker://empty')
            .lazyRule((temp) => {
            temp.type = "movie";
            putVar("coming", JSON.stringify(temp));
            refreshPage();
            return 'hiker://empty'
        }, temp)
    })
    a.push({
        title: '电视剧',
        col_type: 'scroll_button',
        url: $('hiker://empty')
            .lazyRule((temp) => {
            temp.type = "tv";
            putVar("coming", JSON.stringify(temp));
            refreshPage();
            return 'hiker://empty'
        }, temp)
    })
    a.push({
        col_type: "blank_block"
    })
    a.push({
        title: '时间',
        col_type: 'scroll_button',
        url: $('hiker://empty')
            .lazyRule((temp) => {
            temp.rank = "";
            putVar("coming", JSON.stringify(temp));
            refreshPage();
            return 'hiker://empty'
        }, temp)
    })
    a.push({
        title: '热度',
        col_type: 'scroll_button',
        url: $('hiker://empty')
            .lazyRule((temp) => {
            temp.rank = "&sortby=hot";
            putVar("coming", JSON.stringify(temp));
            refreshPage();
            return 'hiker://empty'
        }, temp)
    })

    if (temp.type == "movie") {
        a.push({
            col_type: "blank_block"
        })
        a.push({
            title: '国内',
            col_type: 'scroll_button',
            url: $('hiker://empty')
                .lazyRule((temp) => {
                temp.local = "";
                putVar("coming", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, temp)
        })
        a.push({
            title: '全球',
            col_type: 'scroll_button',
            url: $('hiker://empty')
                .lazyRule((temp) => {
                temp.local = "international";
                putVar("coming", JSON.stringify(temp));
                refreshPage();
                return 'hiker://empty'
            }, temp)
        })
    }

    let url = "https://frodo.douban.com/api/v2/" + temp.type + "/coming_soon?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=10") + temp.rank + "&area=" + temp.local;
    let l = getDoubanRes(url);
    let i = l.subjects.map((e => ({
        title: e.title + "（" + e.year + "）",
        url: $('hiker://empty#noHistory#')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [e.type, e.id]),
        img: e.cover_url + "@Referer=" + e.cover_url,
        desc: "上映日期:" + e.pubdate + "\n" + e.wish_count + "人想看" + "\n" + e.null_rating_reason
    })));

    setHomeResult({
        data: page > 1 ? i : a.concat(i)
    })
}

function douList(id, page, count) {
    let t = getDoubanRes("https://frodo.douban.com/api/v2/doulist/" + id);
    let i = [{
        title: t.title,
        desc: t.description,
        img: t.header_bg_image + "@Referer=" + t.header_bg_image,
        url: t.header_bg_image + "?type=.jpg@Referer=" + t.header_bg_image + "?type=.jpg",
        col_type: "text_1"
    }];

    let url = "https://frodo.douban.com/api/v2/doulist/" + id + "/posts?" + (page ? "start=" + (page - 1) * count + "&count=" + count : "start=0&count=20");
    let m = getDoubanRes(url);
    let r = m.items.map((e => ({
        title: e.content.subject.title,
        url: $('hiker://empty#noHistory#')
            .rule((t) => {
            eval(fetch(getVar('qdb_file')));
            getDetails(t[0], t[1]);
        }, [e.content.subject.type, e.content.subject.id]),
        img: e.content.subject.pic.normal + "@Referer=" + e.content.subject.pic.normal,
        desc: e.content.subject.card_subtitle.split("/")
            .filter(((e, t) => {
            if (t < 3) return e
        }))
            .join(",") + "\n" + (e.content.subject.rating ? computeRating(e.content.subject.rating.max, e.content.subject.rating.value) + " " + e.content.subject.rating.value.toFixed(1) + "分" : "暂无评分")
    })));

    setHomeResult({
        data: page > 1 ? r : i.concat(r)
    })
}