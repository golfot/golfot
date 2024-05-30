const chatBox = document.getElementById('chat-box');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const btnKirim = document.querySelector('.btn-kirim');

const btnLoading = document.querySelector('.btn-loading');

$('#shimmer').show();
$('#chat-box').hide();

// URL API
const links = 'https://script.google.com/macros/s/AKfycbwYatXMG1vdnLsWsx4oioXy8M9gLiWeLbFhdWYX7dMjIX-6lY-7PaK0Ipmjg0dPx4TLvQ/exec';
 
  
  
  // Fungsi untuk memuat pesan
  function loadMessages() {
  fetch(links)
  .then(response => response.json())
  .then(data => {
  chatBox.innerHTML = '';
  if (Array.isArray(data)) {
  data.reverse().forEach(message => {
  
  $('#shimmer').hide();
  $('#chat-box').show();
  
  const cardHTML = `
  <div class="message-container mx-2">
  <div class="message">
  <img src="${message.avatar}" alt="Avatar" class="avatar">
  <div class="bubble">${message.message}</div>
  </div>
  <div class="meta">${timeAgo(message.date)}</div>
  </div>
  `;
  chatBox.insertAdjacentHTML('beforeend', cardHTML);
  });
  } else {
  console.error('Data messages tidak ditemukan atau bukan array.');
  }
  chatBox.scrollTop = chatBox.scrollHeight;
  })
  .catch(error => {
  console.error('Error loading messages:', error);
  });
  }

// Fungsi untuk menghitung waktu yang lalu dari sebuah tanggal
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    
    if (interval > 1) {
        return `${interval} Tahun lalu`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} Bulan lalu`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} Hari lalu`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} Jam lalu`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} Menit lalu`;
    }
    return `${Math.floor(seconds)} Detik lalu`;
}

// Fungsi untuk menghasilkan nama acak dalam format user-XXXX
    function generateRandomName() {
    const randomNumber = Math.floor(Math.random() * 10000); // Menghasilkan angka acak antara 0 dan 9999
    return `user-${randomNumber}`;
}

    function generateRandomAvatar() {
    const randomNumberava = Math.floor(Math.random() * 95) + 1;
    return `https://avatar.iran.liara.run/public/${randomNumberava}`;
}

// Fungsi untuk menambah pesan
function addMessage(event) {
    event.preventDefault(); // Mencegah form mengirimkan data

    const guestMessage = messageInput.value.trim();

    document.getElementById('send-button').style.display = 'none';
    document.getElementById('btn-loading').style.display = 'inline';

    if (guestMessage) {
        const randomName = generateRandomName();
        const randomNameAva = generateRandomAvatar();
        
        const body = JSON.stringify({
            action: 'create',
            name: randomName,
            message: guestMessage,
            avatar: randomNameAva,
        });

        fetch(links, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        })
        .then(() => {
            loadMessages(); // Memuat ulang pesan setelah menambah pesan baru

            document.getElementById('send-button').style.display = 'inline';
            document.getElementById('btn-loading').style.display = 'none';

            nameInput.value = ''; // Mengosongkan input nama
            messageInput.value = ''; // Mengosongkan input pesan
        })
        .catch(error => {
            console.error('Error adding message:', error);

            document.getElementById('send-button').style.display = 'inline';
            document.getElementById('btn-loading').style.display = 'none';
        });
    } else {
        alert('Pesan tidak boleh kosong!');

        document.getElementById('send-button').style.display = 'inline';
        document.getElementById('btn-loading').style.display = 'none';
    }
}

// Event listener untuk tombol kirim
sendButton.addEventListener('click', addMessage);

// Optional: Memuat pesan saat halaman pertama kali dimuat
loadMessages();

// Optional: Memuat pesan setiap 5 detik
setInterval(loadMessages, 5000);