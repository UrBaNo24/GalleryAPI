"use strict"
const overlay = document.querySelector(".overlay");

const cerrar = document.querySelector(".btn_cerrar").addEventListener('click', () => {
  overlay.style.opacity = 0;
  overlay.style.visibility = 'hidden'
});

class Gallery{
  
    constructor(){
      //KEYS AUXILIARES POR SI LA PRINCIPAL CADUCA.
        //563492ad6f9170000100000136ebdba0c65c46778eee9161dc308b5a  //KEY AUXILIAR 1
        //563492ad6f9170000100000170433fdf456d4adcadf61b867f5ac076  //KEY AUXILIAR 2
        //563492ad6f91700001000001434adee303ea4c28bad7bb2fd797dfa4  //KEY AUXILIAR 3
      this.API_KEY = '563492ad6f9170000100000136ebdba0c65c46778eee9161dc308b5a  '; //Key propia de Pexels
      //Utilizamos querySelector para acceder a los elementos de una clase ya que es mucho más facil y comodo que con className
      this.galleryContainer = document.querySelector('.gallery');
      this.search = document.querySelector('.header form');
      this.loadMore = document.querySelector('.load-more');
      this.titulo = document.querySelector('.titulo');
      this.img_slideshow  = document.querySelector(".img_slideshow");
      this.pageIndex = 1;
      this.searchValueGlobal = '';
      //Attributes for the carousel.
      this.array = [];
      this.counter = 0;
      this.forwardButton = document.querySelector(".adelante");
      this.backwardButton = document.querySelector(".atras");
      this.previousIdNumber = 0;
      this.nextIdNumber = 0;
      this.counterMovements = 0;
      this.listener();
    }
    listener(){
      document.addEventListener('DOMContentLoaded',()=>{ 
        this.getImg(1);
      });

      this.search.addEventListener('submit', (e)=>{
        this.counter = 0; //Reset counter
        this.array = []; //Reseteamos array
        this.pageIndex = 1;
        this.searchImg(e);
      });

      this.loadMore.addEventListener('click', (e)=>{
        this.loadMoreImg(e);
      })

      this.titulo.addEventListener('click',()=>{
        this.pageIndex = 1;
        this.galleryContainer.innerHTML = '';
        this.getImg(this.pageIndex);
      })
    }

    showCarousel() {
      overlay.style.opacity = 1;
      overlay.style.visibility = 'visible'
    }

    async getImg(index){
      this.loadMore.setAttribute('data-img', 'curated');
      const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=9`; //The last number in the URL indicates how many photos I want to show per page
      const data = await this.fetchImages(baseURL);
      this.createPhotos(data.photos)
    }

    async fetchImages(baseURL){ 
      const response = await fetch(baseURL, { 
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: this.API_KEY
        }
      });
      const data = await response.json();
      // console.log(data);
      return data;
    }


    createPhotos(photos){
      photos.forEach(photo=>{
        const item= document.createElement('div'); 
        item.classList.add('item'); 

        item.innerHTML = ` 
          <img id="imagen[${this.counter}]" class= "imagenes" src="${photo.src.medium}">
          <h3>${photo.photographer}</h3>
        `; //Add photo and author.
        
        this.galleryContainer.appendChild(item);
        //View Image
        let imagen = document.getElementById(`imagen[${this.counter}]`);
        imagen.addEventListener('click',event => {
          let imageId = imagen.id;
          img_slideshow.src = imagen.src;
          img_slideshow.dataset.img = parseInt(imageId.match(/\d+/)[0]);
          this.showCarousel();
        });
        this.array[this.counter] = imagen;
        this.counter++;
      })
      
      //BUTTONS
      this.backwardButton.addEventListener('click', () => {
        if(parseInt(img_slideshow.dataset.img) - 1 >= 0) {
          this.previousIdNumber = parseInt(img_slideshow.dataset.img);
          this.previousIdNumber--;
          let previousImage = document.getElementById(`imagen[${this.previousIdNumber + this.counterMovements}]`);

          console.log(previousImage);
          
          img_slideshow.src = previousImage.src;
          img_slideshow.dataset.img = this.previousIdNumber;

          this.counterMovements++;
        }  
      })

      this.forwardButton.addEventListener('click', () => {
        if(parseInt(img_slideshow.dataset.img) + 1 < this.counter) {
          this.nextIdNumber = parseInt(img_slideshow.dataset.img);
          this.nextIdNumber++;
          let nextImage = document.getElementById(`imagen[${this.nextIdNumber - this.counterMovements}]`);
          img_slideshow.src = nextImage.src;
          img_slideshow.dataset.img = this.nextIdNumber;
            this.counterMovements++;
        } 
      })

    }
    
    async searchImg(e){
      this.counterMovements++;
      console.log("Contador de movimientos: " + this.counterMovements)
      this.loadMore.setAttribute('data-img', 'search');
      e.preventDefault();
      this.galleryContainer.innerHTML='';
      const searchValue = e.target.querySelector('input').value;
      this.searchValueGlobal = searchValue;
      const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=9`
      const data = await this.fetchImages(baseURL);
      this.createPhotos(data.photos);
      e.target.reset();
    }

    async getMoreImg(index){
      // console.log(searchValue)
      const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=9`
      const data = await this.fetchImages(baseURL);
      console.log(data)
      this.createPhotos(data.photos);
    }

    loadMoreImg(e){
      let index = ++this.pageIndex;
      const loadMoreData = e.target.getAttribute('data-img');
      this.counterMovements++;
      console.log("Contador de movimientos: " + this.counterMovements)
      if(loadMoreData === 'curated'){
        // load next page for curated]
        this.getImg(index)
      }else{
        // load next page for search
        this.getMoreImg(index);
      }

    }

  }

  
  const gallery = new Gallery;
  
