import './css/styles.css';
import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { handleInfiniteScroll } from './infiniteScroll';
import throttle from 'lodash.throttle';

const Pagination = require('tui-pagination');

Notify.init({
  position: 'left-top',
  width: '250px',
  cssAnimationStyle: 'zoom',
  showOnlyTheLastOne: true,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiService = new ApiService();

let totalHitsAmount = 0;

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
// For infinite scroll
window.addEventListener(
  'scroll',
  throttle(() => handleInfiniteScroll(onLoadMore), 300)
);

const lightBox = new SimpleLightbox('.gallery a');

function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  totalHitsAmount = 0;
  // for disabled button
  // refs.loadMoreBtn.disabled = false;
  // refs.loadMoreBtn.classList.remove('is-disabled');

  refs.loadMoreBtn.classList.add('is-hidden');

  apiService.formInput = e.target.elements.searchQuery.value;
  apiService.resetPage();

  apiService.fetchImgFunc().then(images => {
    console.log(images);
    if (images.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      refs.gallery.innerHTML = renderImageCards(images);

      totalHitsAmount += images.data.hits.length;

      lightBox.refresh();

      // comment for infiniteScroll
      // refs.loadMoreBtn.classList.remove('is-hidden');

      // for disabled button
      // refs.loadMoreBtn.textContent = `Load more ${totalHitsAmount}/${images.data.totalHits}`;

      Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
    }
  });
}

function onLoadMore() {
  apiService
    .fetchImgFunc()
    .then(images => {
      totalHitsAmount += images.data.hits.length;
      if (totalHitsAmount === images.data.totalHits) {
        // for disabled button
        // refs.loadMoreBtn.disabled = true;
        // refs.loadMoreBtn.classList.add('is-disabled');
        // refs.loadMoreBtn.textContent = `${totalHitsAmount}/${images.data.totalHits}`;
        // for hidden button
        // comment for infiniteScroll
        // refs.loadMoreBtn.classList.add('is-hidden');
        // Notify.failure(
        //   "We're sorry, but you've reached the end of search results."
        // );
      }
      renderImageCards(images);

      refs.gallery.insertAdjacentHTML('beforeend', renderImageCards(images));

      // for disabled button
      // refs.loadMoreBtn.textContent = `${
      //   images.data.totalHits === totalHitsAmount ? '' : 'Load More'
      // } ${totalHitsAmount}/${images.data.totalHits}`;

      // comment for infiniteScroll
      // doSlowScroll();

      lightBox.refresh();
    })
    .catch(error => {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      console.log(error);
    });
}

function renderImageCards(images) {
  const imageCards = images.data.hits
    .map(
      item => `<a href="${item.largeImageURL}"><div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: <span class="info-text">${item.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views: <span class="info-text">${item.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments: <span class="info-text">${item.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads: <span class="info-text">${item.downloads}</span></b>
    </p>
  </div>
</div></a>`
    )
    .join('');

  return imageCards;
}

function doSlowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 - 60,
    behavior: 'smooth',
  });
}
