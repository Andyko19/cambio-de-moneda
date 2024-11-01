async function convertir() {
  const monto = document.getElementById("monto").value;
  const moneda = document.getElementById("moneda").value;
  const resultadoDiv = document.getElementById("resultado");

  try {
    // Llama a la API de mindicador.cl
    const response = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!response.ok) throw new Error("Error al obtener los datos");

    const data = await response.json();
    const valorMoneda = data.serie[0].valor;
    const conversion = (monto / valorMoneda).toFixed(2);
    resultadoDiv.innerHTML = `El monto en ${moneda.toUpperCase()} es: ${conversion}`;

    // Generar el gráfico de los últimos 10 días
    mostrarGrafico(data);
  } catch (error) {
    resultadoDiv.innerHTML = `Error: ${error.message}`;
  }
}

function mostrarGrafico(data) {
  const ctx = document.getElementById("grafico").getContext("2d");
  const fechas = data.serie
    .slice(0, 10)
    .map((entry) => entry.fecha.substring(0, 10))
    .reverse();
  const valores = data.serie
    .slice(0, 10)
    .map((entry) => entry.valor)
    .reverse();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: `Historial de los últimos 10 días (${data.codigo.toUpperCase()})`,
          data: valores,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: false },
      },
    },
  });
}
