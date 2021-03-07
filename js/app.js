// 連想配列（プレイヤー情報）
const playerData = {
  name: "blank",
  hp: 300,
};
const enemyData = {
  name: "ピカチュウ",
  hp: 300,
};

// maxHpを定義（スタート時のhp）
playerData.maxHp = playerData.hp;
enemyData.maxHp = enemyData.hp;

// 勝敗決着後のボタン無効化に使用
let endGame = false;

// 敵の攻撃に関する一連の関数(条件分岐)
function enemyAttackBranch(enemyHitRate, enemyDamage, enemyWazaName) {
  const rand1 = Math.ceil(Math.random() * 100);
  // 攻撃があたる場合
  if (rand1 > enemyHitRate) {
    playerData.hp -= enemyDamage;
    $(".enemyAttackSound").get(0).currentTime = 0;
    $(".enemyAttackSound").get(0).play();
    $(".playerHpGaugeValue").css(
      "width",
      (playerData.hp / playerData.maxHp) * 100 + "%"
    );
    $(".playerMonster").addClass("purupuru");
    setTimeout('$(".playerMonster").removeClass("purupuru");', 700);
    $(".message").append(
      "<div>てきの" + enemyData.name + "の" + enemyWazaName + "！</div>"
    );
    if (playerData.hp <= 0) {
      setTimeout(() => {
        $(".message").append(
          "<div>" +
            playerData.name +
            "はちからつきた。めのまえがまっくらになった！</div>"
        );
      }, 1300);
      // 自身の敗北エフェクト
      $(".playerField").animate(
        { opacity: 0 },
        { duration: 800, easing: "swing" }
      );
      $(".bgm").get(0).pause();
      $(".lose").get(0).play();
      endGame = true;
    }
    // 攻撃が外れた場合
  } else {
    $(".karaburi").get(0).currentTime = 0;
    $(".karaburi").get(0).play();
    $(".message").append("<div>てきのこうげきははずれた。</div>");
  }
}

// 敵の攻撃に関する関数(各技の設定)
function enemyAttackFunction() {
  // 条件分岐
  if (enemyData.hp > 0) {
    let enemyAttack = Math.floor(Math.random() * 4);
    if (enemyAttack == 0) {
      enemyAttackBranch(0, 40, "でんきショック");
    } else if (enemyAttack == 1) {
      enemyAttackBranch(30, 110, "かみなり");
    } else if (enemyAttack == 2) {
      enemyAttackBranch(0, 40, "でんこうせっか");
    } else if (enemyAttack == 3) {
      enemyAttackBranch(25, 80, "たたきつける");
    }
  } else {
    $(".message").append(
      "<div>てきの" +
        enemyData.name +
        "はちからつきた。バトルにしょうりした！</div>"
    );
    // 敵の敗北エフェクト
    $(".enemyField").animate(
      { opacity: 0 },
      { duration: 800, easing: "swing" }
    );
    $(".bgm").get(0).pause();
    $(".winner").get(0).currentTime = 0;
    $(".winner").get(0).play();
    endGame = true;
  }
  // ゲーム終了時にボタン無効化
  if (endGame) {
    $(".wazaList").addClass("deactive");
  }
}

// 敵の攻撃アクションのタイミングをずらす関数
function delayExec() {
  setTimeout("enemyAttackFunction();", 1000);
}

//自身の攻撃アクション関数（命中率、ダメージ量、技名）
function playerAttack(playerHitRate, playerDamage, playerWazaName) {
  // ボタン無効化
  $(".wazaButton").prop("disabled", true);
  // 攻撃アクション
  const rand = Math.floor(Math.random() * 100);
  if (rand > playerHitRate) {
    enemyData.hp -= playerDamage;
    $(".attack").get(0).currentTime = 0;
    $(".attack").get(0).play();
    $(".enemyHpGaugeValue").css(
      "width",
      (enemyData.hp / enemyData.maxHp) * 100 + "%"
    );
    $(".pikachu").addClass("purupuru");
    setTimeout('$(".pikachu").removeClass("purupuru");', 700);
    $(".message").html(playerData.name + "の" + playerWazaName + "！");
  } else {
    $(".karaburi").get(0).currentTime = 0;
    $(".karaburi").get(0).play();
    $(".message").html(playerData.name + "のこうげきははずれた");
  }
  // 敵の攻撃アクション
  delayExec();
  // ボタン有効化
  setTimeout(() => {
    $(".wazaButton").prop("disabled", false);
  }, 1100);
}

// キャラクターによって技名を変更
function wazaNameInput(a, b, c, d) {
  $(".a").append(a);
  $(".b").append(b);
  $(".c").append(c);
  $(".d").append(d);
}

// 戦闘開始時のアクション
$(".selectPlayerButton").on("click", function () {
  $(".battleStart").fadeOut(1000);
  $(".bgm").get(0).currentTime = 0;
  $(".bgm").prop("volume", 0.3);
  $(".bgm").get(0).play();
  $(".message").html("やせいの" + enemyData.name + "があらわれた！");
});

// ポッチャマ選択時
$(".selectPocchama").on("click", function () {
  playerData.name = "ポッチャマ";
  $(".playerMonster").append(
    '<img src="https://tentetmr.github.io/pokemon/img/pocchama.png" alt="" class="monsterImage" />'
  );
  wazaNameInput("つつく", "ハイドロポンプ", "あわ", "ねむる");
  // 攻撃a
  $(".a").on("click", function () {
    playerAttack(0, 40, "つつく");
  });
  // 攻撃b
  $(".b").on("click", function () {
    playerAttack(30, 110, "ハイドロポンプ");
  });
  // 攻撃c
  $(".c").on("click", function () {
    playerAttack(0, 40, "あわ");
  });
  // 攻撃d （受けたダメージの75%を回復）
  $(".d").on("click", function () {
    $(".wazaButton").prop("disabled", true);
    // 蓄積ダメージの計算
    let currentPlayerHp = playerData.maxHp - playerData.hp;
    // ダメージ回復
    playerData.hp += currentPlayerHp * 0.7;
    $(".heal").get(0).currentTime = 0;
    $(".heal").get(0).play();
    $(".playerHpGaugeValue").css(
      "width",
      (playerData.hp / playerData.maxHp) * 100 + "%"
    );
    $(".message").html(playerData.name + "のねむる！");
    // 敵の攻撃アクション
    delayExec();
    // 自身の眠りアクション
    setTimeout(() => {
      $(".snore").get(0).currentTime = 0;
      $(".snore").get(0).play();
      $(".message").append(playerData.name + "はねむっている！");
    }, 2000);
    // 再度敵の攻撃（前のアクションからタイミングをずらす）
    setTimeout("enemyAttackFunction();", 3300);
    // ボタンの有効化
    setTimeout("$('.wazaButton').prop('disabled', false);", 3600);
  });
});

// アチャモ選択時
$(".selectAchamo").on("click", function () {
  playerData.name = "アチャモ";
  $(".playerMonster").append(
    '<img src="https://tentetmr.github.io/pokemon/img/achamo.png" alt="" class="monsterImage" />'
  );
  wazaNameInput("ひっかく", "メガトンパンチ", "ひのこ", "あなをほる");
  // 攻撃a
  $(".a").on("click", function () {
    playerAttack(0, 40, "ひっかく");
  });
  // 攻撃b
  $(".b").on("click", function () {
    playerAttack(15, 80, "メガトンパンチ");
  });
  // 攻撃c
  $(".c").on("click", function () {
    playerAttack(0, 40, "ひのこ");
  });
  // 攻撃d （穴を掘る）
  $(".d").on("click", function () {
    $(".scoop").get(0).currentTime = 0;
    $(".scoop").get(0).play();
    $(".playerMonster").animate(
      { opacity: 0 },
      { duration: 800, easing: "swing" }
    );
    $(".wazaButton").prop("disabled", true);
    $(".message").html(playerData.name + "のあなをほる！");
    setTimeout(
      '$(".message").append("<div>" + playerData.name + "はあなにもぐった！</div>");',
      1000
    );
    // 敵の攻撃アクション
    setTimeout(() => {
      $(".karaburi").get(0).currentTime = 0;
      $(".karaburi").get(0).play();
      $(".message").append(enemyData.name + "のこうげきははずれた");
    }, 2300);
    // 穴を掘るアクション
    setTimeout(() => {
      $(".playerMonster").animate(
        { opacity: 1 },
        { duration: 100, easing: "swing" }
      );
      enemyData.hp -= 80;
      $(".attack").get(0).currentTime = 0;
      $(".attack").get(0).play();
      $(".enemyHpGaugeValue").css(
        "width",
        (enemyData.hp / enemyData.maxHp) * 100 + "%"
      );
      $(".pikachu").addClass("purupuru");
      setTimeout('$(".pikachu").removeClass("purupuru");', 700);
      $(".message").html(playerData.name + "のあなをほる！");
    }, 3600);
    // 再度敵の攻撃（前のアクションからタイミングをずらす）
    setTimeout("enemyAttackFunction();", 4900);
    // ボタンの有効化
    setTimeout("$('.wazaButton').prop('disabled', false);", 5200);
  });
});

// リトライボタンの設置
$(".retryButton").on("click", function () {
  location.reload();
});
