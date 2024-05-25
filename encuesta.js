$(document).ready(function () {
    let fecha;
    $('#fecha_prestamo').change((e) => {
 
       fecha = $(e.target).val();
       calcularfecha(fecha)
          .then(result => {
             //este metodo es para si la promesa se resulve correctamente, muestra el resultado
             $("#cuotapen").val(result.Cuotapendiente);
 
          }).catch(err => {
            // Es una forma de controlar y gestionar posibles errores en nuestro código. en caso que la promesa
            // se resuelva incorrectamente muestre el error
            
             console.error("Error al calcular", err);
          });
    });
 
    $('#valorpres').keyup((e) => {
       const deuda = parseInt($('#valorpres').val());
       const pendiente = parseInt($('#cuotapen').val());
       const interes = parseInt($('#intereses').val());
 
       const tot = parseFloat(deuda * parseFloat(interes)) / 100;
       $('#totalpago').val(tot);
    });
 
 
    $('#modalpagos').on('show.bs.modal', (e) => {
 
       // $('#botonModal').click((e) => {
       const form = $('.formulario')[0];
 
 
       if (!form.checkValidity()) {
          e.preventDefault()//Evita abrir el modal 
          e.stopPropagation()
          form.classList.add('was-validated')
 
          Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Debe llenar todos los campos!",
 
          });
 
          return; //detiene el modal
       } else {
          // const tot = (valor_pres + valor_pres * val_inte / 100 * cuotapen);
          let deuda;
          $('#totalpago').val() !== '' ? deuda = $("#totalpago").val() : deuda = $('#valorpres').val();
          $('#prestamo').val(deuda);
          let interes = $("#intereses").val();
          $('#interes').val(interes + ' %');
          let pendiente = $("#cuotapen").val();
 
          $('#valorpago').keyup((e) => {
             let pago = $(e.target).val();
             calcularPago(pago, deuda, interes, pendiente)
                .then(resultado => {
                   // si la promesa se resulve correctamente, muestra el resultado
                   $('#cuota').val(resultado.numCuota);
                   $("#pago_interes").val(resultado.pagoInteres);
                   $("#pago_capital").val(resultado.pagoCapital);
                   $("#valor_actual").val(resultado.valorActual);
 
                }).catch(error => {
                   // si la promesa se resulve incorrectamente, muestra el error
                   console.error("Error al calcular", error);
 
                });
          });
       }
 
 
       $("#guardar").click(function () {
          Swal.fire({
             icon: "success",
             title: "!Su informacion se Guardo¡",
             timer: 1500
          }).then(() => {
             let cuota = parseFloat($('#cuota').val());
             let cuota_pend = parseFloat($('#cuota_pe').val());
 
             if (cuota > cuota_pend) {
                cuota_pend = 0;
                $('#cuota_pe').val(cuota_pend);
             } else {
                cuota_pend = cuota_pend - cuota;
                $('#cuota_pe').val(cuota_pend);
             }
             $('#totalpago').val($('#valor_actual').val());
             $('#modalpagos').modal("hide");
             let modal = $('#modalpagos').find('input');
             modal.each(function () {
                $(this).val('');
             });
          });
 
       });
 
    });
 });
 function calcularPago(p, d, vallnt, pe) {
 
    return new Promise((resolve, reject) => {
 
       let valInt = d / parseFloat(vallnt);//se utiliza para convertir una cadena de texto que representa un número en un valor (número decimal).
       let cuota = (p / valInt).toFixed(1);
       let pago_interes = pe * valInt; // total de interes pagados por el cliente
       // let capital = p - pago_interes;
       let valActual;
       if (pe !== 0 && cuota <= pe) {
          pago_interes = parseFloat(cuota) * valInt;
          valActual = d - pago_interes;
       } else {
          pago_interes = parseFloat(pe) * valInt;
          valActual = d - p;
       }
       let capital = p - pago_interes;
 
       if (cuota >= 0) {
          resolve({
             numCuota: Number(cuota),
             pagoCapital: capital,
             pagoInteres: pago_interes,
             valorActual: valActual
          });
       } else {
          reject('El cálculo de la cuota es invalido ingrese Nuevamente');
       }
    });
 }
 
 function calcularfecha(fec) {
    return new Promise((resolve, reject) => {
 
       let fecha_pres = new Date(fec);
       let fechaActual = new Date();
       //este metododo nos permite Calcular la diferencia en años y meses
       let difAnios = fechaActual.getFullYear() - fecha_pres.getFullYear();
       let difMes = fechaActual.getMonth() - fecha_pres.getMonth();
       let difdia = fechaActual.getDate() - fecha_pres.getDate();
       //Si la diferencia de los dias es negativa no ha pasado un mes
       if (difdia <= 0) {
          difMes -= 1;
       }
       let pendiente = (difAnios * 12) + difMes;
       if (pendiente === 0) {
          pendiente = 1;
       }
       resolve({
          Cuotapendiente: pendiente
       });
       reject('El cálculo de la cuota pendiente es invalida ingrese los valores Nuevamente.');
    });
 }
 function limpiar() {
    let modal = $('#modalpagos').find('input');
       modal.each(function () {
          $(this).val('');
 
       });
 };
 
 $('#cerrar'),click(function(){
 limpiar();
 });

