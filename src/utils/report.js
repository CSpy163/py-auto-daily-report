
/**
 * 用于获取融合单元格中，需要增加边框的单元格位置及样式。
 * @param {merge单元} 用于定位融合单元格 
 * @param {border样式} borderStyle border样式
 * @param {bool} onlyRB 是否只画右侧跟下面的边框
 * @returns 封装的对象
 */
function getMergeSelfBorder({ s, e }, borderStyle, onlyRB) {
    let obj = {};
    let sc = s.c;
    let ec = e.c;
    let sr = s.r;
    let er = e.r;

    // 同时画上下两个横线
    for (let i = sc; i <= ec; i++) {
        let colName = String.fromCharCode('A'.charCodeAt() + i);
        let topCellPosi = `${colName}${sr + 1}`
        if (!onlyRB) {
            if (obj[topCellPosi]) {
                obj[topCellPosi]['top'] = borderStyle;
            } else {
                obj[topCellPosi] = {
                    top: borderStyle
                }
            }
        }

        let bottomCellPosi = `${colName}${er + 1}`
        if (obj[bottomCellPosi]) {
            obj[bottomCellPosi]['bottom'] = borderStyle;
        } else {
            obj[bottomCellPosi] = {
                bottom: borderStyle
            }
        }
    }
    let startColName = String.fromCharCode('A'.charCodeAt() + sc);
    let endColName = String.fromCharCode('A'.charCodeAt() + ec);

    // 同时画左右两边的竖线
    for (let j = sr; j <= er; j++) {
        if (!onlyRB) {
            if (obj[`${startColName}${j + 1}`]) {
                obj[`${startColName}${j + 1}`]['left'] = borderStyle
            } else {
                obj[`${startColName}${j + 1}`] = {
                    left: borderStyle
                }
            }
        }
        if (obj[`${endColName}${j + 1}`]) {
            obj[`${endColName}${j + 1}`]['right'] = borderStyle
        } else {
            obj[`${endColName}${j + 1}`] = {
                right: borderStyle
            }
        }
    }
    return obj;
}

/**
 * 返回同行融合的 merge 对象数组
 * @param {数字} rowName row名称
 * @param {二维数组} colNamess col名称数组。包含列名，如[['A', 'B'], ['C', 'I']]
 */
function getMergeRowObjs(rowName, colNamess) {
    let mergeArray = []
    colNamess.forEach(colNames => {
        if (colNames.length == 2) {
            mergeArray.push({
                s: {
                    r: rowName - 1,
                    c: colNames[0].charCodeAt() - 'A'.charCodeAt()
                },
                e: {
                    r: rowName - 1,
                    c: colNames[1].charCodeAt() - 'A'.charCodeAt()
                }
            })

        }
    })
    return mergeArray;
}


/**
 * 
 * @param {字符串} username 用户名
 * @param {字符串} createDate 日报填写日期
 * @param {数组} plans 计划数组
 * @param {字符串} bigProblem 重大问题
 * @param {字符串} nextDayWork 下一天工作
 * @returns WorkBook
 */
function getWbObj(username, createDate, plans, bigProblem, nextDayWork) {
    // 表格总高度
    let height = 6 + (plans.length == 0 ? 1 : plans.length);

    // 基础边框样式
    let border = {
        bottom: {
            style: "medium"
        },
        right: {
            style: "medium"
        }
    }

    // 大标题单元格样式
    let reportTitleStyle = {
        font: {
            name: "楷体",
            sz: 24
        },
        alignment: { horizontal: "center" },
    }
    // 小标题单元格样式（带色）
    let reportLittleStyle = {
        font: {
            name: "楷体",
            sz: 18,
        },
        alignment: { horizontal: "left", wrap_text: true },
        fill: { patternType: "solid", fgColor: { rgb: 'F8DEC400' } },
        border
    }
    // 正文单元格样式
    let reportMainStyle = {
        font: {
            name: "楷体",
            sz: 18,
        },
        alignment: { horizontal: "left", wrap_text: true },
        border
    }

    // 整体布局
    let sheet = {
        // 各列样式（宽度）
        "!cols": [{ wpx: 80 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 }, { wpx: 200 }, { wpx: 200 }],
        "!rows": [],
        // 表格大小
        "!ref": `A1:I${height}`,
        // 基本字段
        "A1": { v: "技术人员工作日报表", s: reportTitleStyle },
        "A2": { v: "填报人", s: reportMainStyle },
        "B2": { v: username, s: reportMainStyle },
        "H2": { v: "填报时间", s: reportMainStyle },
        "I2": { v: createDate, s: reportMainStyle },
        "A3": { v: "序号", s: reportLittleStyle },
        "B3": { v: "项目名称", s: reportLittleStyle },
        "C3": { v: "起始日期", s: reportLittleStyle },
        "D3": { v: "终止日期", s: reportLittleStyle },
        "E3": { v: "工作内容", s: reportLittleStyle },
        "F3": { v: "工作性质", s: reportLittleStyle },
        "G3": { v: "完成情况", s: reportLittleStyle },
        "H3": { v: "问题点", s: reportLittleStyle },
        "I3": { v: "预想对策", s: reportLittleStyle },
        // 部分预融合单元格
        "!merges": [
            // 第一个大标题行融合
            ...getMergeRowObjs(1, [['A', 'I']]),
            // 大标题下 小标题融合
            ...getMergeRowObjs(2, [['C', 'G']])
        ]
    }
    // plans 起始行号
    let startRowIndex = 4;
    // 循环赋值
    if (plans.length != 0) {
        for (let i = 0; i < plans.length; i++) {
            sheet[`A${startRowIndex}`] = { v: i + 1, s: reportMainStyle };
            sheet[`B${startRowIndex}`] = { v: plans[i].name, s: reportMainStyle };
            sheet[`C${startRowIndex}`] = { v: plans[i].beginDate, s: reportMainStyle };
            sheet[`D${startRowIndex}`] = { v: plans[i].endDate, s: reportMainStyle };
            sheet[`E${startRowIndex}`] = { v: plans[i].mainWork, s: reportMainStyle };
            sheet[`F${startRowIndex}`] = { v: plans[i].type, s: reportMainStyle };
            sheet[`G${startRowIndex}`] = { v: plans[i].state, s: reportMainStyle };
            sheet[`H${startRowIndex}`] = { v: plans[i].problem, s: reportMainStyle };
            sheet[`I${startRowIndex}`] = { v: plans[i].solution, s: reportMainStyle };
            startRowIndex++;
        }
    } else {
        sheet['!merges'].push(...getMergeRowObjs(startRowIndex, [['A', 'I']]));
        sheet[`A${startRowIndex}`] = { v: "暂无数据", s: { ...reportMainStyle, alignment: { horizontal: "center" } } }
        startRowIndex++;
    }

    // 各行融合
    sheet[`A${startRowIndex}`] = { v: "重大问题说明", s: reportMainStyle }
    sheet[`C${startRowIndex}`] = { v: bigProblem, s: reportMainStyle }
    sheet['!merges'].push(...getMergeRowObjs(startRowIndex, [['A', 'B'], ['C', 'I']]))
    startRowIndex++;
    sheet[`A${startRowIndex}`] = { v: "下一工作日计划", s: reportMainStyle }
    sheet[`C${startRowIndex}`] = { v: nextDayWork, s: reportMainStyle }
    sheet['!merges'].push(...getMergeRowObjs(startRowIndex, [['A', 'B'], ['C', 'I']]))
    startRowIndex++;
    sheet[`A${startRowIndex}`] = { v: "注：必须把每天的工作记录清楚以便项目跟踪记录，并作为考核依据。" }
    sheet[`A${startRowIndex}`].s = reportMainStyle;
    sheet['!merges'].push(...getMergeRowObjs(startRowIndex, [['A', 'I']]))


    // 解决 merge 边框问题
    sheet['!merges'].forEach(merge => {
        let needBorderCells = getMergeSelfBorder(merge, { style: "medium" }, true);
        for (let key in needBorderCells) {
            if (sheet[key]) {
                if (sheet[key].s) {
                    if (sheet[key].s.border) {
                        sheet[key].s.border = {
                            ...sheet[key].s.border,
                            ...needBorderCells[key]
                        }
                    } else {
                        sheet[key].s.border = needBorderCells[key]
                    }
                } else {
                    sheet[key].s = {
                        border: needBorderCells[key]
                    }
                }
            } else {
                sheet[key] = {
                    v: "",
                    s: {
                        border: needBorderCells[key]
                    }
                }
            }
        }
    })
    return sheet;
}

module.exports = getWbObj