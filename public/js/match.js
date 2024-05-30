function fetchMatchData() {
  // Tampilkan spinner loading sebelum memuat data
  $('#loadingSpinner').show();
  $('#datas').hide();
  
  $.ajax({
  url: 'https://golfot.my.id/api/scrape',
  type: 'GET',
  headers: {
  'Content-Type': 'application/x-www-form-urlencoded'
  },
  success: function(matchData) {
  const liveMatch = $('#daftarMatchLive');
  const nonLiveMatch = $('#daftarMatchnoLive');
  
  matchData.forEach(match => {
  const fullLink = match.fullLink;
  
 
  
  const matchTimeClass = match.date === 'LIVE NOW' ? 'live-now' : '';

  // Ambil tautan detail
  
  if (match.date === 'LIVE NOW') {
  
  const id = getIDFromURL(match.url); // Ambil ID dari URL
  const title = `Live Streaming ${match.homeTeam.name} vs ${match.awayTeam.name}`;
 
  const matchCard = $(`
  <div class="card bg border-card rounded-4 m-3 text-white mb-4">
  <a href="detail.html?id=${id}&title=${encodeURIComponent(title)}">
  <div class="card-body p-4">
  <div class="row justify-content-evenly">
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100">
  <div class="text-center">
  <img class="mix-blend-mode" src="${match.homeTeam.img}" height="auto" width="50" />
  <div class="mt-3">
  <h5 class="text-truncate-2" style="font-size: 1.1em; margin: 0;">${match.homeTeam.name}</h5>
  </div>
  </div>
  </div>
  </div>
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100 d-flex flex-column justify-content-center align-items-center text-center">
  <h3 class="${matchTimeClass}" style="font-size: 1em; margin: 0;">${match.time || 'LIVE NOW'}</h3>
  <p class="text-truncate-2 mt-2" style="font-size: 0.9em; margin: 0;">${match.league}</p>
  </div>
  </div>
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100">
  <div class="text-center">
  <img class="mix-blend-mode" src="${match.awayTeam.img}" height="auto" width="50" />
  <div class="mt-3">
  <h5 class="text-truncate-2" style="font-size: 1.1em; margin: 0;">${match.awayTeam.name}</h5>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </a>
  </div>
  `);
  
  liveMatch.append(matchCard);
  
  
  } else {
  
  const matchCard = $(`
  <div class="card bg border-card rounded-4 m-3 text-white mb-4">
   <div class="match-modal" data-toggle="modal" data-target="#myModal" data-time="${match.time}">
  <div class="card-body p-4">
  <div class="row justify-content-evenly">
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100">
  <div class="text-center">
  <img src="${match.homeTeam.img}" height="auto" width="50" />
  <div class="mt-3">
  <h5 class="text-truncate-2" style="font-size: 1.1em; margin: 0;">${match.homeTeam.name}</h5>
  </div>
  </div>
  </div>
  </div>
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100 d-flex flex-column justify-content-center align-items-center text-center">
  <h3 class="${matchTimeClass}" style="font-size: 1em; margin: 0;">${match.time || 'LIVE NOW'}</h3>
  <p class="text-truncate-2 mt-2" style="font-size: 0.9em; margin: 0;">${match.league}</p>
  </div>
  </div>
  <div class="col-4 col-md-4 col-lg-4">
  <div class="h-100">
  <div class="text-center">
  <img src="${match.awayTeam.img}" height="auto" width="50" />
  <div class="mt-3">
  <h5 class="text-truncate-2" style="font-size: 1.1em; margin: 0;">${match.awayTeam.name}</h5>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  `);
  
  nonLiveMatch.append(matchCard);
  // Tambahkan event listener untuk menampilkan modal saat tautan <a> dengan kelas match-modal ditekan

  // Tambahkan event listener untuk menampilkan modal saat div dengan kelas match-modal ditekan
  matchCard.find('.match-modal').click(function() {
  const matchTime = $(this).data('time');
  $('#myModal').modal('show');
  startCountdown(matchTime);
  });
  
  }
  });
  
  // Sembunyikan spinner loading setelah data dimuat
  $('#loadingSpinner').hide();
  $('#datas').show();
  },
  error: function(xhr, status, error) {
  console.error('Error fetching match data:', {
  readyState: xhr.readyState,
  status: xhr.status,
  statusText: xhr.statusText,
  responseText: xhr.responseText
  });
  // Sembunyikan spinner loading jika terjadi kesalahan
  $('#loadingSpinner').show();
  $('#datas').hide();
  }
  });
  }
  
  function getIDFromURL(url) {
  // Menghapus bagian awal URL "https://bolasiar.cc/" dari string URL
  const idStartIndex = url.indexOf('https://bolasiar.cc/') + 'https://bolasiar.cc/'.length;
  const id = url.substring(idStartIndex);
  return id;
  }
  
  let countdownInterval;
  
  function startCountdown(timeString) {
  clearInterval(countdownInterval);
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  let targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  
  if (targetTime <= now) {
  targetTime.setDate(targetTime.getDate() + 1);
  }
  
  function updateCountdown() {
  const now = new Date();
  const totalSeconds = Math.floor((targetTime - now) / 1000);
  if (totalSeconds < 0) {
  clearInterval(countdownInterval);
  document.getElementById('countdown').innerHTML = "Waktu Habis!";
  return;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  document.getElementById('countdown').innerHTML = 
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Memanggil sekali agar tidak menunggu 1 detik pertama
  }
  
  
  
  
  $(document).ready(fetchMatchData);
  
  // Tambahkan event listener untuk menampilkan modal saat tautan <a> ditekan
  
 
  
