//* PAGE TITLE
const PAGE_TITLE = document.querySelector('.page-title');
const pageHeader = document.querySelector('.page-header');
const mainTitle = 'Homework 10';

document.title = PAGE_TITLE.textContent;
pageHeader.textContent = PAGE_TITLE.textContent;

//* HIDE BACK BTN
const backBtn = document.querySelector('.back-btn');

hideBackBtn();

function hideBackBtn() {
  if (PAGE_TITLE.textContent === mainTitle) {
    backBtn.classList.add('hidden');
  }
  return;
}
