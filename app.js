const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");
const resetButton = document.getElementById("resetButton");
const progressBar = document.getElementById("progressBar");
const difficultySelect = document.getElementById("difficulty");
const highScoresDiv = document.getElementById("highScores");
const toggleThemeButton = document.getElementById("toggleTheme");
const video = document.createElement("video");  // Video elemanını oluştur

const successSound = document.getElementById("successSound");
const errorSound = document.getElementById("errorSound");
const startMusicButton = document.getElementById("startMusicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
let isDrawing = false;
let points = [];
let guideRadius = 150;
let highScore = 0;
let clickCount = 0;

// Video özelliklerini ayarla
video.src = "video.mp4";  // Burada video dosyanızın yolunu yazın
video.controls = true;  // Kontrolleri ekle (oynat, duraklat vb.)
video.style.position = "fixed";  // Videoyu sabit konumda tut
video.style.top = "0";
video.style.left = "0";
video.style.width = "100%";  // Ekranı tamamen kaplasın
video.style.height = "100%";  // Ekranı tamamen kaplasın
video.style.zIndex = "9999";  // Videoyu diğer öğelerin önünde göster
video.style.display = "none";  // Başlangıçta gizli

document.body.appendChild(video);  // Videoyu sayfaya ekle

toggleThemeButton.addEventListener("click", () => {
    clickCount++;

    // Komik mesajlar
    if (clickCount < 5) {
        alert(`Basma butonuna ${clickCount} kez tıkladınız!`);
    } else if (clickCount === 5) {
        alert("Evet, beşinci tıklama! Şimdi bir video izle!");

        // Videoyu göster ve oynat
        video.style.display = "block";  // Videoyu göster
        video.play();  // Videoyu oynat

        // Videonun bitişiyle ilgili işlem
        video.onended = () => {
            video.style.display = "none";  // Video bittiğinde gizle
            clickCount = 0;  // Sayacı sıfırla
        };
    } else {
        alert("Hadi bir daha tıklamaya ne dersin?");
    }
});
// Zorluk seviyesine göre rehber boyutu
difficultySelect.addEventListener("change", () => {
    switch (difficultySelect.value) {
        case "easy":
            guideRadius = 150;
            break;
        case "medium":
            guideRadius = 100;
            break;
        case "hard":
            guideRadius = 50;
            break;
    }
    resetCanvas();
});

// Rehber daire çiz
function drawGuideCircle() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, guideRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ccc";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
}

// Çizime başla
canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    points = [];
    resetCanvas();
    ctx.beginPath();
    errorSound.play();
});

// Çizim yap
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(e);
    points.push({ x, y });
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#007BFF";
    ctx.lineWidth = 2;
    ctx.stroke();
    updateScore();
});

// Çizimi bitir
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.closePath();
    const score = updateScore();
    if (score > highScore) {
        highScore = score;
        highScoresDiv.textContent = `En Yüksek Skor: %${highScore}`;
        successSound.play();
    }
});

// Mouse pozisyonu al
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Puanlama
function updateScore() {
    if (points.length < 2) return 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const targetRadius = guideRadius;

    // Çizilen her noktanın hedef daireye mesafesi
    const distances = points.map(p => 
        Math.abs(Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2) - targetRadius)
    );

    // Ortalama sapma
    const avgDeviation = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Başlangıç ve bitiş noktaları arasındaki mesafe (kapanış kontrolü)
    const startToEndDistance = Math.sqrt(
        (points[0].x - points[points.length - 1].x) ** 2 +
        (points[0].y - points[points.length - 1].y) ** 2
    );

    // Düzgünlük puanı
    let score = 100 - (avgDeviation * 10) - (startToEndDistance / 5);

    // Puan sınırlandırması
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Güncelleme
    resultDiv.textContent = `Düzgünlük: %${score}`;
    progressBar.style.width = `${score}%`;
    return score;
}

// Canvas sıfırla
resetButton.addEventListener("click", resetCanvas);

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideCircle();
    resultDiv.textContent = "Düzgünlük: %0";
    progressBar.style.width = "0%";
}

// Başlangıç
drawGuideCircle();

// Sayfa yüklendiğinde müziği başlat
document.addEventListener("DOMContentLoaded", () => {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.play().catch(err => {
        console.log("Müzik çalarken bir hata oluştu:", err);
    });
    // Müziği başlatan fonksiyon
function startMusic() {
    backgroundMusic.play().catch(err => {
        console.log("Müzik çalarken bir hata oluştu:", err);
    });
    startMusicButton.style.display = "none"; // Butonu gizle
}

// Buton tıklanırsa müziği başlat
startMusicButton.addEventListener("click", startMusic);
});








