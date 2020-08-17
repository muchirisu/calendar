'use strict';

console.clear();

{
  // クリックイベントの際に再代入できなくなってしまうので、letに書き直す
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); //5月

  //翌月分の日付を取得する関数を宣言するTail後ろの方
  function getCalendarTail() {
    //からの配列を用意する
    const dates = [];
    //末日を表す数値
    const lastDay = new Date(year, month + 1, 0).getDay();
    //1日から6日までの配列を作る
    //末日が週の何日目かを引いて求める
    //例えば末日が月曜日だったら1引いて。火曜日だったら2引いて5に満たないまでのループにすると汎用性が高くなる
    for (let i = 1; i < 7 - lastDay; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true,
      });
    }
    //console.logだと表示するだけ
    // console.log(dates);
    return dates;
  }


  // カレンダーの頭の方の日付を取得する関数を宣言する
  function getCalendarHead() {
    // 空の配列を用意する
    const dates = [];
    // 月末の日付をdとする
    //今月の0日めとし、その日付が欲しいのでgetDateとする
    const d = new Date(year, month, 0).getDate();
    // 月末の日数をnとする（何日残っているか）そして今月の1日のオブジェクトが、週の何日めかを取得すればいいのでgetDyとしてあげる(曜日)
    const n = new Date(year, month, 1).getDay();

    //dから一日ずつ遡りつつn日分の日付が欲しいのでループを回してあげる
    for(let i = 0; i < n; i++) {
      //pushの対義。配列の先頭に数値を入れていく
      //１　d-iとは30はdそのもの、29はd-1、28はd-2なのでd-iを入れる
      //２　ただしdatesはオブジェクトの配列にしたので他のプロパティも追加してあげる
      dates.unshift({
        date: d - i,
        isToday: false,
        //先月分の日付で薄くしたいのでtrueをつける
        isDisabled: true,
      });
    }
    //console.logだと表示するだけ
    // console.log(dates);
    return dates;
  }

  // 今月分の日付を作る
  //カレンダーの日付の本体という意味
  function getCalendarBody() {
    //日付の配列を作るためにからの配列を宣言する
    const dates = []; //date=日付 day=曜日
    //月初から末日までの日付を入れる（末日は翌月一日の一日前という意味で、翌月の0日目を指定する）
    const lastDate = new Date(year, month + 1, 0).getDate();
    //iが１から末日まででiを１ずつ増やしながら次の処理をしてね
    for (let i = 1; i <= lastDate; i++) {
      //１配列に要素を追加する
      //２単純な配列ではなくオブジェクトの配列にす る
      dates.push({
        date: i,
        isToday: false,
        // disabledクラスは先月と翌月の日付につくクラスなので当然false
        isDisabled: false,
      });
    }

    if (year === today.getFullYear() && month === today.getMonth()) {
      dates[today.getDate() - 1].isToday = true;
    }
    //console.logだと表示するだけ
    // console.log(dates);
    return dates;
  }
    //createCalendarの分割①
  function clearCalendar() {
      //createCalendarされるたびにカレンダーが追加されてしまうので、その度にtbodyの中身をクリアしてあげる
    const tbody = document.querySelector('tbody');

    //tbodyの最初の子要素が有る限り、tbodyからその最初の子要素を削除してね
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  //createCalendarの分割②
  function renderTitle() {
    //prevとnextの切り替えに応じてタイトルも変更する
    //月が一桁の時には0を足して（０３月のように）表示する（パッドスタート）※文字列にしか使えないのでstringで一旦文字列にしてあげてから使う
    //２けたで表示してね、満たなかったら0の文字列で埋めてね
    const title = `${year}/${String(month + 1).padStart(2, '0')}`;
    document.getElementById('title').textContent = title;
  }

  //createCalendarの分割③
  function renderWeeks() {
    const dates = [
      //このままだと配列の中に3つの配列が入ってしまっている
      // getCalendarHead(),
      // getCalendarBody(),
      // getCalendarTail(),
      //全ての要素を配列の中で展開して欲しい
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ];
    // 週毎の配列を作ろう
    //1まずは空の配列を作る
    const weeks = [];
    //何週分あるかを出す
    const weeksCount = dates.length / 7;
    //１週間ごと描画する
    for (let i = 0; i < weeksCount; i++) {
      //datesから7個分を削除しつつ取り出してね
      weeks.push(dates.splice(0, 7));
    }
    // console.log(weeks);

    //htmlに描画する
    //週ごとに処理をしたいのでforEach()を回す
    //取り出したい配列をweekとしつつ次の処理をしてね
    weeks.forEach(week => {
      //weekごとに行を作っていきたいのでtr要素を作ってあげる
      const tr = document.createElement('tr');
      //取り出した毎週の配列の要素をdateとしつつ
      week.forEach(date => {
        const td = document.createElement('td');

        td.textContent = date.date;
        if (date.isToday) {
          td.classList.add('today');
        }
        if (date.isDisabled) {
          td.classList.add('disabled');
        }

        tr.appendChild(td);
      });
      document.querySelector('tbody').appendChild(tr);  
    });
  }
  
  function createCalendar() {
    //分割①の呼び出し
    clearCalendar();
    //分割②の呼び出し
    renderTitle();
    //分割③の呼び出し
    renderWeeks();

  }

  //prevを押したら前月のカレンダーが描画されるクリックイベントを追加しよう
  document.getElementById('prev').addEventListener('click', () => {
    // monthから1引いてカレンダーに描画すれば良い＆年を跨いだらyearの方も操作してあげる必要がある
    month--;
    //0より小さくなったらyearから１引いて１２月に戻したい。１月=０
    if (month < 0) {
      year--;
      month = 11;
    }
    createCalendar();
  });

  //nextを押したら次月のカレンダーが描画されるクリックイベントを追加しよう
  document.getElementById('next').addEventListener('click', () => {
    // monthから1引いてカレンダーに描画すれば良い＆年を跨いだらyearの方も操作してあげる必要がある
    month++;
    //12月を超えたら（つまり11よりおおきくなったら）
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  });
   //todayを押した時のクリックイベントの追加
  document.getElementById('today').addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();

    createCalendar();
  });

  createCalendar();

  // getCalendarBody();
  // getCalendarHead();
  // getCalendarTail();
}