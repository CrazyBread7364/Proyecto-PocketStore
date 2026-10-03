// 1. Obtener el contenedor del HTML
const container = document.getElementById('app-container');

// 2. Pedir los datos a la API
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    // Tomamos solo los primeros 10 elementos
    const items = data.slice(0, 5);
    
    // Limpiamos el texto de "Cargando..."
    container.innerHTML = '';

    // Mostrar cada producto en pantalla
    items.forEach(item => {
      container.innerHTML += `
        <article class="product-card">
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </article>
      `;
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });