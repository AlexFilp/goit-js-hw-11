import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ApiService {
  constructor() {
    this.formInput = '';
    this.page = 1;
  }

  async fetchImgFunc() {
    const axios = require('axios').default;
    const API_KEY = '32825732-53fa7d1ce449dfc74c3175ae8';
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.formInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    try {
      const response = await axios.get(url);
      this.page += 1;
      return response;
    } catch (error) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      console.log(error);
    }
  }

  get input() {
    return this.formInput;
  }

  set input(newFormInput) {
    return (this.formInput = newFormInput);
  }

  resetPage() {
    this.page = 1;
  }
}
