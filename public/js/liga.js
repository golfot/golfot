  window.addEventListener('scroll', function() {
  var header = document.getElementById('header');
  if (window.scrollY > 0) {
  header.classList.add('blur');
  } else {
  header.classList.remove('blur');
  }
  });
  
  
  // Fungsi untuk mengambil nilai parameter dari URL
       function getQueryParam(param) {
           const urlParams = new URLSearchParams(window.location.search);
           return urlParams.get(param);
       }
  
       // Menunggu sampai DOM siap
       document.addEventListener('DOMContentLoaded', function() {
           // Ambil nilai parameter 'id' dan 'cu'
           const ids = getQueryParam('ids');
           const cu = getQueryParam('cu')
  
           // Buat URL baru menggunakan nilai 'cu'
   
  
           // Fetch cuplikan video
           $('#loadingSpinnerd').show();
           $('#loadingSpinnerb').show();
           $('#loadingSpinnerk').show();
           $('#loadingSpinnerc').show();
           $('#cup').hide();
           $('#ligad').hide();
           $('#klas').hide();
           $('#beritaid').hide();
           
           const apiCuplikan = `https://golfot.my.id/api/cuplikan?id=${cu}`;
           const newsContainer1 = document.getElementById('cuplikan');
           
           fetch(apiCuplikan)
           .then(response => response.json())
           .then(data => {
               data.slice(0, 8).forEach(item => {
                   const imageUrl = item.thumbnailUrl.replace('hqdefault', 'maxresdefault');
                   const newsCard = document.createElement('div');
                   newsCard.className = 'col-md-4 news-card mx-4';
                   newsCard.innerHTML = `
                       <div class="py-3" style="background-color: transparent;">
                           <div class="card-body">
                               <div class="d-flex align-items-center text-white">
                                   <div class="me-4 w-100">
                                       <h5 style="margin: 0px; font-size: 1.1em;">${item.title}</h5>
                                       <p class="opacity-50" style="margin: 0px; font-size: 0.9em;">${item.createdAt}</p>
                                       <p class="opacity-100" style="margin: 10px 0 0 0; font-size: 13px;">
                                           <img class="me-2" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" width="20">Cuplikan
                                       </p>
                                   </div>
                                   <img src="${imageUrl}" alt="Gambar" class="img-fluid rounded-4" style="width: 80px; height: 80px; object-fit: cover;">
                               </div>
                           </div>
                       </div>
                   `;
                   
                   const videoId = item.url.split('v=')[1];
                   
                   newsCard.addEventListener('click', () => {
                       const newsModal = new bootstrap.Modal(document.getElementById('ytModal'));
                       document.getElementById('newsModalLabel').innerText = item.title;
                       document.getElementById('newsIframe').src = `https://www.youtube.com/embed/${videoId}`;
                       newsModal.show();
                   });
                   
                   newsContainer1.appendChild(newsCard);
               });
               $('#loadingSpinnerc').hide();
               $('#cup').show();
           })
           .catch(error => {
               console.error('Error fetching news:', error);
               $('#loadingSpinnerc').show();
               $('#cup').hide();
           });
  
           // Fetch detail liga
           fetch(`https://golfot.my.id/api/infoliga?id=${ids}`)
           .then(response => response.json())
           .then(data => {
               document.getElementById('ligaLogo').src = `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${data.id}.png`;
               document.getElementById('ligaTitle').textContent = data.name;
               document.getElementById('ligaSub').textContent = data.country;
           
           })
           .catch(error => {
           console.error('Error fetching detail:', error);
           $('#loadingSpinnerd').show();
           $('#ligad').hide();
           });

  
           // Fetch berita
           const newsUrl = `https://golfot.my.id/api/news?id=${ids}`;
           const newsContainer = document.getElementById('news-container');
  
           fetch(newsUrl)
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
               $('#loadingSpinnerb').hide();
               $('#beritaid').show();
               $('#loadingSpinnerd').hide();
               $('#ligad').show();
           })
           .catch(error => {
               console.error('Error fetching news:', error);
               $('#loadingSpinnerb').show();
               $('#beritaid').hide();
           });
           
           
           // fetch klasemen
           fetch(`https://golfot.my.id/api/klasemen?id=${ids}`)
           .then(response => response.json())
           .then(data => {
           const tableBody = document.getElementById('tableBody');
           data.forEach((team, index) => {
           const row = document.createElement('tr');
           row.innerHTML = `
           <td class="pos top-${index + 1}">${index + 1}</td>
           <td class="single"><img class="club" src="https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}_xsmall.png" alt="${team.name}" /><span syyle="na">${team.name}</span></td>
           <td>${team.played}</td>
           <td>${team.wins}</td>
           <td>${team.pts}</td>
           `;
           tableBody.appendChild(row);
           $('#loadingSpinnerk').hide();
           $('#klas').show();
           });
           })
           .catch(error => {
          console.error('Error fetching detail:', error);
          $('#loadingSpinnerk').show();
          $('#klas').hide();
          });
           
           
           
           
       });
  
