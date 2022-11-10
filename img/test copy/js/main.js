// $(".fuku").on("click",function(){
//     let clothes = $(this).attr("clothes-id");
//     console.log(clothes);
//     localStorage.setItem("20221106-bottom",`<img src ="/img/${clothes}.png" class = "resultbottom">`);
//     $("#result").html(`${localStorage.getItem('20221106-bottom')}`);
// });


/* -----------------
ここからカレンダー
-------------------*/

const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
};
// 前の月表示
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー表示
function showProcess(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

    let calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    let calendar = "<table><tr class='dayOfWeek'>";
    for (let i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    var count = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var lastMonthEndDate = new Date(year, month, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        let yearForClass = String(year).slice(-2); //YYMMDDのYYを生成

        if(month.toString().length < 2){
            monthForClass = `0${String(month+1)}`;
        } //YYMMDDのMMを生成 (MMが一桁の場合)
        else{
            monthForClass = String(month+1); 
        } //YYMMDDのMMを生成 (MMが二桁の場合)           

        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if(count.toString().length < 2){
                countForClass = `0${String(count+1)}`;
            } //YYMMDDのDDを生成 (一桁の場合)
            else{
                countForClass = String(count+1); 
            } //YYMMDDのDDを生成 (二桁の場合)   

            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate) + "</td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += 
                    `<td class='today modal-open' id ='outfit-${yearForClass}${monthForClass}${countForClass}'>${count}<div id = "item-${yearForClass}${monthForClass}${countForClass}-top" class = "overview-top-area"></div><div id = "item-${yearForClass}${monthForClass}${countForClass}-bottom" class = "overview-bottom-area"></div></td>`;
                } else {
                    calendar += 
                    `<td class = 'modal-open' id ='outfit-${yearForClass}${monthForClass}${countForClass}'>${count}<div id = "item-${yearForClass}${monthForClass}${countForClass}-top" class = "overview-top-area"></div><div id = "item-${yearForClass}${monthForClass}${countForClass}-bottom" class = "overview-bottom-area"></div></td>`;
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

/* -----------------
モーダルの表示・非表示
-------------------*/

// カレンダーの日付をクリックしたらモーダルを表示する
$(document).on('click','td', function() {
    $('.result-top').html(`<img src = "img/top-undefined.png">`);
    $('.result-bottom').html(`<img src = "img/bottom-undefined.png">`);
   console.log("クリックされました");
   yymmdd = String(this.getAttribute('id'));
   console.log(yymmdd);
   yymmddForClass = `${yymmdd}`
   console.log(yymmddForClass);
   $('.modal-container').addClass('active');
   $('.modal-date').html(`<h2>20${yymmdd.slice(7,9)}年${yymmdd.slice(9,11)}月${yymmdd.slice(-2)}日のコーディネート</h2>`);
	

    $(document).on('click','.item', function() {
        console.log("アイテムがクリックされました");
        let type = $(this).attr("item-type");
        let id = $(this).attr("item-id");
        if(type == "top"){
            topPic = `<img src = "img/${type}-${id}.png" class = "overview-top">`;
            $('.result-top').html(topPic);
        }
        if(type == "bottom"){
            bottomPic = `<img src = "img/${type}-${id}.png" class = "overview-bottom">`;
            $('.result-bottom').html(bottomPic);
        }
        
       });
    
    $(document).on('click','.save-button', function() {
        console.log("セーブされました");
        $(`#item${yymmdd}-top`).html(); // 画像をitem-YYMMDD-topに格納
        // 画像をitem-YYMMDD-bottomに格納
        $('.modal-container').removeClass('active');
       });
    
    $(document).on('click','.reset-button', function() {
        console.log("クリアされました");
        $('.result-top').html(`<img src = "img/top-undefined.png">`);
        $('.result-bottom').html(`<img src = "img/bottom-undefined.png">`);
        localStorage.removeItem(`${yymmdd}-tops`);
        localStorage.removeItem(`${yymmdd}-bottoms`);
       });
       return false;

    });

// 閉じるボタンをクリックしたらモーダルを閉じる
  $(document).on('click','.modal-close', function() {
    alert("入力内容を破棄しますか？");
    $('.modal-container').removeClass('active');
   });

// モーダルの外側をクリックしたらモーダルを閉じる
   	$(document).on('click',function(e) {
		if(!$(e.target).closest('.modal-body').length) {
			$('.modal-container').removeClass('active');
		}});

// $(#).localStorage.getItem()
//     localStorage.setItem("20221106-bottom",`<img src ="/img/${clothes}.png" class = "resultbottom">`);
//     $("#result").html(`${localStorage.getItem('20221106-bottom')}`);