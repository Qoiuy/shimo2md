/**
 * Created by 2 on 2017/6/12.
 */

setTimeout(run, 4000);

let md = "";
let isMore = false;
function run() {
    console.log("run");
    addHeader();
    let start = $(":contains('稿件正文')")[14];
    while (start.nextElementSibling !== null) {
        start = start.nextElementSibling;

        checkTitle(start);

    }
    console.log(md);
}

function addHeader() {
    let title = $($('#doc-title-input')[0]).attr('data-value');
    let [school, major] = headerUniverse();
    let [artist, graduate] = headerArtist();
    let date = headerVersion();
    md += `---
title: ${title}
date: ${date}
writer: ${artist}
tags:
    - ${school}
---\n`;
    md += `${artist} ${school} ${major} ${graduate}级\n`;

}

function headerVersion() {
    let writer = $(":contains(定稿日期)");
    writer = writer[writer.length - 2];
    writer = writer.nextElementSibling;
    // let artist=writer.children[0].innerHTML;
    // let date = writer.children[1].innerHTML;
    return writer.children[1].innerHTML;
}

function headerArtist() {
    let writer = $(":contains(六中毕业年份)");
    writer = writer[writer.length - 2];
    writer = writer.nextElementSibling;
    let artist = writer.children[0].innerHTML;
    let graduate = writer.children[2].innerHTML;
    return [artist, graduate];
}

//获取就读学校与专业、所获学位表格的信息
function headerUniverse() {
    let table = $(":contains(学业阶段)");
    table = table[table.length - 2];
    table = table.nextElementSibling;
    let school = table.children[1].innerHTML;
    let major = table.children[2].innerHTML;
    return [school, major];
}

function checkTitle(current) {
    if (!isMore && md.length > 250) {
        md += "<!-- more -->\n";
        isMore = true;
    }

    md += isTextIndent(current);
    if (current.className != undefined && current.className.indexOf("heading-2") != -1) {
        //中标题
        md += "\n## ";
        md += outerTranslate(current.children, true, true);
    } else if (current.className != undefined && current.className.indexOf("heading-1") != -1) {
        //小标题
        md += "\n### ";
        md += outerTranslate(current.children, true, true);
    } else {
        //非标题
        md += outerTranslate(current.children, true, false);
    }


}

function outerTranslate(current, enter, isTitle) {
    let md = "";
    let length = current.length;
    for (let i = 0; i < length; i++) {

        switch (current[i].tagName) {
            case "BR": {
                md += "\n";
                break;
            }
            case "INHERIT": {
                md += outerTranslate(current[i].children, false, isTitle);
                break;
            }
            case "SPAN":
            case "FONT":
            case "LI": {
                if (current[i].children.length > 0) {
                    md += outerTranslate(current[i].children, false, isTitle)
                }

                //加粗的情况
                else if (current[i].className.indexOf(" b") != -1) {
                    md += isBold(current[i].innerHTML);
                } else {
                    md += replaceNbsp(current[i].innerHTML);
                }
                break;
            }
            case "OL":{
                if (isTitle === false) {
                    md += "1. ";
                }
                md += outerTranslate($(current[i].children), false, isTitle);
                break;
            }
            case "UL": {
                if (isTitle === false) {
                    md += "* ";
                }
                md += outerTranslate($(current[i].children), false, isTitle);
            }
                break;
            case "B": {
                md += "** ";
                md += replaceNbsp(current[i].innerHTML);
                md += "** ";
            }
                break;
            case "HR": {
                md += "\n------------\n";
                break;
            }
            case "A": {
                md += `[${current[i].innerText}](${current[i].href})`;
                break;
            }
            case "IMG":{
                md +=`![](${current[i].src})`;
                break;
            }
            case "U":{
                md+=`<u>${replaceNbsp(current[i].innerHTML)}</u>`
            }

        }
    }

    if (enter === true) {
        md += "\n";
    }
    // console.log(md.length);
    return md;
}


function isBold(innerhtml) {

    innertext = replaceNbsp($(innerhtml)[0].innerHTML);
    let temp = " **";
    temp += innertext;
    temp += "** ";
    return temp;
}


function isTextIndent(current) {
    if (current.className.indexOf("text-indent") != -1) {
        return "　　";
    }
    return "";
}

function replaceAll(str, oldStrRegex, newStr) {
    if (str !== null) {
        str = str.replace(oldStrRegex, newStr)
    }
    return str
}

function replaceNbsp(str) {
    return replaceAll(replaceAll(str, /&nbsp;&nbsp;&nbsp;/g, '　'), /&nbsp;/g, ' ');
}