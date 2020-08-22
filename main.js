// --------------------------------获取页面的节点-------------------------------
// 日历节点
const calendar = document.getElementById("calendar");
// 心情样式节点
const moods = document.querySelectorAll(".mood");
// 随机按钮节点
const randomize = document.querySelector("#randomize");
// 清空按钮节点
const clear = document.querySelector("#clear");

// 创建日历所需要的初始变量
// 获取计算机当前年份
var mydata = new Date();
var nowYear = mydata.getFullYear();
const currentYear = nowYear;
const weekDays = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const months = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
// 初始化颜色变量
// 心情图标的颜色，即选中心情时的颜色,用于随机颜色时的colors[0-5]颜色选取
const colors = ["blue", "Indigo", "pink", "red", "#CDAA7D", "#888"];

// -------------------------------日历的渲染-------------------------------------
// 渲染日历操作步骤
// 1.获取这一年所有的日期,保存到dates数组中
const dates = getAllDays(currentYear);

// 2.对日期进行循环遍历，插入到对应的月份
let monthsHTML = "";
// forEach--->遍历months数组   month---->数组的数据   index---->数组数据的下标
months.forEach((month, index) => {
  monthsHTML += `<div class="months month_${index}">
  <h3>${month}</h3>
  <div class="week_days_container">
  ${weekDays.map((day) => `<div class="week_days">${day}</div>`).join("")}
  </div>
  <div class="days_container"></div>
  </div>`;
});
// 将monthsHTML返回给html页面
calendar.innerHTML = monthsHTML;

// 3.每月的日期渲染到对应的星期里
dates.forEach((date) => {
  // 获取日期所属的月份
  const month = date.getMonth();
  //   打印moth看看,结果是0-11 分别对应12个月,0打印31次(1月有31天) 1打印29次(2月有29天)....
  //   console.log(month);

  // 获得当前日期对应的月份的节点
  //   .month_${month}--->通过每个月份不同的month_0/1/2..样式获得对应月份的.days_container容器位置
  const monthEl = document.querySelector(`.month_${month} .days_container`);

  //   如果该月第一天不是星期一,则需要在1日前插入空白的占位格
  // getDate()--->获取当前的日期,如1表示1号,2表示2号,31表示31号    为1时,则表示这是该月的第一天
  //   getDay()----->可返回表示星期的某一天的数字 0表示星期天 1表示i星期一... 6表示星期六
  //   getDay()!==0则表示当前月的1号不是星期天,也就是说前面要添加空白占位格
  if (date.getDate() === 1 && date.getDay() !== 0) {
    for (let i = 0; i < date.getDay(); i++) {
      const emptySpot = createEmptySpot();
      monthEl.appendChild(emptySpot);
    }
  }

  //   dateEl是每个月对应的每个日期
  const dateEl = createDateEl(date);
  //   向每个月插入孩子dateEl(日期)
  monthEl.appendChild(dateEl);
});

// ----------------------------心情图标的颜色---------------------------
// 因为要先渲染出日历日期，才能对日期修改颜色  如果放在渲染日期之前，则颜色无法修改成功，因为还没有日期标签
// 循环遍历心情图标以确认选择的心情

// 日历日期的初始颜色  灰色的
const defaultColor = "#888";
// 选中的图标对应的颜色 一开始没有选择，所以为空的
let activeColor = "";

moods.forEach((mood) => {
  // 当点击心情图标时开始函数
  mood.addEventListener("click", () => {
    // 判断图标是否被选中
    // 如果图标的样式中包含了selected样式，则清除这个样式  selected样式就是图标被点击时的样式
    // 如果点击的mood有这个样式，则清除
    if (mood.classList.contains("selected")) {
      mood.classList.remove("selected");
      //   不选择或这清除选择的心情后，要能给日期还原回灰色
      activeColor = defaultColor;
    }
    // 如果点击的心情没有这个样式，则遍历所有心情看看谁有，有则清除
    else {
      // 遍历所有图标，移除所有的selected样式
      moods.forEach((mood) => {
        mood.classList.remove("selected");
      });
      mood.classList.add("selected");
      // 获取选中图标的颜色
      // getComputedStyle()-->获得当选中的元素
      // getPropertyValue()--->获得元素的样式值
      activeColor = getComputedStyle(mood).getPropertyValue("color");
    }
  });
});

// 给日期添加对应的心情颜色
const circles = document.querySelectorAll(".circle");
circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    circle.style.backgroundColor = activeColor;
  });
});

// -------------------------随机颜色按钮-------------------------------
randomize.addEventListener("click", () => {
  circles.forEach((circle) => {
    circle.style.backgroundColor = getRandomColor();
  });
});

// -------------------------清空所有心情颜色-----------------------------
clear.addEventListener("click", () => {
  circles.forEach((circle) => {
    circle.style.backgroundColor = defaultColor;
  });
});
//------------------------------函数部分--------------------------------
// getAllDays  获取该年所有日期
function getAllDays(year) {
  // 获取这一年的第一天

  //   获取日期的另一种方法
  //   const myDate = new Date();
  //   const b = myDate.getFullYear(); //获取完整的年份(4位)

  //   通过模板字符转进行获取第一天日期
  //   注意!!! 模板字符串使用的时 ` 而不是 '   `是波浪号那个键位!!!!!!!
  //   Wed Jan 01 2020 00:00:00 GMT+0800 (中国标准时间)
  // wed--->星期三  Jan---->1月   01---->1日  2020---->2020年
  const firstDay = new Date(`January 1 ${year}`);

  //获取这一年的最后一天
  //   注意!!! 模板字符串使用的时 ` 而不是 '   `是波浪号那个键位!!!!!!!
  const lastDay = new Date(`December 31 ${year}`);

  //   保存这一年所有日期的数组
  const days = [firstDay];
  //   用于追踪日期
  //   数组中最后一天的日期等于这一年的最后一天时,不再向数组里添加日期  一开始的日期时第一天的日期
  let lastDayInArray = firstDay;

  while (lastDayInArray.getTime() !== lastDay.getTime()) {
    //   通过push将函数返回的数据加入days数组中
    days.push(addDays(lastDayInArray, 1));
    // 让lastDayInArray等于新加进去的日期
    // 通过days数组的下标来把最后一个元素(最新加进去的)赋给lastDayInArray
    lastDayInArray = days[days.length - 1];
  }
  //   在控制台打印出days数组看看
  //   console.log(days);
  return days;
}
// 将日期添加进日期数组中
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// createEmptySpot 创建空白占位格的函数
function createEmptySpot() {
  // 创建空div
  const emptyEl = document.createElement("div");
  //   给这个div添加好样式
  emptyEl.classList.add("days");
  return emptyEl;
}

// createDateEl   创建对应日期的函数
function createDateEl(date) {
  // 获取当前日期1-31
  const day = date.getDate();
  //   添加一个div
  const dateEl = document.createElement("div");
  //   给div添加样式
  dateEl.classList.add("days");
  //   在div中加入带有日期的span标签，并写回到html页面中
  dateEl.innerHTML = `<span class="circle">${day}</span>`;
  return dateEl;
}

// 随机颜色函数
function getRandomColor() {
  // 向下取整 得到一个0-5的随机数
  //   color[0]---蓝色  color[4]----黑色
  return colors[Math.floor(Math.random() * 6)];
}
