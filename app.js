firebase.initializeApp({
  apiKey: "AIzaSyDW3kudqEZ3CdhSulOs5tKO5ZWKIDLGN5s",
  authDomain: "conceptualizacion-servicios.firebaseapp.com",
  projectId: "conceptualizacion-servicios"
});

var db = firebase.firestore();

function guardar() {
  var nombre = $("#nombre").val();
  var duracion = $("#duracion").val();
  var genero = $("#genero").val();

  // Validación básica
  if (!nombre || !duracion || !genero) {
    mostrarNotificacion("Todos los campos son obligatorios.");
    return;
  }

  db.collection("users").add({
    Nombre: nombre,
    Duracion: duracion,
    Genero: genero
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
    $("#nombre, #duracion, #genero").val('');
    mostrarNotificacion("Película agregada exitosamente.");
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
    mostrarNotificacion("Error al agregar la película.");
  });
}

// Leer documentos
var tabla = $("#tabla tbody");
db.collection("users").onSnapshot((querySnapshot) => {
  tabla.empty();
  querySnapshot.forEach((doc) => {
    tabla.append(`
      <tr>
        <th scope="row">${doc.id}</th>
        <td>${doc.data().Nombre}</td>
        <td>${doc.data().Duracion}</td>
        <td>${doc.data().Genero}</td>
        <td><button class="btn btn-danger eliminar" data-id="${doc.id}">Eliminar</button></td>
        <td><button class="btn btn-warning editar" data-id="${doc.id}" data-nombre="${doc.data().Nombre}" data-duracion="${doc.data().Duracion}" data-genero="${doc.data().Genero}">Editar</button></td>
      </tr>
    `);
  });

  // Agregar eventos a los nuevos botones
  $(".eliminar").on("click", function () {
    eliminar($(this).data("id"));
  });

  $(".editar").on("click", function () {
    var id = $(this).data("id");
    var nombre = $(this).data("nombre");
    var duracion = $(this).data("duracion");
    var genero = $(this).data("genero");

    editar(id, nombre, duracion, genero);
  });
});

// Borrar documentos
function eliminar(id) {
  db.collection("users").doc(id).delete()
  .then(function () {
    console.log("Document successfully deleted!");
    mostrarNotificacion("Película eliminada exitosamente.");
  })
  .catch(function (error) {
    console.error("Error removing document: ", error);
    mostrarNotificacion("Error al eliminar la película.");
  });
}

// Editar un documento
function editar(id, enombre, eduracion, egenero) {
  $("#nombre").val(enombre);
  $("#duracion").val(eduracion);
  $("#genero").val(egenero);

  var boton = $("#boton");
  boton.html('Editar');

  boton.on("click", function () {
    var washingtonRef = db.collection("users").doc(id);
    var enombre = $("#nombre").val();
    var eduracion = $("#duracion").val();
    var egenero = $("#genero").val();

    return washingtonRef.update({
      Nombre: enombre,
      Duracion: eduracion,
      Genero: egenero
    })
    .then(function () {
      console.log("Document successfully edited");
      boton.html('Guardar');
      $("#nombre, #duracion, #genero").val('');
      mostrarNotificacion("Película editada exitosamente.");
    })
    .catch(function (error) {
      console.error("Error editing document: ", error);
      mostrarNotificacion("Error al editar la película.");
    });
  });
}

// Mostrar notificaciones usando jQuery UI
function mostrarNotificacion(mensaje) {
  $("#notification-message").text(mensaje);
  $("#notification-dialog").dialog({
    modal: true,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      }
    }
  });
}
