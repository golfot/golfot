
  window.addEventListener('scroll', function() {
  var header = document.getElementById('header');
  if (window.scrollY > 0) {
  header.classList.add('blur');
  } else {
  header.classList.remove('blur');
  }
  });

  
  // cuplikan
  
  document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://golfot.my.id/api/cuplikan?id=17';
  $('#loadingSpinner').show();
  $('#datas').hide();
  
  const newsContainer = document.getElementById('news-container1');
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
  data.slice(0, 8).forEach(item => {
  
  const imageUrl = item.thumbnailUrl.replace('hqdefault', 'maxresdefault');
  const newsCard = document.createElement('div');
  newsCard.className = 'col-md-4 news-card';
  newsCard.innerHTML = `
  
  <div class="py-3" style="background-color: transparent;">
  <div class="card-body">
  <div class="d-flex align-items-center text-white">
  <div class="me-4 w-100">
  <h5 style="margin: 0px;">${item.title}</h5>
  <p class="opacity-50" style="margin: 0px;">${item.createdAt}</p>
  <p class="opacity-100" style="margin: 10px 0 0 0; font-size: 13px;"><img class="me-2" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" width="20">Cuplikan</p>
  </div>
  <img src="${imageUrl}" alt="Gambar" class="img-fluid rounded-4" style="width: 80px; height: 80px; object-fit: cover;">
  </div>
  </div>
  </div>
  
  `;
  newsContainer.appendChild(newsCard);
  });
  $('#loadingSpinner').hide();
  $('#datas').show();
  })
  .catch(error => {
  console.error('Error fetching news:', error);
  $('#loadingSpinner').show();
  $('#datas').hide();
  });
  });
  
  
  
  
  
  // detail
  
  fetch('https://golfot.my.id/api/infoliga?id=47')
  .then(response => response.json())
  .then(data => {
  // Set image source
  document.getElementById('ligaLogo').src = `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${data.id}.png`;
  // Set title
  document.getElementById('ligaTitle').textContent = data.name;
  // Set country as subtitle
  document.getElementById('ligaSub').textContent = data.country;
  })
  .catch(error => console.error('Error fetching data:', error));
  
  
  
  // berita
  
  document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://golfot.my.id/api/news?id=87';
  $('#loadingSpinner').show();
  $('#datas').hide();
  
  const newsContainer = document.getElementById('news-container');

  fetch(url)
  .then(response => response.json())
  .then(data => {
  data.slice(0, 8).forEach(item => {
  const newsCard = document.createElement('div');
  newsCard.className = 'col-md-4 news-card mb-4';
  newsCard.innerHTML = `
  <div class="rounded-4 border-card p-4">
  <img src="${item.imageUrl}" class="card-img-top rounded-4" style="max-height: 200px;" alt="News Image">
  <div class="card-body rounded-bottom-4">
  <a href="${item.pageUrl}" target="_blank">
  <h5 class="card-title mt-3 mb-2">${item.title}</h5>
  <p class="card-text"><small class="text-white">${item.timeAgo}</small></p>
  </a>
  </div>
  </div>
  `;
  newsContainer.appendChild(newsCard);
  });
  $('#loadingSpinner').hide();
  $('#datas').show();
  })
  .catch(error => {
  console.error('Error fetching news:', error);
  $('#loadingSpinner').show();
  $('#datas').hide();
  });
  });
  
