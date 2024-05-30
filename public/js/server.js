document.addEventListener('DOMContentLoaded', function() {
  // Ambil ID dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  // Tampilkan pesan loading sebelum memuat data
  document.getElementById('place').style.display = 'block';
  document.getElementById('serverFrame').style.display = 'none';
  document.getElementById('serverSelect').style.display = 'none';
  
  fetch(`https://golfot.my.id/api/channel?id=${id}`)
  .then(response => response.json())
  .then(data => {
  const serverData = data;
  const selectElement = document.getElementById('serverSelect');
  
  serverData.forEach((server, index) => {
  const serverName = Object.keys(server)[0];
  const option = new Option(serverName, index);
  selectElement.add(option);
  
  });
  
  function setInitialIframeSource() {
  const initialServerUrl = serverData[0][Object.keys(serverData[0])[0]];
  document.getElementById('serverFrame').src = initialServerUrl;
  selectElement.selectedIndex = 0;
  }
  
  function refreshIframe(url) {
  const iframe = document.getElementById('serverFrame');
  iframe.src = '';
  if (typeof url === 'string') {
  iframe.src = url;
  } else {
  //console.error('Error: URL is not a string');
  }
  }
  
  selectElement.addEventListener('change', function() {
  const selectedValue = this.value;
  const selectedServer = serverData[selectedValue];
  const serverUrl = Object.values(selectedServer)[0];
  refreshIframe(serverUrl);
  });
  
  setInitialIframeSource();
  
  // Sembunyikan pesan loading setelah data dimuat
  document.getElementById('place').style.display = 'none';
  document.getElementById('serverFrame').style.display = 'block';
  document.getElementById('serverSelect').style.display = 'block';
  
  })
  .catch(error => {
  console.error('Error fetching data', error);
  // Sembunyikan pesan loading jika terjadi kesalahan
  
  document.getElementById('place').style.display = 'block';
  document.getElementById('serverFrame').style.display = 'none';
  document.getElementById('serverSelect').style.display = 'none';


  });
  
  });
