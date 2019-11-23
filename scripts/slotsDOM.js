let count = 0;
const btnShuffle = document.querySelector('#casinoShuffle');
const btnStop = document.querySelector('#casinoStop');
const casino1 = document.querySelector('#casino1');
const casino2 = document.querySelector('#casino2');
const casino3 = document.querySelector('#casino3');
const mCasino1 = new SlotMachine(casino1, {
  active: 0,
  delay: 500
});
const mCasino2 = new SlotMachine(casino2, {
  active: 1,
  delay: 500
});
const mCasino3 = new SlotMachine(casino3, {
  active: 2,
  delay: 500
});