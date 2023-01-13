import './css/styles.css';
import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiService = new ApiService();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

  apiService.formInput = e.target.elements.searchQuery.value;
  apiService.resetPage();

  apiService.fetchImgFunc().then(images => {
    console.log(images);
    if (images.hits.length === 0) {
      refs.gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      refs.gallery.innerHTML = renderImageCards(images);

      new SimpleLightbox('.gallery a');

      refs.loadMoreBtn.classList.remove('is-hidden');

      Notify.success(`Hooray! We found ${images.totalHits} images.`);
    }
  });
}

function onLoadMore() {
  apiService.fetchImgFunc().then(images => {
    renderImageCards(images);

    refs.gallery.insertAdjacentHTML('beforeend', renderImageCards(images));

    new SimpleLightbox('.gallery a');
  });
}

function renderImageCards(images) {
  const imageCards = images.hits
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
