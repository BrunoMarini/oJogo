let count = 0;
const btnShuffle = $('#casinoShuffle');
const btnStop = $('#casinoStop');
const casino1 = $('div[id="casino1"]');
const casino2 = $('.casino2');
const casino3 = $('.casino3');
const mCasino1 = new SlotMachine(casino1, {
  active: 0,
  delay: 500
});
const mCasino2 = new SlotMachine(casino2, {
  active: 0,
  delay: 500
});
const mCasino3 = new SlotMachine(casino3, {
  active: 0,
  delay: 500
});

function startRoll() {
    alert("OK");
    mCasino1.shuffle(9999);
    mCasino2.shuffle(9999);
    mCasino3.shuffle(9999);
}
